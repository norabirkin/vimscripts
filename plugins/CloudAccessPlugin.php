<?php

class CloudAccessPlugin implements LB_Plugin {
    public function init() {
        yii::app()->start->attachEventHandler('onMenuConfigurated', array($this, 'addMenuItem'));
        yii::import('webroot.plugins.CloudAccess.CloudAccessModule');
        yii::app()->setModules(array(
            'CloudAccess' => array(
                'class' => 'webroot.plugins.CloudAccess.CloudAccessModule'
            )
        ));
    }
    public function addMenuItem() {
        yii::app()->controller->pages->getPage('profile/index')->items()->addPage(array(
            'controller' => 'CloudAccess/default',
            'action' => 'index',
            'title' => 'Access to cloud',
            'localize' => 'CloudAccessModule.main'
        ));
    }
}

?>
