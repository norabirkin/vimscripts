<?php
class SegmentsController extends Controller{
    
    public function actionList() {
        $params = array( 'agent_id' => (int) $this->param('agent_id', 0) );
        if ($this->param('ip')) {
            $params[ "ip" ] = $this->param('ip');
        }
        if ($this->param('vlan')) {
            $params[ "vlan" ] = (int) $this->param('vlan');
        }

        $list = new OSSList( array("useSort" => false) );
        $result = $list->getList( "getSegments", $params );
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();
        
        $masking = array(
            '0.0.0.0' => '0', '128.0.0.0' => '1', '192.0.0.0' => '2', '224.0.0.0' => '3', '240.0.0.0' => '4',
            '248.0.0.0' => '5', '252.0.0.0' => '6', '254.0.0.0' => '7', '255.0.0.0' => '8', '255.128.0.0' => '9',
            '255.192.0.0' => '10', '255.224.0.0' => '11', '255.240.0.0' => '12', '255.248.0.0' => '13',
            '255.250.0.0' => '14', '255.254.0.0' => '15', '255.255.0.0' => '16', '255.255.128.0' => '17',
            '255.255.192.0' => '18', '255.255.224.0' => '19', '255.255.240.0' => '20', '255.255.248.0' => '21',
            '255.255.252.0' => '22', '255.255.254.0' => '23', '255.255.255.0' => '24', '255.255.255.128' => '25',
            '255.255.255.192' => '26', '255.255.255.224' => '27', '255.255.255.240' => '28', '255.255.255.248' => '29',
            '255.255.255.252' => '30', '255.255.255.254' => '31', '255.255.255.255' => '32'
        );
        
        foreach($data as $k=>$item) {
            foreach($masking as $mk=>$mask) {
                $data[$k]['masknum'] = $masking[$item['mask']];
            }
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
        $this->success( yii::app()->japi->callAndSend('delSegment', array(
            'segment_id' => (int) $this->getRequest()->getParam('id', 0)
        )));
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

    public function actionCreate() {
        $this->success( yii::app()->japi->callAndSend('setSegment', array( 
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

}
