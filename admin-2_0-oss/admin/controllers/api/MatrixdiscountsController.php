<?php
class MatrixdiscountsController extends Controller{
    
    public function actionList() {

        $result = yii::app()->japi->callAndSend('getDiscountAddons');
        foreach ($result as $key => &$item) {
            if ((int)$item["action_id"] > 0) { 
                $item["type"] = 1; 
                $item["sid"] = (int)$item["action_id"]; 
            }
            if ((int)$item["packet_id"] > 0) { 
                $item["type"] = 2; 
                $item["sid"] = (int)$item["packet_id"]; 
            }
            if ((int)$item["individual"] > 0) { 
                $item["type"] = 3; 
                $item["sid"] = (int)$item["individual"]; 
            }
        }
        $this->success( $result ); 
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delDiscountAddon', array(
            "record_id" => (int) $this->getRequest()->getParam('id')
        )));
    }

    public function actionSetPromotions() {
        $ids = explode( ",", $this->param("ids", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->call('setDiscountAddon', array(
                "action_id"    => (int) $id,
                "method"    => 0
            ));
        }
        yii::app()->japi->send( true );
        $this->success(true);
    }

    public function actionSetPackets() {
        $ids = explode( ",", $this->param("ids", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->call('setDiscountAddon', array(
                "packet_id"    => (int) $id,
                "method"    => 0
            ));
        }
        yii::app()->japi->send( true );
        $this->success(true);
    }

    public function actionSetPersonalDiscount() {
        $this->success( yii::app()->japi->callAndSend( 'setDiscountAddon', array(
            "individual" => 1,
            "method" => 0
        )));
    }

    public function actionUpdateRecord() {
        $this->success( yii::app()->japi->callAndSend( 'setDiscountAddon', array(
            "record_id" => (int) $this->getRequest()->getParam('id'),
            "method" => (int) $this->getRequest()->getParam('method', 0)
        )));
    }
} ?>
