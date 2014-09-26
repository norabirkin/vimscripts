<?php

class VgrouptelephonyController extends Controller {
    
    public function actionList() {
        $params = array(
            'vg_id' => (int) $this->param('vg_id')
        );
        $list = new OSSList( array("sortProperties" => array(
            "number" => "number",
            "type" => "type",
            "time_from" => "time_from",
            "time_to" => "time_to"
        )) );        
        $result = $list->getList( "getVgTelephony", $params );
        
        $this->success($result["result"]->getResult(), $result["total"]->getResult());
    }
    
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setVgTelephony', array(
            'record_id' => 0,
            'type' => (int) $this->param('type'),
            'vg_id' => (int) $this->param('vg_id'),
            'device' => (int) $this->param('device'),
            'number' => (string) $this->param('number'),
            'time_from' => (string) $this->calcDate(true),
            'time_to' => (string) $this->calcDate(false),
            'comment' => (string) $this->param('comment'),
            'check_duplicate' => (bool) $this->param('check_duplicate')
        )));
    }
    
    
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setVgTelephony', array(
            'type' => (int) $this->param('type'),
            'record_id' => (int) $this->param('id'),
            'vg_id' => (int) $this->param('vg_id'),
            'device' => (int) $this->param('device'),
            'number' => (string) $this->param('number'),
            'time_from' => (string) $this->calcDate(true),
            'time_to' => (string) $this->calcDate(false),
            'comment' => (string) $this->param('comment'),
            'check_duplicate' => (bool) $this->param('check_duplicate')
        )));
    }
    
    public function actionDelete() {
        $records = explode(',', $this->param('records'));
        foreach($records as $record) {
            yii::app()->japi->callAndSend('delVgTelephony', array(
                'type' => (int) $this->param('type'),
                'record_id' => (int)$record
            ));
        }
        $this->success();
    }

    public function calcDate($from) {
        if($this->param('date_from') != '') {
            $hf = ((int)$this->param('h_from') < 10) ? '0'.(int)$this->param('h_from') : (int)$this->param('h_from');
            $mf = ((int)$this->param('m_from') < 10) ? '0'.(int)$this->param('m_from') : (int)$this->param('m_from');
            $sf = ((int)$this->param('s_from') < 10) ? '0'.(int)$this->param('s_from') : (int)$this->param('s_from');
            $timeFrom = $this->param('date_from') . ' ' . $hf . ':' . $mf . ':'. $sf; 
        }
        
        if($this->param('date_till') != '') {
            $ht = ((int)$this->param('h_till') < 10) ? '0'.(int)$this->param('h_till') : (int)$this->param('h_till');
            $mt = ((int)$this->param('m_till') < 10) ? '0'.(int)$this->param('m_till') : (int)$this->param('m_till');
            $st = ((int)$this->param('s_till') < 10) ? '0'.(int)$this->param('s_till') : (int)$this->param('s_till');
            $timeTill = $this->param('date_till') . ' ' . $ht . ':' . $mt . ':'. $st; 
        }
        
        return $from ? $timeFrom : $timeTill;
    }
    
}

?>
