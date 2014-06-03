<?php

class Phone_Statistics_Detail extends Statistics_Page {
    protected function __data() {
        return $this->p('getClientStat', array(
            'flt' => array(
                'repnum' => 2,
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'vgid' => $this->param('vgid'),
                'additional' => 1
            ),
            'ord' => array(
                'name'    => 'timefrom',
                'ascdesc' => 1
            )
        ), array(
            'stat' => true
        ))->showLimitSelect();
    }
    public function row($row) {
        return array(
            'timefrom' => $this->time($row['timefrom']),
            'duration' => $this->secondsToString($row['duration']),
            'direction' => $this->t($row['direction'] ? 'Outcoming call' : 'Incoming call'), 
            'fromnumber' => $row['numfrom'],
            'tonumber' => $row['numto'],
            'cat_descr' => $row['cat_descr'],
            'c_date' => $this->date($row['c_date']),
            'amount' => $this->price($row['amount'])
        );
    }
    protected function table() {
        return $this->grid(array(
            'columns' => array(
                'timefrom' => 'Date',
                'duration' => 'Duration (hh:mm:ss)',
                'direction' => 'Direction',
                'fromnumber' => 'From number',
                'tonumber' => 'To number',
                'cat_descr' => 'Zone',
                'c_date' => 'Period',
                'amount' => 'Amount'
            ),
            'processor' => array($this, 'row')
        ));
    }
    protected function titleTpl() {
        return $this->param('vgid') ? 'Statistics for {login} {link}' : 'Statistics for all accounts {link}';
    }
    protected function itemLogin() {
        return $this->vgroup()->vgroup->login;
    }
}


?>
