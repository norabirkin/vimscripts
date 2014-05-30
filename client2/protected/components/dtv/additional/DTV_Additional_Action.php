<?php

class DTV_Additional_Action extends Tariff_Action {
    public function __getWizard() {
        $wizard = new LBWizard(array(
            'steps' => array(
                new DTV_Additional_Vgroups,
                new DTV_Additional
            ),
            'style' => 'steps',
            'count' => 3
        ));
        if ($wizard->param('catidx') !== null) {
            $wizard->add(new DTV_Confirm_Assign(array(
                'title' => 'Confirm assign additional service',
                'catdescr' => 'Service name' 
            )));
            $wizard->fin(new DTV_Additional_Assign);
        } elseif ($wizard->param('servid')) {
            $wizard->add(new DTV_Confirm_Stop(array(
                'title' => 'Confirm stop additional service',
                'catdescr' => 'Service name' 
            )));
            $wizard->fin(new DTV_Additional_Stop);
        }
        return $wizard;
    }
    protected function __tariffType() {
        return new Services_Tariff_Type;
    }
}

?>
