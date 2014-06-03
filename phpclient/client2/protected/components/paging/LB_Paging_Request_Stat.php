<?php

class LB_Paging_Request_Stat extends LB_Paging_Request {
    private $maxTotal;
    protected function getResult() {
        return $this->getCombinedResult($this->addPagingParams());
    }
    public function all() {
        return $this->getCombinedResult($this->params);
    }
    protected function getCombinedResult($params) {
        $result = yii::app()->lanbilling->get($this->fn, $params);
        if (
            !$result
            OR
            !is_object($result)
            OR
            !isset($result->data)
        ) {
            return array();
        }
        $data = yii::app()->lanbilling->dataCombine($result->names->val, $result->data);
        return $data;
    }
    public function maxTotal($value) {
        $this->maxTotal = $value;
        return $this;
    }
    protected function getTotal() {
        $params = $this->params;
        $params['flt']['nodata'] = 1;
        $total = yii::app()->lanbilling->get($this->fn, $params);
        $overrideTotal = $this->maxTotal;
        if (
            !$total
            OR
            !is_object($total)
            OR
            !isset($total->total)
        ) {
        	return $overrideTotal ? $overrideTotal : 0;
        }
        
        if ( $overrideTotal) {
        	if($total->total < $overrideTotal) {
        		return $overrideTotal;
        	}
        }
        return $total->total;
    }
}

?>
