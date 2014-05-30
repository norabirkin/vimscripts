<?php

class Block_Services extends Block_Confirm {
    public function output() {
        $services = new DTV_Services_Grid(array(
            'wizard' => $this->wizard(),
            'top' => 20,
            'title' => array(
                'title' => 'Following services will be stopped'
            )
        ));
        return $this->display()->render() .
        $services->custom($this->helper()->assignedServices_ThatCanBeKeptTurnedOn()) .
        yii::app()->controller->renderPartial('application.components.block.views.services', array(
            'yes' => $this->lnext('Yes', array(), array('class' => 'input-submit block-link')),
            'no' => $this->link('No', 1, array(), array(), array('class' => 'input-submit block-link'))
        ), true);
    }
    public function title() {
        return 'Stopping DTV services';
    }
}

?>
