<?php

class Controller_SectionWithConnectionSubSection extends Controller {
    public function vgroupType() {
        throw new Exception('define vgroupType method');
    }
    public function afterMenuConfigurated() {
        $vgroups = new Vgroups_Data;
        if ($vgroups->type($this->vgroupType())) {
            $this->pages->getPage($this->getId().'/connection')->setParam('hidden', true, false, 'is_bool');
        } else {
            $this->pages->getPage($this->getId().'/index')->items()->eachPages('hide', $this);
        }
    }
    public function shouldHide($page) {
        return true;
    }
    public function hide($page) {
        if (
            $page->route() != $this->getId().'/connection' AND
            $this->shouldHide($page)
        ) {
            $page->setParam('hidden', true, false, 'is_bool');
        }
    }
    public function actionConnection() {
        $params = yii::app()->params['connection'][$this->vgroupType()];

        if ($params['url'] AND $params['text']) {
            $this->output(
                CHtml::link(
                    $params['text'],
                    $params['url']
                )
            );
        } elseif ($params['iframe']) {
            $this->output($this->renderPartial('application.components.controller.views.iframe', array(
                'url' => $params['iframe']
            ), true));
        } else {
            throw new Exception('Invalid settings');
        }
    }
}

?>
