<?php 
	ob_start();
	defined('YII_DEBUG') or define('YII_DEBUG',true);
	defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 0);
	ini_set("display_errors", true);
	error_reporting(E_ALL & ~(E_STRICT|E_NOTICE)); 
	$s = DIRECTORY_SEPARATOR;
	$b = $s . '..';
	$dir = dirname(__FILE__);
	$base = realpath($dir.str_repeat($b, 2));
	$yiit = $base . $s . 'framework' . $s . 'yiit.php';
	$config = $base . $s . 'protected' . $s . 'config' . $s . 'lanbilling.config.php';
	require_once($yiit);
	
	$config = require_once($config);
	
	foreach ($config['preload'] as $k => $v) {
		if ($v == 'lanbilling') unset($config['preload'][$k]);
	}
	
	Yii::createWebApplication($config);
	Yii::getLogger()->autoFlush = 1;
	Yii::getLogger()->autoDump = true;
	yii::import('application.tests.LBTestCase');
	yii::import('application.tests.LBFake');
	yii::import('application.tests.fixtures.testClass');
	yii::import('application.tests.SerializedObjects');
?>