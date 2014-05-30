<?php

class Payment_History_Detail extends Statistics_Page {
    protected function __data() {
        return $this->p('getClientPayments', array(
            'flt' => array(
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'agrmid' => $this->param('agrmid')
            )
        ))->showLimitSelect();
    }
    public function agrmnum($agrmid = null) {
        try {
            return $this->agreement($agrmid)->number;
        } catch (Exception $e) {
            return '---';
        }
    }
    protected function defaultDtfrom() {
        return date('Y-m-01', strtotime('-3 month'));
    }
    public function row($row) {
        return array(
            'localdate' => $this->date($row->pay->localdate),
            'receipt' => $row->pay->receipt ? $row->pay->receipt : $row->pay->recordid,
            'agrmnum' => $this->agrmnum($row->pay->agrmid),
            'status' => $this->status($row->pay->status),
            'mgr' => $row->mgr,
            'amountcurr' => $this->price($row->amountcurr)
        );
    }
    public function output() {
        return $this->agrmPeriod() . $this->__table();
    }
    protected function table() {
        return $this->grid(array(
            'columns' => array(
                'localdate' => 'Date',
                'receipt' => 'Payment number',
                'agrmnum' => 'Agreement',
                'status' => 'State',
                'mgr' => 'Manager',
                'amountcurr' => 'Sum'
            ),
            'processor' => array($this, 'row')
        ));
    }
    private function status($id) {
        $descriptions = array(
            'Accepted',
            'Accepted',
            'Canceled',
            'Corrected'
        );
        return $this->t($descriptions[$id]);
    }
    protected function titleTpl() {
        return $this->param('agrmid') ? 'Detailed statistics for {login} {link}' : 'Detailed statistics for all agremeents {link}';
    }
    protected function itemLogin() {
        return $this->agreement()->number;
    }
}

?>
