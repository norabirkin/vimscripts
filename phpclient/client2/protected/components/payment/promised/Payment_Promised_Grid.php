<?php

class Payment_Promised_Grid extends LBWizardStep {
    private $payments;
    public function __construct($payments) {
        $this->payments = $payments;
    }
    private function status($id) {
        if ( $id == -1 ) return yii::t('main','Exceed');
        elseif ( $id == 0 ) return yii::t('main','Active');
        elseif ( $id > 0 ) return yii::t('main','Paid');
    }
    public function row($row) {
        return array(
            'promdate' => $this->time($row->promdate),
            'promtill' => $this->time($row->promtill),
            'amount' => $this->price($row->amount),
            'payid' => $this->status($row->payid)
        );
    }
    public function output() {
        return $this->grid(array(
            'title' => 'Promised payments',
            'columns' => array(
                'promdate' => 'Requested',
                'promtill' => 'Payment date',
                'amount' => 'Sum',
                'payid' => 'Paid'
            ),
            'processor' => array($this, 'row'),
            'data' => $this->payments
        ))->render();
    }
    public function title() {
        return yii::t('main', 'Promised payment table');
    }
}

?>
