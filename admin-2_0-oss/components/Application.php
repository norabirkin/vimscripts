<?php

class Application extends CWebApplication {
    private $jsonResponseSent = false;
    private $extpath;
    public function __construct($config=null) {
        yii::setPathOfAlias('phpclient', realpath(dirname(__FILE__).'/..'));
        $this->substituteExtPath();
        yii::import('ext.wrest.*');
        parent::__construct($config);
        $this->extpath = yii::getPathOfAlias('ext');
    }
    public function substituteExtPath() {
        yii::setPathOfAlias(
            'ext',
            yii::getPathOfAlias('phpclient').'/components'
        );
    }
    public function restoreExtPath() {
        yii::setPathOfAlias('ext', $this->extpath);
    }
    public function setJsonResponseSent() {
        $this->jsonResponseSent = true;
    }
    public function getJsonResponseSent() {
        return $this->jsonResponseSent;
    }
    public function setRuntimePath($path) {
        $language = Yii::app()->getLanguage();
        Yii::app()->setLanguage('en');
        try {
            parent::setRuntimePath($path);
        }
        catch (Exception $e) {
            error_log($e->getMessage());
        }       
        Yii::app()->setLanguage($language);
    }
    public function displayException($exception) {
        if (!$this->jsonResponseSent) {
            parent::displayException($exception);
        }
    }
}

?>
