<?php
class RnasController extends Controller{
    
    public function actionList() {
        $params = array( 'agent_id' => (int) $this->param('agent_id', 0) );
        if ($ip = trim( $this->param('ip') )) {
            $params[ "ip" ] = $ip;
        }

        $list = new OSSList( array("sortProperties" => array(
            "id" => "r_nas_id",
            "rnas" => "r_rnas",
            "agent_id" => "r_id",
            "device_id" => "r_device_id",
            "secret" => "r_rsharedsec",
            "device_name" => "r_device_name"
        )));
        $list->get( "getRnas", $params );
    }

    public function actionCreate() {
        $this->success( yii::app()->japi->callAndSend('setRnas', array(
            'agent_id' => (int) $this->param( 'agent_id' ),
            'rnas' => $this->param( 'rnas' ),
            'secret' => $this->param( 'secret' )
        )));
    }

    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend('setRnas', array(
            'nas_id' => (int) $this->param( 'id' ),
            'rnas' => $this->param( 'rnas' ),
            'secret' => $this->param( 'secret' ),
            'agent_id' => (int) $this->param( 'agent_id' )
        )));
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delRnas', array(
            'nas_id' => (int) $this->param( 'id' )
        )));
    }

    public function actionDeletelist() {
        $ids = explode( ".", $this->param("list", "") );
        if (!$ids) {
            $this->error( yii::t("No items to delete") );
        }
        foreach ($ids as $id) {
            yii::app()->japi->call( "delRnas", array(
                "nas_id" => (int) $id
            ));
        }
        yii::app()->japi->send( true );
        $this->success( true ); 
    }

    public function actionRemovedevice() {
        $this->success(yii::app()->japi->callAndSend("setRnasDevice", array(
                'device_id' => 0,
            'nas_id' => (int) $this->param("id")
        )));
    }

    public function actionAdddevice() {
        $device = current( yii::app()->japi->callAndSend('getDevices', array(
            "ip" => $this->param("ip")
        )));
        if (!$device) {
            $this->error( "No devices found" );
        }
        $this->success(yii::app()->japi->callAndSend("setRnasDevice", array(
                'device_id' => (int) $device['device_id'],
            'nas_id' => (int) $this->param("id")
        )));
    }

}
