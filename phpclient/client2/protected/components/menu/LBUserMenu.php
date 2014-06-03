<?php

class LBUserMenu {
    private static $instance;
    private $maxDepth = 2;
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    public function output() {
        $params = $this->getTplParams();
        return $this->render('menu', $params);
    }
    public function addTplParams($page, &$data) {
        $items = ($page->isCurrentOrAncestorOfCurrent() AND ($data['depth'] < $this->maxDepth)) ? $this->getTplParams($page->items(), ($data['depth'] + 1)) : array();
        $data['items'][] = array_merge(
            array(
                'url' => $page->url(),
                'title' => $page->title(),
            ),
            $items
        );
    }
    private function getTplParams($pages = null, $depth = 1) {
        if (!$pages) {
            $pages = yii::app()->controller->pages;
        }
        $params = array('depth' => $depth, 'items' => array());
        $pages->eachPages('addTplParams', $this, $params);
        return array('items' => $params['items']);
    }
    public function render($tpl, $params = array()) {
        return yii::app()->controller->renderPartial('application.components.menu.views.'.$tpl, array_merge($params, array('component' => $this)), true);
    }
}

?>
