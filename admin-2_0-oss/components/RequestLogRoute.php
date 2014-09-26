<?php

class RequestLogRoute extends RuntimeLog {
    protected function formatLogMessage($message,$level,$category,$time) {
        return parent::formatLogMessage(
            "\n".$message,
            yii::app()->request->getRequestUri()."] [$level",
            $category,
            $time
        );
    }
    protected function processLogs($logs) {
        $messages = array();
        $k = 1;
        foreach ($logs as $item) {
            $messages["CONNTECTION [$k]"] = $item[0];
            $k ++;
        }
        $messages['SESSION'] = $_SESSION;
        VarDumper::$simple = true;
        parent::processLogs(array(
            array(
                VarDumper::dumpAsString($messages),
                $logs[0][1],
                $logs[0][2],
                $logs[0][3]
            )
        ));
        VarDumper::$simple = false;
    }
}

?>
