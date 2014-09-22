<?php

// Change the following line when in production mode or set true if need debug
defined('YII_DEBUG') or define('YII_DEBUG', true);
require_once(realpath(dirname(__FILE__).'/../../components/LBStart.php'));
require_once(realpath(dirname(__FILE__).'/NBLogger.php'));
$start = new LBStart();
$start->run(array(
    'framework' => dirname(__FILE__).'/../../framework',
    'protected' => dirname(__FILE__).'/..'
));

?>
