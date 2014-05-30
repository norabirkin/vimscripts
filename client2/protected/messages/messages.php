<?php
/**
 * This is the configuration for generating message translations
 * for the Yii framework. It is used by the 'yiic message' command.
 * ./yiic message ../protected/messages/messages.php
 */
return array(
    'sourcePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..',
    'messagePath' => dirname(__FILE__),
    'translator' => 'Yii::t',
    'languages' => array('ru'),
    'fileTypes' => array('php'),
    'exclude' => array(
        '.svn',
        '.git',
        'yiilite.php',
        'yiit.php',
        'dbConfFile.php',
        'DefaultController.php',
        '/i18n/data',
        '/messages',
        '/framework',
        '/assets',
        '/protected/config',
    ),
);