<?php

class Request {
    private $url;
    private $c;
    private $params;
    private $method;
    private $format;
    private $cookies = array();
    public function __construct($params) {
        if (!function_exists('curl_init')) {
            throw new Exception('Расширение CUrl не установлено');
        }
        $this->url = $params['url'];
        $this->method = $params['method'];
        $this->format = $params['format'] ? $params['format'] : 'urlencoded';
        $this->params = $this->process($params['params']);
        $this->restoreCookies();
    }
    public function call() {
        $result = null;
        $this->init();
        $response = $this->execute();
        if ($error = $this->error()) {
            $this->fail($error);
        } else {
            $result = $this->success($response);
        }
        $this->saveCookies();
        return $result;
    }
    private function init() {
        $this->c = curl_init();
        $this->specific();
        foreach (array(
            CURLINFO_HEADER_OUT => true,
            CURLOPT_HEADER => true,
            CURLOPT_URL => $this->url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ) as $k => $v) {
            $this->set($k, $v);
        }
        $this->sendCookies();
    }
    private function specific() {
        if ($this->method == 'get' && $this->params) {
            $this->url .= (strpos($this->url, '?') ? '&' : '?').$this->params;
        }
        if ($this->method != 'get') {
            if ($this->format == 'json') {
                $this->set(CURLOPT_HTTPHEADER, array(
                    'Content-type: application/json'
                ));
            }
            $this->set(CURLOPT_POSTFIELDS, $this->params);
        }
        if ($this->method == 'post') {
            $this->set(CURLOPT_POST, true);
        }
        if ($this->method == 'delete') {
            $this->set(CURLOPT_CUSTOMREQUEST, 'DELETE');
        } elseif ($this->method == 'put') {
            $this->set(CURLOPT_CUSTOMREQUEST, 'PUT');
        }
    }
    private function success($response) {
        $this->log(array(
            'REQUEST',
            $this->headers().$this->params,
            'RESPONSE',
            $response
        ));
        $this->close();
        return $this->body($response);
    }
    private function fail($error) {
        $this->log(array(
            'URL',
            $this->url,
            'PARAMS',
            $this->params,
            'ERROR',
            $error
        ));
        $this->close();
        throw new Exception($error);
    }
    private function process($params) {
        if (!$params) {
            return '';
        }
        if ($this->format == 'urlencoded') {
            return http_build_query($params);
        } elseif ($this->format == 'json') {
            return json_encode($params);
        }
    }
    private function setCookies($response) {
        $response = explode("\r\n\r\n", $response);
        $headers = $response[0];
        foreach (explode("\r\n", $headers) as $line) {
            if (!preg_match('/^Set-Cookie: (.*)/', $line, $matches)) {
                continue;
            }
            $cookie = explode(';', $matches[1]);
            $cookie = explode('=', $cookie[0]);
            $this->cookies[$cookie[0]] = $cookie[1];
        }
    }
    private function sendCookies() {
        $cookies = array();
        foreach ($this->cookies as $name => $value) {
            $cookies[] = $name . '=' . $value;
        }
        if (!$cookies) {
            return;
        }
        $this->set(CURLOPT_COOKIE, implode(';', $cookies));
    }
    private function saveCookies() {
        if (!file_put_contents(
            realpath(
                dirname(__FILE__).
                DIRECTORY_SEPARATOR.
                'cookies.json'
            ),
            json_encode(
                $this->cookies
            )
        )) {
            throw new Exception('Cannot save cookies');
        }
    }
    private function restoreCookies() {
        if (
            !($cookies = file_get_contents('cookies.json')) ||
            !($cookies = json_decode($cookies, true)) ||
            !is_array($cookies)
        ) {
            $cookies = array();
        }
        $this->cookies = $cookies;
    }
    private function body($response) {
        $data = explode("\r\n\r\n", $response);
        return json_decode($data[1], true);
    }
    private function set($k, $v) {
        curl_setopt($this->c, $k, $v);
    }
    private function execute() {
        $response = curl_exec($this->c);
        $this->setCookies($response);
        return $response;
    }
    private function close() {
        curl_close($this->c);
    }
    private function headers() {
        return curl_getinfo($this->c, CURLINFO_HEADER_OUT);
    }
    private function error() {
        return curl_error($this->c);
    }
    private function log($val, $dump = false) {
        include_once('Logger.php');
        if (!$dump) {
            $data = array();
            foreach ($val as $item) {
                if ($item = str_replace("\r\n", "\n", trim($item))) {
                    $data[] = $item;
                }
            }
            $val = implode("\n\n", $data);
        }
        Logger::log($val);
    }
}

?>
