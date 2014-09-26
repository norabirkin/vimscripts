<?php
class JAPILogRaw extends JAPILog {
    
    public function logConnection(JAPIConnection $connection) {
        $this->briefLog($connection);
        yii::log( "\n\n" . $connection->getJSONRequest(), 'info', Logger::getAliasOfPath(__FILE__) );
        yii::log( "\n\n" . $connection->getJSONResponse(), 'info', Logger::getAliasOfPath(__FILE__) );
    }
    
    public function logError(JAPIConnection $connection) {
        foreach ($connection->getTransactions() as $transaction) {
            $response = $transaction->getResponse();
            $request = $transaction->getRequest();
            if ( $response->isError() ) {
                yii::log( $request->getJSON(), "error", "core-error.REQUEST" );
                yii::log( $response->getJSON(), "error", "core-error.ERROR"  );
            }
        }
    }
    
    public function briefLog(JAPIConnection $connection) {
        $k = 1;
        $brief = array();
        foreach ($connection->getTransactions() as $transaction) {
            $brief["CALL [$k] ".$transaction->getRequest()->getMethod()] = array(
                'params' => $transaction->getRequest()->getParams(),
                'result' => $transaction->getResponse()->getBody(),
                'TRACE' => $transaction->getTrace()
            );
            $k ++;
        }
        yii::log($brief, 'details', Logger::getAliasOfPath(__FILE__));
    }
} ?>
