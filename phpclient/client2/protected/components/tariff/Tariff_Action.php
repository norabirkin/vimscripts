<?php

class Tariff_Action extends LBWizardAction {
    public function tariffType($vgroup) {
        $tariffType = $this->__tariffType();
        if (!($tariffType instanceof Tariff_Type)) {
            throw new Exception('invalid tariff type checker');
        }
        return $tariffType->check($vgroup->vgroup->tariftype, $vgroup);
    }
    public function getRent($vgroup) {
        return $this->__tariffType()->getRent($vgroup);
    }
    protected function __tariffType() {
        throw new Exception('define "__tariffType" method');
    }
}

?>
