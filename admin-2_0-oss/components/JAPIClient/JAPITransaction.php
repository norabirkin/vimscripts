<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * JAPITransaction представляет транзакцию соединения с JAPI в соответствии со структурой взаимодействия с JAPI ( соединение состоит из отдельных транзакций, транзакция состоит из запроса и ответа )
 */
class JAPITransaction {
    /**
     * Идентификатор транзакции
     * @var integer
     */
    private $id;
    /**
     * Запрос метода API
     * @var JAPIMethodCall
     */
    private $request;
    /**
     * Ответ метода API
     * @var JAPIMethodResult
     */
    private $response;
    private $trace;
    private $JAPIClient;
    /**
     * Конструктор
     * @param array конфигурация транзакции. Массив состоящий из элементов с ключами "id", "request" и "response", значения которых соответствуют свойствам класса JAPITransaction
     */
    function __construct( $config ) {
        $this->setID( $config["id"] ); 
        $this->setRequest( $config["request"] ); 
        $this->setResponse( $config["response"] );
        $this->setJAPIClient($config['JAPIClient']);
    }
    function setJAPIClient( JAPIClientBase $JAPIClient ) {
        $this->JAPIClient = $JAPIClient;
    } 
    public function setTrace($trace) {
        $this->trace = $trace;
    }
    public function getTrace() {
        return $this->trace;
    }
    /**
     * Сеттер для свойства id
     * @param integer идентификатор транзакции
     */
    private function setID( $id ) {
        $this->id = (int) $id;
        if (!$this->id) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'invalid id',
                'code' => JAPIClientBase::ERROR_DEFAULT
            ));
        }
    }
    /**
     * Геттер для свойства id
     * @return integer идентификатор транзакции
     */
    public function getID() {
        return $this->id;
    }
    /**
     * Сеттер для свойства request
     * @param JAPIMethodCall запрос метода API
     */
    private function setRequest( JAPIMethodCall $request ) {
        $request->setTransactionID( $this->id );
        $this->request = $request;
    }
    /**
     * Геттер для свойства request
     * @return JAPIMethodCall запрос метода API
     */
    public function getRequest() {
        return $this->request;
    }
    /**
     * Сеттер для свойства response
     * @param JAPIMethodResult ответ метода API
     */
    private function setResponse( JAPIMethodResult $response ) {
        $this->response = $response;
        $this->response->setTransaction($this);
    }
    /**
     * Геттер для свойства response
     * @return JAPIMethodResult ответ метода API
     */
    public function getResponse() {
        return $this->response;
    }
    
} ?>
