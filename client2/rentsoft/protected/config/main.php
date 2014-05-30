<?php
/**
 * Main application config
 */
return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'defaultController'=>'site',
    'preload'=>array('log'),
    'import'=>array(
        'application.components.*'
    ),
    'components'=>array(
    	'rentsoft' => array(
    		'class' => 'RentSoftAdminAPI'
    	),
    	'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'class'      => 'CFileLogRoute',
                    'logFile'    => 'rentsoft_api.log',
                    'categories' => 'rentsoft.*',
                ),
                array(
                	'class'      => 'CFileLogRoute',
                    'logFile'    => 'rsag_processor.log',
                    'categories' => 'rsag_processor.*',
				)
            ),
        ),
    )
);
