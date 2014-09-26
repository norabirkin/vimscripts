<?php

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * JAPI Клиент
 */
class JAPIClientBase {
    /**
     * Логгер соединений с API
     * @var JAPILog
     */
    protected $JAPILog;
    /**
     * Соединение с API
     * @var JAPIConnection
     */
    protected $JAPIConnection;
    /**
     * Обертка на функции php, работающие с сокетом
     * @var JAPISocketInterface
     */
    protected $JAPISocket;
    private $handlers = array();

    const ERROR_DEFAULT = 0;
    const ERROR_JSON_PARSE = 1;
    const ERROR_JSON_RESPONSE = 2;
    const ERROR_CONNECTION = 3;
    /**
     * Инициализация JAPI Клиента
     */
    public function __construct() {
        $this->setSocket(new JAPISocket);
    }
    /**
     * Добавляет в запрос вызов метода API и добавляет в запрос вызов метода авторизации, если он еще не был добавлен
     * @param string $method имя метода
     * @param mixed $params параметры,с которыми должен быть вызван метод. Обычно представляет собой ассоциативный массив, в котором ключи являются названием параметра, а значения - его значением
     * @return JAPIMethodResult объект, предоставляющий доступ к значению, возвращенному методом API
     */
    public function call($method, $params = null) {
        if (!$params) {
            $params = new stdClass;
        }
        $transaction = $this->getJAPIConnection()->addTransaction($method, $params);
        $response = $transaction->getResponse();
        $this->runHandler('onCall', array(
            'transaction' => $transaction
        ));
        return $response;
    }
    /**
     * Вызывает метод API и возвращает значение, возвращаемое вызванным методом, или, в случае ошибки, завершает выполнение скрипта с отправкой сообщения об ошибке в Front-End
     * @param string $method имя метода
     * @param mixed $params параметры,с которыми должен быть вызван метод. Обычно представляет собой ассоциативный массив, в котором ключи являются названием параметра, а значения - его значением
     * @return mixed значение, возвращаемое вызванным методом API
     */
    public function callAndSend($method, $params = array()) {
        $response = $this->call($method, $params);
        $this->send();
        $response->abortIfError();
        return $response->getResult();
    }
    /**
     * Отправка запроса к API
     * @param boolean $abortIfError завершить выполнение скрипта в случае ошибки, и отправить сообщение об ошибке в Front-End
     * @return JAPIConnection соединение с API
     */
    public function send( $abortIfError = false ) {
        if (!$this->getJAPIConnection()->getTransactions()) {
            $this->runHandler('onError', array(
                'msg' => 'No JAPI request',
                'code' => ERROR_DEFAULT
            ));
        }
        $this->getJAPISocketManager()->send();
        $this->runHandler('onSend');
        $connection = $this->getJAPIConnection();
        $this->restart();
        if ($abortIfError) {
            $connection->abortIfError();
        }
        return $connection;
    }
    public function hasRequest() {
        return (bool) $this->getJAPIConnection()->getTransactions();
    }
    /**
     * Создание объекта менеджера сокета
     * @return JAPISocketManager менеджера сокета
     */
    public function getJAPISocketManager() {
        return new JAPISocketManager( array(
            "socket" => $this->JAPISocket, 
            "connection" => $this->getJAPIConnection(),
            'JAPIClient' => $this
        ));
    }
    /**
     * Возвращение JAPI Клиента к исходному состоянию для формирования нового запроса к API
     */
    public function restart() {
        $this->JAPIConnection = null;
    }
    /**
     * Сеттер для свойства JAPISocket
     * @param JAPISocketInterface $JAPISocket обертка на функции php, работающие с сокетом
     */
    public function setSocket( JAPISocketInterface $JAPISocket ) {
        $this->JAPISocket = $JAPISocket;
    }
    /**
     * Cоздает и возвращает объект соединения с API или возвращает уже созданный 
     * @return JAPIConnection соединение с API
     */
    public function getJAPIConnection() {
        if (!$this->JAPIConnection) {
            $this->JAPIConnection = new JAPIConnection($this);
        }
        return $this->JAPIConnection;
    }
    /**
     * Возвращает сформированный запрос к API 
     * @return string запрос к API
     */
    public function getJSONRequest() {
        return $this->getJAPIConnection()->getJSONRequest();
    }
    public function addHandler($event, $handler) {
        $this->handlers[$event] = $handler;
    }
    public function runHandler($event, $params = array(), $default = null) {
        if (!($callback = $this->handlers[$event])) {
            return $default;
        }
        if (
            !is_array($callback) ||
            !$callback[0] ||
            !is_object($callback[0]) ||
            !is_string($callback[1])
        ) {
            throw new Exception('Invalid callback');
        }
        $obj = $callback[0];
        $method = $callback[1];
        return $obj->$method($params);
    }
}

?>
