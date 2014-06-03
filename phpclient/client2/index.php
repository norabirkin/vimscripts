<?php
// Error Handler

ini_set("display_errors", true);
error_reporting(E_ALL & ~(E_STRICT|E_NOTICE)); 

//error_reporting(E_ALL | E_NOTICE | E_STRICT);

defined('YII_DEBUG') or define('YII_DEBUG', true);

if (!ini_get('date.timezone')) {
    // Suppress DateTime warnings
    date_default_timezone_set(@date_default_timezone_get());
}

$yii = dirname(__FILE__).'/framework/yii.php';
$config = dirname(__FILE__).'/protected/config/lanbilling.config.php';
$client_config = '/usr/local/billing/client.main.php';

require_once($yii);

// Include client config (/usr/local/billing/client.main.php) if exists
// @todo: make requirements page
if (file_exists($client_config) && is_readable($client_config)){
    $config = CMap::mergeArray(
        require_once($config),
        require_once($client_config)
    );
}
$app = Yii::createWebApplication($config);
Yii::getLogger()->autoFlush = 1;
Yii::getLogger()->autoDump = true;
$app->run();
