<?php

class LBStart {
    public function run($params) {
        ini_set("display_errors", YII_DEBUG);
        error_reporting(E_ALL & ~(E_STRICT|E_NOTICE)); 

        // change the following paths if necessary
        $framework = $params['framework'];
        $protected = $params['protected'];

        require_once($framework.'/yii.php');
        require_once(realpath(dirname(__FILE__).'/LBConfiguration.php'));
        require_once(realpath(dirname(__FILE__).'/Logger.php'));
        require_once(realpath(dirname(__FILE__).'/Application.php'));

        $configuration = new LBConfiguration($protected);
        $config = $configuration->getConfig();


        $logger = new Logger;
        Yii::setLogger($logger);

        Yii::createApplication('Application', $config)->run();
    }
}

?>
