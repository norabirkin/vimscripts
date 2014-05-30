<?php class PaymentStatistics extends BaseStatistics {
    public $agrmid;
	public function getColumns() {
		return array(
            'localdate' => Yii::t('statistics','Date'),
            'receipt' => Yii::t('statistics', 'PaymentNumber'),
            'status' => Yii::t('statistics', 'State'),
            'mgr' => Yii::t('statistics', 'Manager'),
            'amountcurr' => Yii::t('statistics', 'Sum')
        );
	}
    
    public function getStatistics() {
        $_filter = array(
            "dtfrom" => $this->date['dtfrom'],
            "dtto" => $this->date['dtto'],
            "agrmid" => $this->agrmid
        );
        $payments = Arr::get_array(yii::app()->controller->lanbilling->get("getClientPayments", array("flt" => $_filter)));
        return $this->getList($payments);
    }
    
    public function getTotalRow( $data ) {
	return array(
		'localdate' => '',
                'agreement' => '',
                'receipt' => '',
                'amountcurr' => $this->getTotalPrice( $data ),
                'status' => '',
                'mgr' => '',
		'rawprice' => '' 
	);
    }

    public function getList($data) {
        $result = array();
        foreach ($data as $v) {
            $result[] = array(
                'localdate' => yii::app()->controller->formatDate(strtotime($v->pay->localdate)),
                'agreement' => empty(yii::app()->controller->lanbilling->agreements[$v->pay->agrmid]) ? '' : yii::app()->controller->lanbilling->agreements[$v->pay->agrmid]->number,
                'receipt' => empty($v->pay->receipt) ? $v->pay->recordid : $v->pay->receipt,
                'amountcurr' => Yii::app()->NumberFormatter->formatCurrency( round($v->amountcurr, 2), Yii::app()->params["currency"] ),
                'status' => Yii::t('statistics', 'PaymentStatus' . $v->pay->status),
                'mgr' => $v->mgr,
                'rawprice' => round($v->amountcurr, 2)
            );
        }
        return $result;
    }

} ?>
