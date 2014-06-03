<?php

class Tariff_Changing_Action extends Tariff_Action {
    public function __getWizard() {
        $helper = new Tariff_Changing_Helper;
        $wizard = new LBWizard(array(
            'steps' => array(
                $this->getTariffChangingVgroupsStep()
            ),
            'helper' => $helper,
            'style' => 'steps',
            'validate' => array(
                'tarid' => array($helper, 'validateTariff'),
                'vgid' => array($helper, 'validateVgid'),
                'changetime' => array($helper, 'validateDtfrom')
            )
        ));
        if ($wizard->param('recordid')) {
            $wizard->add(new Tariff_Changing_Schedule_Remove_Confirm);
            $wizard->fin(new Tariff_Changing_Schedule_Remove);
        } else {
            $wizard->add(new Tariff_Changing_Tariffs);
            $wizard->add(new Tariff_Changing_Date);
            $wizard->add(new Tariff_Changing_Confirm);
            $wizard->fin(new Tariff_Changing_Final);
        }
        return $wizard;
    }
    protected function getTariffChangingVgroupsStep() {
        return new Tariff_Changing_Vgroups;
    }
}

?>
