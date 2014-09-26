<?php

return array(
    // preloading 'log' component
    'preload'=>array('log'),
    // autoloading model and component classes
    'import'=>array(
        'application.components.*',
        'phpclient.components.*',
        'phpclient.components.JAPIClient.*',
        'phpclient.components.JAPIClient.JAPILog.*'
    ),
    'onEndRequest' => array('AuthSession', 'endRequest'),
    'components'=>array(
        'japi' => array(
            'class' => 'JAPIClient'
        ),
        'statePersister' => array(
            'class' => 'RuntimePath'
        ),
        'session' => array(
            'class' => 'AuthSession',
            'autoStart' => false
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'enabled' => YII_DEBUG,
                    'class' => 'RequestLogRoute',
                    'levels' => 'details',
                    'logFile' => 'details.log'
                ),
                array(
                    'enabled' => YII_DEBUG,
                    'class' => 'RuntimeLog',
                    'levels' => 'info',
                    'logFile' => 'info.log'
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
                    'levels' => 'vardump',
                    'logFile' => 'vardump.log'
                )
            )
        )
    )
);

?>
