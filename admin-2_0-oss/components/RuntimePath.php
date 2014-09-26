<?php

class RuntimePath extends CStatePersister {
    
    public function init()
    {
        $language = Yii::app()->getLanguage();
        Yii::app()->setLanguage('en');
        try {
            parent::init();
        }
        catch (Exception $e) {
            error_log($e->getMessage());
        }       
        Yii::app()->setLanguage($language);
    }
    
    
    /**
    * Saves application state in persistent storage.
    * @param mixed $state state data (must be serializable).
    */
    public function save($state)
    {
        $language = Yii::app()->getLanguage();
        Yii::app()->setLanguage('en');
        try {
            @file_put_contents($this->stateFile,serialize($state),LOCK_EX);
        }
        catch (Exception $e) {
            error_log($e->getMessage());
        }           
        Yii::app()->setLanguage($language);
    }
    
}
