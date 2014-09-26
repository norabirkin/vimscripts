<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * JAPIConnection представляет соединение с JAPI в соответствии со структурой взаимодействия с JAPI ( соединение состоит из отдельных транзакций, транзакция состоит из запроса и ответа )
 */
class JAPIConnection {
    /**
     * Идентификатор текущей транзакции
     * @var integer
     */
    private $currentTransactionID = 1;
    /**
     * Массив транзакций соединения
     * @var array
     */
    private $transactions = array();
    /**
     * JAPI Клиент
     * @var JAPIClient
     */
    private $JAPIClient;
    /**
     * Конструктор
     * @param JAPIClient $JAPIClient JAPI Клиент
     */
    function __construct( JAPIClientBase $JAPIClient ) {
        $this->JAPIClient = $JAPIClient;
    } 
    /**
     * Возвращает количество транзакций соединения
     * @return integer количество транзакций соединения
     */
    public function transactionsCount() {
        return count($this->transactions);
    }
    /**
     * Возвращает массив транзакций соединения
     * @return array массив транзакций соединения
     */
    public function getTransactions() {
        return $this->transactions;
    }
    /**
     * Возвращает запрос к API
     * @return string запрос к API
     */
    public function getJSONRequest() {
        $json = '';
        foreach ($this->transactions as $transaction) {
            $json .= $transaction->getRequest()->getJSON() . "\r\n";
        }
        return $json;
    }
    /**
     * Возвращает ответ на запрос к API
     * @return string ответ на запрос к API
     */
    public function getJSONResponse() {
        $json = '';
        foreach ($this->transactions as $transaction) {
            $json .= trim($transaction->getResponse()->getJSON()) . "\r\n";
        }
        return $json;
    }
    /**
     * Передает JSON ответ метода API в объект ответа соответствующей транзакции
     * @param string $json ответ метода API 
     */
    public function setResponseData( $json ) {
        $decoded = $this->decodeResponse( $json );
        $this->getTransaction( $this->getTransactionIDFromResponse($decoded) )->getResponse()->setData( $decoded, $json );
    }
    /**
     * Добавляет транзакцию
     * @param string $method имя вызываемого метода API
     * @param mixed $params параметры,с которыми должен быть вызван метод. Обычно представляет собой ассоциативный массив, в котором ключи являются названием параметра, а значения - его значением
     * @return JAPITransaction добавленная транзакция
     */
    public function addTransaction( $method, $params ) {
        $this->transactions[ $this->currentTransactionID ] = $transaction = new JAPITransaction(array(
            'id' => $this->currentTransactionID,
            'request' => new JAPIMethodCall($method, $params, $this->JAPIClient),
            'response' => new JAPIMethodResult($this->JAPIClient),
            'JAPIClient' => $this->JAPIClient
        ));
        $this->currentTransactionID ++;
        return $transaction;
    }
    /**
     * Получает идентификатор транзакции из ответа метода API
     * @param array $decoded ответ метода API
     * @return integer идентификатор транзакции
     */
    private function getTransactionIDFromResponse( $decoded ) {
        $transactionID = $decoded["id"];
        if (!$transactionID OR !is_int( $transactionID )) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'no transaction id in response '.$json,
                'code' => JAPIClientBase::ERROR_JSON_PARSE
            ));
        }
        return $transactionID;
    }
    /**
     * Декодирует JSON ответ метода API
     * @param string $json ответ метода API
     * @return array декодированный ответ метода API
     */
    private function decodeResponse( $json ) {
        if (trim($json) == '"exception"') {
            $this->handleUnknownException();
        }
        $decoded = CJSON::decode( trim($json), true);
        if (!$decoded OR !is_array( $decoded )) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'invalid response '.$json,
                'code' => JAPIClientBase::ERROR_JSON_PARSE
            ));
        }
        return $decoded;
    }
    /**
     * Получает транзакцию по ее идентификатору
     * @param integer $id идентификатор транзакции
     * @return JAPITransaction транзакция
     */
    private function getTransaction( $id ) {
        $transaction = $this->transactions[ $id ];
        if (!$transaction) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'no transaction with id = ' . $id,
                'code' => JAPIClientBase::ERROR_JSON_PARSE
            ));
        }
        return $transaction;
    }
    /**
     * Обрабатывает исключение API
     */
    private function handleUnknownException() {
        $this->JAPIClient->runHandler('onError', array(
            'msg' => 'unknown exception',
            'code' => JAPIClientBase::ERROR_JSON_PARSE
        ));
    }
    /**
     * Прекращает выполнение скрипта, посылая сообщение об ошибке на Front-End, если какой-то из вызванных методов API вернул ошибку
     */
    public function abortIfError() {
        foreach ($this->transactions as $transaction) {
            $transaction->getResponse()->abortIfError();
        }
    }
    /**
     * Проверяет ответы вызванных методов API на ошибку
     * @return boolean истинно, если была ошибка, и ложно если ошибки не было
     */
    public function hasError() {
        foreach ($this->transactions as $transaction) {
            if ( $transaction->getResponse()->isError() ) {
                return true;
            }
        }
        return false;
    }
    
} ?>
