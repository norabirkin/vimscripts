<?php
class RestClient extends CApplicationComponent {
    
    protected $urlBase = null;
    private $lastResponse;
    private $cookies = array();
    public $EntryPoint = 'index'; 
    
    public function init() {
        $baseUrl = yii::app()->request->getBaseUrl(true). '/' . $this->EntryPoint . '.php/';
        $this->setBaseUrl( $baseUrl );
    }
    
    public function setBaseUrl($urlBase) {
        $this->urlBase = $urlBase;
    }

    public function get($url, $params = array()) {
        return $this->httpRequest($url, $params, 'GET');
    }

    public function post($url, $params = array()) {
        return $this->httpRequest($url, $params, 'POST');
    }

    public function delete($url, $params = array()) {
        return $this->httpRequest($url, $params, 'DELETE');
    }

    public function put($url, $params = array()) {
        return $this->httpRequest($url, $params, 'PUT');
    }
    
    private function sendCookies($ci) {
        foreach ($this->cookies as $name => $value) {
            curl_setopt($ci, CURLOPT_COOKIE, $name . '=' . $value);
        }
    }

    protected function _convertParams($params) {
        return $result = http_build_query($params);
    }

    public function getHttpCode() {
        return $this->httpCode;
    }
    
    public function getLastResponseBody() {
        if (!$this->lastResponse) {
            throw new Exception('no response');
        }
        $lastResponse = explode("\r\n\r\n", $this->lastResponse);
        unset($lastResponse[0]);
        return implode("\r\n\r\n", $lastResponse);
    }
    
    public function getLastResponseHeaders() {
        if (!$this->lastResponse) {
            throw new Exception('no response');
        }
        $lastResponse = explode("\r\n\r\n", $this->lastResponse);
        return $lastResponse[0];
    }
    
    private function setCookies() {
        $lastResponseHeaders = $this->getLastResponseHeaders();
        foreach (explode("\r\n", $lastResponseHeaders) as $line) {
            if (!preg_match('/^Set-Cookie: (.*)/', $line, $matches)) {
                continue;
            }
            $cookie = explode(';', $matches[1]);
            $cookie = explode('=', $cookie[0]);
            $this->cookies[$cookie[0]] = $cookie[1];
        }
    }
    
    private function execute($ci) {
        $this->lastResponse = curl_exec($ci);
        $this->setCookies();
    }

    public function httpRequest($url, $postfields = array(), $method = "GET")
    {
        foreach ($postfields as $key => $value) {
            if (is_null($value)) {
                unset($postfields[$key]);
            }
        }
        $url = $this->urlBase . $url;
        $ci = curl_init();
        curl_setopt($ci, CURLOPT_HEADER, true);
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
        $this->sendCookies($ci);
        $postfields = $this->_convertParams($postfields);
        switch ($method) {
            case 'GET':
                if ($postfields) {
                    $url .= "?" . $postfields;
                }
                break;
            case 'POST':
                curl_setopt($ci, CURLOPT_POST, true);
                if (!empty($postfields)) {
                    curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
                }
                break;
            case 'DELETE':
                if (!empty($postfields)) {
                    curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
                }
                curl_setopt($ci, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
            case 'PUT':
                if (!empty($postfields)) {
                    curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
                }
                curl_setopt($ci, CURLOPT_CUSTOMREQUEST, "PUT");
                break;
        }
        curl_setopt($ci, CURLOPT_URL, $url);
        $this->execute($ci);
        $response = $this->getLastResponseBody();
        curl_close($ci);
        return (array) CJSON::decode($response, true);
    }

}
