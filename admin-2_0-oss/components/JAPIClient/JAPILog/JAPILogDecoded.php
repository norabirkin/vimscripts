<?php
class JAPILogDecoded extends JAPILog {
    
    private $requestmsg = array();
    private $responsemsg = array();
    
    private function restart() {
        $this->requestmsg = array();
        $this->responsemsg = array();
    }
    
    public function logConnection(JAPIConnection $connection ) {
        foreach ($connection->getTransactions() as $transaction) {
            $this->addTransaction($transaction);
        }
        $this->output();
        $this->restart();
    }
    
    public function logError( CEvent $event ) {
        foreach ($event->params["connection"]->getTransactions() as $transaction) {
            $response = $transaction->getResponse();
            $request = $transaction->getRequest();
            if ( $response->isError() ) {
                yii::log("\r\n\r\nMETHOD: " . $request->getMethod() . "\r\nPARAMS: " . $this->vardump($request->getParams()), "error", Logger::getAliasOfPath(__FILE__) );
                yii::log( $response->getErrorMessage() . "\r\n", "error", Logger::getAliasOfPath(__FILE__)  );
            }
        }
    }
    
    public function addTransaction( $transaction ) {
        $this->addTransactionID( $transaction );
        $this->addRequest( $transaction );
        $this->addResponse( $transaction );
    }
    
    public function addRequest( $transaction ) {
        $request = $transaction->getRequest();
        $this->requestmsg[] = "METHOD: " . $request->getMethod();
        $this->requestmsg[] = "PARAMS: " . $this->vardump( $request->getParams() );
    }
    
    public function addResponse( $transaction ) {
        $response = $transaction->getResponse();
        if ($response->isError()) {
            $this->addError($response);
        } else {
            $this->addResult($response);
        }
    }
    
    public function addError( $response ) {
        $this->responsemsg[] = "ERROR: " . $response->getErrorMessage();
        $this->responsemsg[] = "";
    }
    
    public function addResult( $response ) {
        $this->responsemsg[] = "RESULT: " . $this->vardump( $response->getBody() );
    }
    
    public function addTransactionID( $transaction ) {
        $msg = "TRANSACTION: " . $transaction->getID();
        $this->requestmsg[] = $msg;
        $this->responsemsg[] = $msg;
    }
    
    public function output() {
        yii::log( "\r\n\r\n". implode("\r\n", $this->requestmsg), 'info', Logger::getAliasOfPath(__FILE__) );
        yii::log( "\r\n\r\n". implode("\r\n", $this->responsemsg), 'info', Logger::getAliasOfPath(__FILE__) );
    }
    
    private function vardump( $var ) {
        $var = $this->processForDump( $var );
        if (is_scalar($var)) {
            return $this->dumpScalar($var);
        } else {
            return $this->dumpArrayOrObject($var);
        }
    }
    
    private function dumpScalar( $var ) {
         return $var . "\r\n";
    }
    
    private function dumpArrayOrObject( $var ) {
        ob_start();
        print_r($var);
        $dump = ob_get_contents();
        ob_end_clean();
        return $dump;
    }
    
    private function processForDump( $var ) {
        if ($var === false) {
            return "FALSE";
        }
        if ($var === true) {
            return "TRUE";
        }
        if ($var === null) {
            return "NULL";
        }
        return $var;
    }
    
} ?>
