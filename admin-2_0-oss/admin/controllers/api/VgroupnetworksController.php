<?php

class VgroupnetworksController extends Controller {
    
    public function masking($type = 0) {
    
        $mask = array(
            '0' =>'0.0.0.0', '1' => '128.0.0.0', '2' => '192.0.0.0', '3' => '224.0.0.0', '4' => '240.0.0.0',
            '5' => '248.0.0.0', '6' => '252.0.0.0', '7' => '254.0.0.0', '8' => '255.0.0.0', '9' =>'255.128.0.0',
            '10' => '255.192.0.0', '11' => '255.224.0.0', '12' => '255.240.0.0', '13' => '255.248.0.0',
            '14' => '255.250.0.0', '15' => '255.254.0.0', '16' => '255.255.0.0', '17' => '255.255.128.0',
            '18' => '255.255.192.0', '19' => '255.255.224.0',  '20' => '255.255.240.0', '21' => '255.255.248.0',
            '22' => '255.255.252.0', '23' => '255.255.254.0',  '24' => '255.255.255.0', '25' => '255.255.255.128',
            '26' => '255.255.255.192', '27' => '255.255.255.224', '28' => '255.255.255.240' , '29' => '255.255.255.248',
            '30' => '255.255.255.252', '31' => '255.255.255.254', '32' => '255.255.255.255'
        );    
        $demask = array(
            '0.0.0.0' => '0', '128.0.0.0' => '1', '192.0.0.0' => '2', '224.0.0.0' => '3', '240.0.0.0' => '4',
            '248.0.0.0' => '5', '252.0.0.0' => '6', '254.0.0.0' => '7', '255.0.0.0' => '8', '255.128.0.0' => '9',
            '255.192.0.0' => '10', '255.224.0.0' => '11', '255.240.0.0' => '12', '255.248.0.0' => '13',
            '255.250.0.0' => '14', '255.254.0.0' => '15', '255.255.0.0' => '16', '255.255.128.0' => '17',
            '255.255.192.0' => '18', '255.255.224.0' => '19', '255.255.240.0' => '20', '255.255.248.0' => '21',
            '255.255.252.0' => '22', '255.255.254.0' => '23', '255.255.255.0' => '24', '255.255.255.128' => '25',
            '255.255.255.192' => '26', '255.255.255.224' => '27', '255.255.255.240' => '28', '255.255.255.248' => '29',
            '255.255.255.252' => '30', '255.255.255.254' => '31', '255.255.255.255' => '32'
        );    
        
        if($type > 0) {
            return $demask;
        } else {
            return $mask;
        }
    }
    
    public function actionList() {
        $data = array();
        $masking = $this->masking(1);
        
        $params = array(
            'vg_id' => (int) $this->param('vg_id'),
            'all_data' => (bool) $this->params('local')
        );
        
        $list = new OSSList( array("useSort" => false) );
        $result = $list->getList( "getVgNetworks", $params );
        
        $res = $result["result"]->getResult();
        $total = $result["total"]->getResult();      
        
        foreach ($res as $network) {
            $network['masknum'] = $masking[$network['netmask']];
            if ($network['type'] == 2) {
                if ((int) $this->param('local')) {
                    $data[] = $network;
                }
            } else {
                if (!((int) $this->param('local'))) {
                    $data[] = $network;
                }
            }            
        }
        $this->success($data, $total);
    }
    
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setVgNetwork', array(
            'as_num' => (int) $this->param('as_num'),
            'netmask' => $this->param('netmask'),
            'network' => $this->param('network'),
            'record_id' => (int) $this->param('record_id'),
            'segment_id' => (int) $this->param('segment_id'),
            'type' => (int) $this->param('type'),
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delVgNetwork', array(
            'record_id' => (int) $this->param('record_id')
        )));
    }
}

?>
