<?php

class Tariff_Changing_Final extends LBWizardFinalStep {
    public function execute() {
        return $this->s('insClientTarifsRasp', array(
            'recordid'   => 0,
            'vgid'       => $this->param('vgid'),
            'groupid'    => 0,
            'id'         => $this->vgroup()->vgroup->agentid,
            'taridnew'   => $this->param('tarid'),
            'taridold'   => $this->vgroup()->vgroup->tarifid,
            'changetime' => $this->getChangeTime(),
            'requestby'  => ''
        ), true);
    }
    private function getChangeTime() {
        if ($this->changeDate == date('Y-m-d'))
            $this->changeDate = date('Y-m-d H:i:s');
        return $this->param('changetime') . ' ' . ($this->param('changetime') == date('Y-m-d') ? date('H:i:s') : '00:00:00');
    }
    protected function getSuccessMessage() {
        return 'Tariff successfully changed';
    }
    protected function getErrorMessage() {
        return 'Tariff change failed';
    }
}

?>
