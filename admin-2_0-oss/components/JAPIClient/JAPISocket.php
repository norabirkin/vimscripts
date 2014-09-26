<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * Обертка на функции php, работающие с сокетом. Реализует интерфейс JAPISocketInterface
 */
class JAPISocket implements JAPISocketInterface {
    
    private $error;
    private $socket;
    
    public function open($host, $port) {
        if(!$this->socket) {
            $this->socket = @fsockopen( $host, $port, $errno, $errstr, 10);
            if (!$this->socket) {
                $this->error = $errstr;
            }
        } 
    }
    
    public function hasError() {
        if (!$this->socket) {
            return true;
        }
    }
    
    public function write( $message ) {
        fwrite($this->socket, $message);
    }
    
    public function getError() {
        return $this->error; 
    }
    
    public function close() {
        fclose($this->socket);
    }
    
    public function EOF() {
        return feof($this->socket);
    }
    
    public function readLine() {
        return fgets($this->socket);
    }
    
} ?>
