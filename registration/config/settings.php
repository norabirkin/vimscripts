<?php

return array(
    'basePath' => dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'defaultController' => 'site',
    'import' => array(
        'application.components.errors.*'
    ),
    'components' => array(
        'assetManager' => array(
            'basePath' => realpath(
                dirname(__FILE__).
                DIRECTORY_SEPARATOR.
                '..'.
                DIRECTORY_SEPARATOR.
                'public'.
                DIRECTORY_SEPARATOR.
                'assets'
            )
        ),
        'db' => array(
            'class'=>'DbConnection',
            'connectionString' => (
                'sqlite:'.
                dirname(__FILE__).
                DIRECTORY_SEPARATOR.
                '..'.
                DIRECTORY_SEPARATOR.
                'db'.
                DIRECTORY_SEPARATOR.
                'users.db'
            )
        )
    ),
    'params' => array(
        'required' => array(
            'name' => true,
            'surname' => true,
            'patronymic' => true,
            'pass_sernum' => false,
            'pass_no' => false,
            'email' => true,
            'phone' => true,
            'pass_issuedate' => false,
            'pass_issuedep' => false,
            'pass_issueplace' => false
        ),
        'set_id' => 0,
        'logJAPIConnection' => true,
        'logFormat' => 'raw',
        'logErrors' => true,
        'requestHost' => '127.0.0.1',
        'requestPort' => 1502,
        'login' => 'admin',
        'password' => '',
        'email' =>  array(
            'smtphost' => '',
            'smtpport' => '',
            'smtpuser' => '',
            'smtppass' => '',
            'smtptls' => '',
            'smtpmethod' => '',
            'email_from' => ''
        )
    )
);

?>
