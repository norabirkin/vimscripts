<?php

class Block_Action extends LBWizardAction {
    public function __getWizard() {
        $helper = new Block_Helper;
        $wizard = new LBWizard(array(
            'steps' => array(
                new Block_Vgroups
            ),
            'helper' => $helper,
            'validate' => array(
                'blkreq' => array($helper, 'checkBlkreq'),
                'date' => array($helper, 'checkDate'),
                'cancel' => array($helper, 'checkCancel')
            ),
            'style' => 'steps'
        ));
        if ($wizard->param('blkreq') !== null) {
            $wizard->add(new Block_Date);
            if ($wizard->param('blkreq') == Block_Helper::SWITCHED_OFF_BY_USER) {
                if ($helper->assignedServices_ThatCanBeKeptTurnedOn()->count()) {
                    $wizard->add(new Block_Services);
                    $wizard->add(new Block_Confirm_DTV);
                } else {
                    $wizard->add(new Block_Confirm);
                }
            } else {
                $wizard->add(new Block_Confirm);
            }
            $wizard->fin(new Block_Final);
        }
        if ($wizard->param('cancel')) {
            $wizard->add(new Block_Cancel_Confirm);
            $wizard->fin(new Block_Cancel_Final);
        }
        return $wizard;
    }
}

?>
