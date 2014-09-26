<?php
abstract class JAPILog {
    
    private static $formats = array(
        "raw" => "JAPILogRaw",
        "decoded" => "JAPILogDecoded"
    );
    
    public static function factory($format) {
        if (!array_key_exists($format, self::$formats)) {
            throw new CHttpException(500, "invalid log format");
        }
        $className = self::$formats[$format];
        return new $className;
    }
    
    public function logUnknownException(JAPIConnection $JAPIConnection) {
        yii::log( "\r\n\r\n" . $JAPIConnection->getJSONRequest(), "error", "core-error.REQUEST" );
        yii::log( yii::t( "messages", "unknown exception" ) . "\r\n", "error", "core-error.ERROR" );
    }

    public function addCallTrace(JAPITransaction $transaction) {
        $result = array();
        $trace = debug_backtrace();
        $usefull = false;
        foreach ($trace as $item) {
            if (
                $item['class'] == 'JAPIClientBase' AND
                (
                    $item['function'] == 'call'
                )
            ) {
                $usefull = true;
            }
            if ($usefull AND $item['file']) {
                $result[] = $item['line'] . ' ' . $item['file'];
            }
        }
        $transaction->setTrace($result);
    }
    
    abstract public function logConnection(JAPIConnection $connection);
    
    abstract public function logError(JAPIConnection $connection);
    
} ?>
