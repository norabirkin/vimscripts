<?php
// Error Handler

ini_set("display_errors", false);
error_reporting(E_ALL & ~(E_STRICT|E_NOTICE)); 
defined('YII_ENABLE_EXCEPTION_HANDLER') or define('YII_ENABLE_EXCEPTION_HANDLER', false);
defined('YII_DEBUG') or define('YII_DEBUG', false);

if (!ini_get('date.timezone')) {
    // Suppress DateTime warnings
    date_default_timezone_set(@date_default_timezone_get());
}

$yii = realpath(dirname(__FILE__).'/../framework/yii.php');
$config = dirname(__FILE__).'/protected/config/main.php';
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
Yii::createWebApplication($config)->run();
