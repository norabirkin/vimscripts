<?php 
class AccountsgroupsscheduleController extends Controller{
    
    public function actionList() {
        $result = yii::app()->japi->callAndSend('getVgTariffsSchedule', array (
            'group_id' => (int) (int) $this->getRequest()->getParam('group_id')
        )); 

        foreach ($result as &$item) {
            $datetime = explode(" ", $item['change_time']);
            $item['change_date'] = $datetime[0];
            $item['change_time'] = $datetime[1];
        }

        $this->success($result);
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delVgTariffSchedule', array(
            "rasp_id" => (int) $this->getRequest()->getParam('record_id')
        )));
    }

    public function actionUpdateRecord() {

        $params = array(
            'record_id' => (integer)$this->getRequest()->getParam('record_id'),
            'agent_id' => (integer)$this->getRequest()->getParam('agent_id'),
            'vg_id' => 0, 
            'group_id' => (integer)$this->getRequest()->getParam('group_id'),
            'tar_id_new' => (integer)$this->getRequest()->getParam('tar_id_new'),
            'change_time' => $this->getRequest()->getParam('change_date') . " " . $this->getRequest()->getParam('change_time'),
            "override" => (integer)$this->getRequest()->getParam('override')
        );
        $this->success( yii::app()->japi->callAndSend('setVgTariffSchedule', $params));
    }
} ?>
