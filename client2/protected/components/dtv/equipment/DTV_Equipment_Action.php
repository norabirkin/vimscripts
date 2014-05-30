<?php

class DTV_Equipment_Action extends LBWizardAction {
    public function __getWizard() {
        $helper = new DTV_Equipment;
        $wizard = new LBWizard(array(
            'steps' => array(
                new DTV_Equipment_List 
            ),
            'helper' => $helper,
            'validate' => array(
                'cardid' => array($helper, 'checkCardid')
            ),
            'final' => new DTV_Equipment_Final
        ));
        if ($wizard->param('action') == 'join') {
            $wizard->add(new DTV_Equipment_Join_List);
            $wizard->add(new DTV_Equipment_Join_Confirm);
        } else {
            $wizard->add(new DTV_Equipment_Detach_Confirm);
        }
        return $wizard;
    }
}

?>
