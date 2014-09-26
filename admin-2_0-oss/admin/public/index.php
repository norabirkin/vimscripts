<?php

// Change the following line when in production mode or set true if need debug
defined('YII_DEBUG') or define('YII_DEBUG', true);
// application build information
defined('APP_BUILD') or define('APP_BUILD', '@DEVBUILD@');
// remove the following lines when in production mode
defined('YII_DEVELOP') or define('YII_DEVELOP',true);
// Specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 0);
// Them name to use
defined('XTHEME_NAME') or define("XTHEME_NAME", "lanbilling");
require_once(realpath(dirname(__FILE__).'/../../components/LBStart.php'));
$start = new LBStart();
$start->run(array(
    'framework' => dirname(__FILE__).'/../../framework',
    'protected' => dirname(__FILE__).'/..'
));

?>
