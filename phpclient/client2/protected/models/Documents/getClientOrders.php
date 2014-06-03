<?php class getClientOrders extends LBModel {
    public $agrmid;
    public $docid;
    public $dtto;
    public $dtfrom;
    public $payed;
    public function rules() {
        return array();
    }
    protected function beforeCall($params) {
        $params['flt']['payed'] = $this->payed;
        if ($this->payed == 0) $params['flt']['payable'] = 1;
        return $params;
    }
    protected function documentsList($data) {
        $docs = new Documents;
        $result = array();
        foreach ($data as $item) {
            $t = strtotime($item->orderdate);
            $tfrom = strtotime($this->dtfrom);
            $tto = strtotime($this->dtto);
            $info = pathinfo($item->filename);
            $file2download =  basename($item->filename,'.'.$info['extension']);
            $path = $docs->getFile($item);
            if ( ($t >= $tfrom && $t <= $tto) OR yii::app()->request->getParam('unpayed')) $result[] = array(
                'orderdate' => yii::app()->controller->formatDate(strtotime($item->orderdate)),
                'ordernum' => $item->ordernum,
                'docname' => $item->docname,
                'currsumm' => Yii::app()->NumberFormatter->formatCurrency($item->currsumm, Yii::app()->params["currency"]),
                'state' => $item->paydate == '0000-00-00' ? yii::t('documents','NotPayed') : yii::t('documents','Payed'),
                'dowlnoad' => $path ? CHtml::link(yii::t('documents','Download'),array(
                    'documents/download',
                    'file' => $file2download
                )) : ''
            );
        }
        return $result;
    }
    protected function getParams($type = 'default') {
        $flt = array(
            'agrmid' => $this->agrmid,
            'payed' => -1
        );
        if ($this->docid) $flt['docid'] = $this->docid;
        $types =  array('default' => array('flt' => $flt)); 
        return $types[$type];
    }
} ?>
