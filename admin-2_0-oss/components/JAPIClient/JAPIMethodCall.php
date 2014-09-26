<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * JAPIMethodCall представляет запрос метода API в соответствии со структурой взаимодействия с JAPI ( соединение состоит из отдельных транзакций, транзакция состоит из запроса и ответа )
 */
class JAPIMethodCall {
    /**
     * Идентификатор транзакции
     * @var integer
     */
    private $id;
    /**
     * Название метода
     * @var string
     */
    private $method;
    /**
     * Параметры метода
     * @var mixed
     */
    private $params;
    /**
     * Cтрока вызова метода
     * @var string JSON строка вызова метода
     */
    private $json;
    private $JAPIClient;
    /**
     * Конструктор
     * @param string $method название метода
     * @param mixed $params параметры метода
     */
    function __construct($method, $params = array(), JAPIClientBase $JAPIClient) {
        $this->JAPIClient = $JAPIClient;
        if (!$method OR !is_string($method)) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'no method name',
                'code' => JAPIClientBase::ERROR_DEFAULT
            ));
        }
        $this->method = $method;
        $this->params = $params;
    }
    /**
     * Сеттер для свойства id
     * @param integer $id идентификатор транзакции
     */
    public function setTransactionID( $id ) {
        $this->id = (int) $id;
    }
    /**
     * Геттер для свойства method
     * @return string название метода
     */
    public function getMethod() {
        return $this->method;
    }
    /**
     * Геттер для свойства params
     * @return mixed параметры метода
     */
    public function getParams() {
        return $this->params;
    }
    /**
     * Создает JSON строку вызова метода
     * @return string JSON строка вызова метода
     */
    public function getJSON() {
        if ($this->json === null) { 
            if (!$this->id) {
                $this->JAPIClient->runHandler('onError', array(
                    'msg' => 'no transaction id',
                    'code' => JAPIClientBase::ERROR_DEFAULT
                ));
            }
            $this->json = CJSON::encode( array(
                'id' => $this->id,
                'method' => $this->method,
                'params' => $this->params
            ));
        } return $this->json;
    }
    
} ?>
