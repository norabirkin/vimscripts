<?php

class RuntimeLog extends CFileLogRoute {
    
    /**
     * @param string $value directory for storing log files.
     * @throws CException if the path is invalid
     */
    public function setLogPath($value)
    {
        $language = Yii::app()->getLanguage();
        Yii::app()->setLanguage('en');
        try {
            parent::setLogPath($value);
        }
        catch (Exception $e) {
            error_log($e->getMessage());
        }       
        Yii::app()->setLanguage($language);
    }
    
    
}
