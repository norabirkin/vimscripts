<?php

class Payment_Assist_Response {
    private $data;
    private $error;
    private $dic1 = null;
    private $dic2 = null;
    private $dic3 = null;
    private $result;
    public function __construct( $data ) {
        $this->data = $data;
        if (substr( $this->data, 0, 5 ) == "ERROR") {
            $this->error = substr( $this->data, 6 );
            $this->error = explode( ";", trim($this->error) );
            $this->error = explode( ":", trim($this->error[1]) );
            $this->dic1 = require("dictionary/dic1.php");
            $this->dic2 = require("dictionary/dic2.php");
        } else {
            $this->dic3 = require("dictionary/dic3.php");
            $data = array();
            $array = str_getcsv( $this->data, ";" );
            foreach ($array as $item) {
                if (!$item) continue;
                $item = explode( ":", $item );
                $data[ $item[0] ] = $item[1];
            }
            $this->result = $data;
        }
    }
    public function descr($param) {
        return $this->dic3[$param];
    }
    public function param($param) {
        return $this->result[$param];
    }
    public function result() {
        return $this->result;
    }
    public function error() {
        return $this->error !== null;
    }
    public function errorType() {
        return $this->dic[$this->error[0] ];
    }
    public function errorDetail() {
        return $this->dic[$this->error[1] ];
    }
}

?>
