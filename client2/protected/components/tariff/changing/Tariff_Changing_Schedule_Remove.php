<?php

class Tariff_Changing_Schedule_Remove extends LBWizardFinalStep {
    public function execute() {
        return $this->d('delClientTarifsRasp', array(
            'id' => $this->param('recordid')
        ));
    }
    protected function getSuccessMessage() {
        return 'Tariff is successfully removed from schedule';
    }
    protected function getErrorMessage() {
        return 'Сannot remove tariff from schedule';
    }
}

?>
