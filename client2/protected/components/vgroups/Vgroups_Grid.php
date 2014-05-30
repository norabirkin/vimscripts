<?php

class Vgroups_Grid extends Vgroups_Grid_Base {
    protected function show($row) {
        return true;
    }
    protected function columns() {
        return array(
            'login' => 'Account',
            'tarifdescr' => 'Current tariff plan',
            'servicerent' => 'Rent'
        );
    }
    public function row($row) {
        if (!$this->show($row) OR !$this->wizard()->action()->tariffType($row)) {
            return null;
        }
        return array(
            'login' => $this->lnext($row->vgroup->login, array(
                'vgid' => $row->vgroup->vgid
            )),
            'tarifdescr' => $row->vgroup->tarifdescr,
            'servicerent' => $this->price($this->wizard()->action()->getRent($row))
        );
    }
}

?>
