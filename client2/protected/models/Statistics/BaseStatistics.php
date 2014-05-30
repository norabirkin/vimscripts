<?php class BaseStatistics extends Statistics{
	protected function amountIsNotEmpty( $amount ) {
		return ( !yii::app()->params['hideStaticticsEntriesWithNoAmount'] OR ( round((float) $amount, 2) != 0.00 ) );
	}
	protected function getTotalPrice( $data ) {
		$total = 0;
		foreach( $data as $item ) $total += round( $item['rawprice'], 2 );	
		return Yii::app()->NumberFormatter->formatCurrency($total, Yii::app()->params["currency"]);
	}
    public function getClientStat($repnum,$order,$callback,$repdetail = 0,$params = array()) {
    	if ( $repnum == 4 ) {
        	$dtfrom = date('Y-m-d',strtotime($this->date['dtfrom']));
        	$dtto = date('Y-m-d',strtotime($this->date['dtto']));
		} else {
			$dtfrom = date('Ymd000000',strtotime($this->date['dtfrom']));
        	$dtto = date('Ymd000000',strtotime($this->date['dtto']));
		}
        $_filter = array_merge(array(
            "repnum"    => $repnum,
            "repdetail" => 0,
            "dtfrom"    => $dtfrom,
            "dtto"      => $dtto,
            "vgid"      => $this->vgid
        ), $params);
		if (($this->filter)) $_filter = $this->group($_filter);
        $_order = array(
            "name"    => $order,
            "ascdesc" => 1
        );
        $countTotal = 0;
        $lb = Yii::app()->controller->lanbilling->cloneMain(array('query_timeout' => 380));
        if( false != ($count = $lb->get("getClientStat", array("flt" => array_merge($_filter, array("nodata" => 1)), "ord" => $_order), true)) )
        {
            $countTotal = $count->total;
            if (FALSE !== ($result = $lb->get("getClientStat", array("flt" => $_filter, "ord" => $_order)))){
                if (isset($result->data)){
                    if(!is_array($result->data)) {
                        $result->data = array($result->data);
                    }
                    $data = Yii::app()->controller->lanbilling->dataCombine($result->names->val, $result->data);
                } else $data = array();
            } else $data = array();
        } else $data = array();
        return $this->$callback($data);
    }
} ?>
