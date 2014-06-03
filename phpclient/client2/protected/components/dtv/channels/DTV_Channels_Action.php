<?php

class DTV_Channels_Action extends LBWizardAction {
    public function __getWizard() {
        $helper = new DTV_Channels_Helper;
        $wizard = new LBWizard(array(
            'steps' => array(
                new DTV_Channels_Packages
            ),
            'helper' => $helper
        ));
        if ($wizard->param('personal')) {
            $wizard->add(new DTV_Channels_Personal);
            $wizard->add(new DTV_Channels_Personal_Confirm);
            $wizard->fin(new DTV_Channels_Personal_Final);
        } else {
            if ($wizard->param('catidx') !== null) {
                $wizard->add(new DTV_Confirm_Assign(array(
                    'title' => 'Confirm assign service',
                    'catdescr' => 'Channel name' 
                )));
                if ($wizard->param('done')) {
                    $wizard->add(new DTV_Channels_Thanks);
                } else {
                    $wizard->fin(new DTV_Channels_Assign);
                }
            } elseif ($wizard->param('servid')) {
                $wizard->add(new DTV_Confirm_Stop(array(
                    'title' => 'Confirm stop service',
                    'catdescr' => 'Channel name' 
                )));
                $wizard->fin(new DTV_Channels_Stop);
            }
        }
        return $wizard;
    }
}

?>
