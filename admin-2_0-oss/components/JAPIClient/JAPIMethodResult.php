<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * JAPIMethodResult представляет ответ метода API в соответствии со структурой взаимодействия с JAPI ( соединение состоит из отдельных транзакций, транзакция состоит из запроса и ответа )
 */
class JAPIMethodResult {
    /**
     * Декодированный ответ метода API
     * @var array
     */
    private $decoded;
    /**
     * JSON строка метода API
     * @var string
     */
    private $json;
    /**
     * Тело ответа метода API
     * @var mixed
     */
    private $body;
    /**
     * Свойство, определяющее, является ли ответ метода API сообщением об ошибке
     * @var boolean
     */
    private $iserror;
    /**
     * Сообщение об ошибке
     * @var string
     */
    private $errormsg;
    private $JAPIClient;
    private $JAPITransaction;
    public function __construct(JAPIClientBase $JAPIClient) {
        $this->JAPIClient = $JAPIClient;
    }
    /**
     * Устанавливает значения для свойств decoded и json
     * @param array $decoded декодированный ответ метода API
     * @param string $json JSON строка метода API
     */
    public function setData($decoded, $json) {
        $this->decoded = $decoded;
        $this->json = $json;
    }
    /**
     * Геттер для свойства decoded
     * @return array декодированный ответ метода API
     */
    public function getDecoded() {
        if (!$this->decoded) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'no data',
                'code' => JAPIClientBase::ERROR_JSON_PARSE
            ));
        }
        return $this->decoded;
    }
    /**
     * Геттер для свойства json
     * @return string JSON строка метода API
     */
    public function getJSON() {
        if (!$this->json) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => 'no data',
                'code' => JAPIClientBase::ERROR_JSON_PARSE
            ));
        }
        return $this->json;
    }
    /**
     * Получает тело ответа метода API
     * @return mixed тело ответа метода API
     */
    public function getBody() {
        if (!$this->body) {
            $data = $this->getDecoded();
            if ($this->isError()) {
                $this->body = $data['error'];
            } else {
                $this->body = $data['result'];
            }
        }   return $this->body;
    }
    /**
     * Получает значение, возвращаемое методом API
     * @param mixed $default значение по-умолчанию, возвращаемое в случае ошибки
     * @return mixed значение возвращаемое методом API
     */
    public function getResult( $default = array() ) {
        if ($this->isError()) {
            return $default;
        } else {
            return $this->getBody();
        }
    }
    /**
     * Получает сообщение об ошибке
     * @return string сообщение об ошибке
     */
    public function getErrorMessage() {
        if ($this->errormsg === null) {
            if (!$this->isError()) {
                $this->errormsg = '';
            }
            $data = $this->getDecoded();
            $this->errormsg = $this->JAPIClient->runHandler('translate', $data['error']['template'], $data['error']['template']);
            for ($i = 1; $i <= count($data['error']['values']); $i ++) {
                $this->errormsg = str_replace( '$' . $i, $this->JAPIClient->runHandler('translate', $data['error']['values'][( $i - 1 )], $data['error']['values'][( $i - 1 )]), $this->errormsg);
            }
        }   return $this->errormsg;
    }
    /**
     * Проверяет является ли ответ метода API сообщением об ошибке
     * @return boolean является ли ответ метода API сообщением об ошибке
     */
    public function isError() {
        if ($this->iserror === null) {
            $data = $this->getDecoded();
            if (isset($data['result']) AND !isset($data['error'])) {
                $this->iserror = false;
            }
            elseif (isset($data['error']) AND isset($data['error']['template']) AND isset($data['error']['values'])) $this->iserror = true;
            else {
                $this->JAPIClient->runHandler('onError', array(
                    'msg' => 'invalid data ' . $this->getJSON(),
                    'code' => JAPIClientBase::ERROR_JSON_PARSE
                ));
            }
        }   return $this->iserror;
    }
    public function setTransaction(JAPITransaction $JAPITransaction) {
        $this->JAPITransaction = $JAPITransaction;
    }
    /**
     * Прекращает выполнение скрипта, посылая сообщение об ошибке на Front-End, если ответ метода API является сообщением об ошибке
     */
    public function abortIfError() {
        if ($this->isError()) {
            $this->JAPIClient->runHandler('onError', array(
                'msg' => $this->getErrorMessage(),
                'code' => JAPIClientBase::ERROR_JSON_RESPONSE,
                'params' => array(
                    'transaction' => $this->JAPITransaction
                )
            ));
        }
    }
    
} ?>
