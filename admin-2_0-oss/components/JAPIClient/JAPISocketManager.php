<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * Менеджер сокета
 */
class JAPISocketManager {
    /**
     * Соединение с API
     * @var JAPIConnection
     */
    private $connection;
    /**
     * Конфигурация JAPI Клиента. Массив, в котором должны быть элементы с ключами 'requestHost' и 'requestPort', содержащие хост и порт для подклдючения к API
     * @var array
     */
    private $config;
    /**
     * Обертка на функции php, работающие с сокетом
     * @var JAPISocketInterface
     */
    private $socket;
    private $JAPIClient;
    /**
     * Конструктор
     * @param array $params Массив, содержащий элементы с ключами "socket" и "connection", значения которых, присваиваются соответствующим свойствам объекта JAPISocketManager
     */
    function __construct($params) {
        $this->setConfig(yii::app()->params);
        $this->setSocket($params["socket"]);
        $this->setConnection($params["connection"]);
        $this->setJAPIClient($params['JAPIClient']);
    }
    /**
     * Посылает запрос к API
     */
    public function send() {
        $this->openSocket();
        $this->socket->write( $this->connection->getJSONRequest() );
        $this->getResponses();
        //$this->socket->close();
    }
    /**
     * Открывает сокет
     */
    private function openSocket() {
        $this->socket->open( $this->getRequestHost(), $this->getRequestPort() );
        if ($this->socket->hasError()) {
            $this->handleConnectionError();
        }
    }
    /**
     * Получает ответ от API
     */
    private function getResponses() {
        for ($i = 1; $i <= $this->connection->transactionsCount(); $i++) {
            if (!$this->socket->EOF()) {
                $this->connection->setResponseData( $this->socket->readLine() );
            }
        }
    }
    /**
     * Получает хост для подключения к API
     * @return string хост для подключения к API
     */
    private function getRequestHost() {
        return $this->config['requestHost'];
    }
    /**
     * Получает порт для подключения к API
     * @return integer порт для подключения к API
     */
    private function getRequestPort() {
        return $this->config['requestPort'];
    }
    /**
     * Сеттер для свойства connection
     * @param JAPIConnection $connection соединение с API
     */
    public function setConnection( JAPIConnection $connection ) {
        $this->connection = $connection;
    }
    /**
     * Сеттер для свойства socket
     * @param JAPISocketInterface $socket обертка на функции php, работающие с сокетом
     */
    public function setSocket( JAPISocketInterface $socket ) {
        $this->socket = $socket;
    }
    public function setJAPIClient(JAPIClientBase $JAPIClient) {
        $this->JAPIClient = $JAPIClient;
    }
    /**
     * Сеттер для свойства config
     * @param array Конфигурация JAPI Клиента
     */
    public function setConfig($config) {
        $this->config = $config;
        if (!($this->config['requestHost']) OR !($this->config['requestPort'])) {
            $this->JAPIClient->runHandler('onError', array(
                'code' => JAPIClientBase::ERROR_JSON_PARSE,
                'msg' => 'invalid connection config'
            ));
        }
    }
    /**
     * Обработка ошибки открытия сокета
     */
    private function handleConnectionError() {
        $this->JAPIClient->runHandler('onError', array(
            'code' => JAPIClientBase::ERROR_CONNECTION,
            'msg' => array(
                $this->socket->getError().' {host}:{port}',
                array(
                    '{host}' => $this->getRequestHost(),
                    '{port}' => $this->getRequestPort()
                )
            )
        ));
    }
    
} ?>
