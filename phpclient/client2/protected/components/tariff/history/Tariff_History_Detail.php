<?php

class Tariff_History_Detail extends Statistics_Page {
    protected function __data() {
        return $this->p('getTarifsHistory', array(
            'flt' => array(
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'vgid' => $this->param('vgid')
            )
        ));
    }
    public function row($row) {
        return array(
            'changed' => $this->date($row->rasptime),
            'taroldname' => $row->taroldname,
            'tarnewname' => $row->tarnewname,
            'requestby' => $this->helper()->requestby($row->requestby)
        );
    }
    protected function table() {
        return $this->grid(array(
            'columns' => array(
                'changed' => 'Date',
                'taroldname' => 'Old tariff',
                'tarnewname' => 'New tariff',
                'requestby' => 'Planned by'
            ),
            'processor' => array($this, 'row')
        ));
    }
    protected function defaultDtfrom() {
        return date('Y-m-01', strtotime('-6 months'));
    }
    protected function titleTpl() {
        return $this->param('vgid') ? 'Tariffs history statistics for {login} {link}' : 'Tariffs statistics for all accounts {link}';
    }
    protected function itemLogin() {
        return $this->vgroup()->vgroup->login;
    }
}

?>
