<?php

class Block_History_Details extends Statistics_Page {
    public function table() {
        return $this->grid(array(
            'columns' => array(
                'timefrom' => 'Date of lock start',
                'timeto' => 'Date of lock end',
                'block_type' => 'Type of lock'
            ),
            'processor' => array(
                $this,
                'row'
            )
        ));
    }
    protected function titleTpl() {
        return 'History for {login} {link}';
    }
    public function data() {
        return $this->p('getClientStat', array(
            'flt' => array(
                'repnum' => 12,
                'vgid' => $this->param('vgid'),
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto()
            ),
            'ord' => array(
                'name' => 'timefrom',
                'ascdesc' => 1
            )
        ), array(
            'stat' => true
        ));
    }
    public function row($row) {
        return array(
            'timefrom' => $this->date($row['timefrom']),
            'timeto' => $this->date($row['timeto']),
            'block_type' => $this->t(Block_Helper::stateDescription($row['block_type']))
        );
    }
}

?>
