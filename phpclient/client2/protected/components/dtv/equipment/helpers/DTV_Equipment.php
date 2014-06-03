<?php

class DTV_Equipment extends LBWizardItem {
    private $eq;
    private $mobil;
    public function setWizard(LBWizard $wizard) {
        parent::setWizard($wizard);
        $this->eq = new DTV_Equipment_Helper($wizard);
        $this->mobil = new DTV_Equipment_Mobility($wizard);
    }
    public function init() {
        $this->eq()->init();
    }
    public function eq() {
        return $this->eq;
    }
    public function mobil() {
        return $this->mobil;
    }
    public function checkCardid() {
        if ($this->param('action') != 'join') {
            return;
        }
        if (!$this->mobil()->allowJoin($this->param('cardid'))) {
            throw new Exception('Cannot join equipment');
        }
    }
}

?>
