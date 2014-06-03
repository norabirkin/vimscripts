<?php

class LB_Tabs {
    private $id;
    private $param;
    private $params;
    private $route;
    private $wizard;
    private $tabs = array();
    public function __construct($params) {
        $this->param = (string) $params['param'];
        if (!$this->param) {
            throw new Exception('Tab param must be specified');
        }
        if ($params['wizard']) {
            $this->setWizard($params['wizard']);
        } else {
            $this->route = (string) $params['route'];
            $this->params = (array) $params['params'];
            if (!$this->params) {
                $this->params = array();
            }
            if ($this->route) {
                $this->route = yii::app()->controller->route;
            }
        }
    }
    public function setWizard(LBWizard $wizard) {
        $this->wizard = $wizard;
    }
    private function url($id) {
        if ($this->wizard) {
            return $this->wizard->curl(array($this->param => $id));
        } else {
            $params = $this->params;
            $params[$this->param] = $id;
            yii::app()->createUrl($this->route, $params);
        }
    }
    public function currId() {
        if ($this->id === null) {
            if ($this->wizard) {
                $id = $this->wizard->param($this->param);
            } else {
                $id = yii::app()->request->getParam($this->param);
            }
            if (!$id) {
                $id = reset(array_keys($this->tabs));
            }
            $this->id = $id;
        }
        return $this->id;
    }
    public function add($params) {
        $title = yii::t('main', $params['title']);
        if (!$title) {
            throw new Exception('No title');
        }
        if (!isset($params['id'])) {
            throw new Exception('No id');
        }
        $id = $params['id'];
        $this->tabs[$id] = $title;
    }
    public function render() {
        $tabs = '';
        foreach ($this->tabs as $id => $title) {
            $tabs .= $this->__render('tab', array(
                'url' => $this->url($id),
                'title' => $title,
                'active' => ($id == $this->currId())
            ));
        }
        return $this->__render('tabs', array('tabs' => $tabs));
    }
    private function __render($tpl, $params = array()) {
        return yii::app()->controller->renderPartial('application.components.tabs.views.'.$tpl, $params, true);
    }
}

?>
