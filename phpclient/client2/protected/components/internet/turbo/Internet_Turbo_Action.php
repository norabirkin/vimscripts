<?php

class Internet_Turbo_Action extends Tariff_Action {
    public function __getWizard() {
        $helper = new Internet_Turbo_Helper;
        return new LBWizard(array(
            'steps' => array(
                new Internet_Turbo_License,
                new Internet_Turbo_Vgroups,
                new Internet_Turbo_Services,
                new Internet_Turbo_Duration,
                new Internet_Turbo_Confirm
            ),
            'style' => 'steps',
            'helper' => $helper,
            'final' => new Internet_Turbo_Assign,
            'validate' => array(
                'mul' => array($helper, 'checkBalance')
            )
        ));
    }
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
}

?>
