<?php

class DTV_Channels_Packages extends LBWizardStep {
    private $tabs;
    protected function tabs() {
        if (!$this->tabs) {
            $this->tabs = new LB_Tabs(array(
                'param' => 'vgid',
                'wizard' => $this->wizard()
            ));
            foreach ($this->helper()->vgroups() as $vgroup) {
                $this->tabs->add(array(
                    'title' => $vgroup->vgroup->login,
                    'id' => $vgroup->vgroup->vgid
                ));
            }
            $this->wizard()->setParam('vgid', $this->tabs->currId());
        }
        return $this->tabs;
    }
    public function output() {
        $tabs = $this->tabs();
        $services= new DTV_Services_Grid(array(
            'dtvtype' => 1,
            'wizard' => $this->wizard(),
            'title' => array(
                'active' => 'Active channels',
                'idle' => 'Available channels',
                'catdescr' => 'Channel name'
            )
        ));
        $smartcard = $this->helper()->smartcard($this->param('vgid'));
        
        return $tabs->render() .
        yii::app()->controller->renderPartial('application.components.dtv.channels.views.packages', array(
            'link' => $this->lnext('Personal TV', array(
                'personal' => 1
            )),
            'smartcard' => $smartcard ? $smartcard->smartcard->name : null
        ), true) .
        $services->active() .
        $services->idle();
    }
    public function title() {
        return 'TV Packages';
    }
}

?>
