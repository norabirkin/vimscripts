<?php

class Tariff_Changing_Vgroups extends Vgroups_Grid {
    protected function show($row) {
        return (bool) $row->tarstaff;
    }
    public function output() {
        return parent::output() . $this->grid(array(
            'title' => 'Scheduled changes of tariff plan',
            'columns' => array(
                'vglogin' => 'Account',
                'taroldname' => 'Current tariff plan',
                'tarnewname' => 'Next period tariff plan',
                'changetime' => 'Change time',
                //'requestby' => 'Planned by',
                'recordid' => 'Actions'
            ),
            'data' => $this->helper()->schedule()->data(),
            'processor' => array($this->helper()->schedule(), 'row')
        ))->render();
    }
}

?>
