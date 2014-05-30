<?php

class Internet_Tariff_Statistics_Detail extends Statistics_Page {
    protected function tabs() {
        if (!$this->tabs) {
            $this->tabs = new LB_Tabs(array(
                'param' => 'group',
                'wizard' => $this->wizard()
            ));
            foreach ($this->helper()->titles() as $k => $v) {
                $this->tabs->add(array(
                    'title' => $v,
                    'id' => $k
                ));
            }
            $this->wizard()->setParam('group', $this->tabs->currId());
        }
        return $this->tabs;
    }
    protected function __data() {
        return $this->p('getClientStat', array(
            'flt' => array_merge(array(
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'vgid' => $this->param('vgid')
            ), $this->helper()->filter()),
            'ord' => array(
                'name'    => 'dt',
                'ascdesc' => 1
            )
        ), array(
            'stat' => true
        ))->showLimitSelect();
    }
    public function row($row) {
        return array(
            'dt' => $this->param('group', Internet_Statistics_Helper::BY_DAYS) == Internet_Statistics_Helper::BY_HOURS ? $this->time($row['dt']) : $this->date($row['dt']),
            'volume_in' => $this->bytesToMb($row['volume_in']),
            'volume_out' => $this->bytesToMb($row['volume_out']),
            'volume' => $this->bytesToMb($row['volume']),
            'amount' => $this->price($row["amount"]),
            'zone_descr' => $row['zone_descr'],
            'src_ip' => $row['src_ip']
        );
    }
    protected function table() {
        return $this->grid(array(
            'columns' => $this->helper()->columns(),
            'processor' => array($this, 'row')
        ));
    }
    public function output() {
        return $this->tabs()->render() .
        '<br/>' .
        '<br/>' .
        parent::output();
    }
    protected function titleTpl() {
        return $this->param('vgid') ? 'Statistics for {login} {link}' : 'Statistics for all accounts {link}';
    }
    protected function itemLogin() {
        return $this->vgroup()->vgroup->login;
    }
}

?>
