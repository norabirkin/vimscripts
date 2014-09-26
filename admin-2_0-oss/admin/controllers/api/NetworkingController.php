<?php
class NetworkingController extends Controller{
    
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
    
    public function actionFreeSegments() {
        if((int)$this->param('agent_id') == 0) {
            $this->success('');
        }
        
        $masking = $this->masking(0);
        
        $demask = $this->masking(1);
        
        $params = array( 
            'agent_id' => (int)$this->param('agent_id'),
            'vg_id' => (int)$this->param('vg_id'),
            'segment' => array(
                'ip' => $this->param('segment_ip'),
                'mask' => $this->param('segment_mask')
            ),
            'include_broadcast' => (bool)$this->param('broadcast'),
            'include_netaddr' => (bool)$this->param('broadcast'),
            'mask' => $masking[ (int)$this->param('mask') ]
        );

        $list = new OSSList( array("useSort" => false) );
        $result = $list->getList( "getFreeNetworks", $params );
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();

        foreach($data as $k=>$item) {
            $data[$k]['mask'] = $demask[$item['mask']];
        }

        $this->success($data, $total);
    }
    
    public function actionGet() {
        $this->success( yii::app()->japi->callAndSend('getSegments', array(
            "segment_id" => (int) $this->getRequest()->getParam('id', 0),
            "agent_id" => (int) $this->getRequest()->getParam('agent_id', 0)
        )));
    }
    
    public function actionDelete() {
        $records = str_replace("\\", "", $this->param("records"));
        $records =  CJSON::decode($records);
        foreach($records as $record) {
            yii::app()->japi->callAndSend('delVgNetwork', array(
                'record_id' => (int)$record
            ));
        }
        $this->success();
    }

    public function actionDeleteMacs() {
        $records = str_replace("\\", "", $this->param("records"));
        $records =  CJSON::decode($records);
        foreach($records as $record) {
            yii::app()->japi->callAndSend('delVgMacAddr', array(
                'record_id' => (int)$record
            ));
        }
        $this->success();
    }
    
    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend('setSegment', array( 
            'record_id' => (int) $this->param("id"),
            'agent_id' => (int) $this->param("agent_id"),
            'device_group_id' => (int) $this->param("device_group_id"),
            'gateway' => $this->param("gateway"),
            "guest" => (int) $this->param("guest"),
            "ignore_local" => (int) $this->param("ignore_local"),
            "ip" => $this->param("ip"),
            "mask" => $this->param("mask"),
            "nas_id" => $this->param("nas_id"),
            "nat" => (int) $this->param("nat"),
            "vlan_id" => $this->param("vlan_id")
        )));
    }

    public function actionSetStaff() {
        $records = str_replace("\\", "", $this->param("records"));
        $records =  CJSON::decode($records);
        
        $masking = $this->masking(0);
        
        foreach($records as $record) {
            $params = array( 
                'as_num' => 0,
                'netmask' => $masking[$record['mask']],
                'network' => $record['ip'],
                'record_id' => 0,
                'segment_id' => $record['segment_id'],
                'type' => (int)$this->param("type"), // 0 - для ip адресов, 1 для портов (не в форме УЗ), 2 - для номеров
                'vg_id' => (int)$this->param("vg_id")
            );
            yii::app()->japi->callAndSend('setVgNetwork', $params);
        }
        $this->success();
    }
    
    
    public function actionSetMacStaff() {
        $params = array(
            'mac' => $this->param("mac"),
            'vg_id' => (int)$this->param("vg_id")
        );
        if($this->param("network") != '') {
            $params['network'] = $this->param("network");
        }
        $this->success(yii::app()->japi->callAndSend('setVgMacAddr', $params));
    }
    
    public function actionSetNumbers() {
        $params = array(
            'as_num' => (int)$this->param("as_num"),
            'type' => 2, // 0 - для ip адресов, 1 для портов (не в форме УЗ), 2 - для номеров
            'vg_id' => (int)$this->param("vg_id")
        );
        $this->success(yii::app()->japi->callAndSend('setVgNetwork', $params));
    }
    
    public function actionGetNumbers() {
        $params = array(
            'all_data' => (bool)true,
            'agent_id' => (int)$this->param("agent_id"),
            'vg_id' => (int)$this->param("vg_id")
        );

        $list = new OSSList( array("useSort" => false) );
        $result = $list->getList( "getVgNetworks", $params );
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();
        
        foreach($data as $k=>$item) {
            if($item['type'] != 2) {
                unset($data[$k]);
            }
        }

        $this->success($data, $total);
    }

}
