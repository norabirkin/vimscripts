<?php

class CloudAccessPlugin extends LB_Plugin {
    public function init() {
        $this->add('profile/index', array(
            'module' => 'webroot.plugins.CloudAccess.CloudAccessModule',
            'controller' => 'default',
            'action' => 'index',
            'title' => 'Access to cloud'
        ));
    }
}

?>
