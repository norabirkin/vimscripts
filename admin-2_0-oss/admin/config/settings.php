<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    
    'name'=>'OSS',
    
    // Localization
    'language' => 'ru',
    
    // autoloading model and component classes
    'import'=>array(
        'application.components.Options.Option',
        'application.components.Catalog.*',
        'application.components.tariffs.*',
        'application.components.rules.*',
        'application.components.RoutesDescription.RoutesDescription',
        'application.components.Catalog.Types.*'
    ),
    
    // application components
    'components'=>array(
        'rest' => array(
            'class' => 'RestClient',
            'EntryPoint' => 'index'
        ),
        'clientScript' => array(
            'scriptMap' => array(
                'jquery.js' => false,
                'jquery.yiiactiveform.js' => false
            )
        ),
        'user'=>array(
            'class' => 'CWebUser',
            'allowAutoLogin'=>true
        ),
        'errorHandler'=>array(
            'errorAction'=>'api/error/error'
        ),
        'urlManager'=>array(
            'urlFormat'=>'path',
            'rules'=>require(dirname(__FILE__).'/routes.php')
        ),
        'request' => array(
            'class' => 'CHttpRequest'
        ),
        'messages' => array(
            'class' => 'Localization'
        ),
        'options' => array(
            'class' => 'Option'
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'enabled' => true,
                    'class' => 'ApacheErrorLogRoute',
                    'levels' => 'info'
                ),
                array(
                    'enabled' => true,
                    'class' => 'ApacheErrorLogRoute',
                    'levels' => 'error'
                ),
                array(
                    'enabled' => true,
                    'class' => 'ApacheErrorLogRoute',
                    'levels' => 'warning'
                ),
                array(
                    'enabled' => YII_DEBUG,
                    'class' => 'RuntimeLog',
                    'levels' => 'error',
                    'logFile' => 'error.log'
                ),
                array(
                    'enabled' => YII_DEBUG,
                    'class' => 'RuntimeLog',
                    'levels' => 'warning',
                    'logFile' => 'warning.log'
                ),
                array(
                    'enabled' => YII_DEBUG,
                    'class' => 'RuntimeLog',
                    'levels' => 'debug',
                    'logFile' => 'debug.log'
                )
            )
        )
    ),
    'params' => array(
        'logJAPIConnection' => true,
        'logFormat' => 'raw',
        'logErrors' => true,
        'requestHost' => '127.0.0.1',
        'requestPort' => 1502,
        'corePath' => '/usr/local/billing/'
    )
);
