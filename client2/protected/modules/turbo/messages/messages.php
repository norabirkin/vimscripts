<?php
/**
 * This is the configuration for generating message translations
 * for the Yii framework. It is used by the 'yiic message' command.
 * ./yiic message ../protected/modules/turbo/messages/messages.php
 */
return array(
    'sourcePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'messagePath' => dirname(__FILE__),
    'translator' => 'Yii::t',
    'languages' => array('ru','en'),
    'fileTypes' => array('php'),
    'exclude' => array(
        '.svn',
        '.git',
    ),
);