<?php

class VgrouptariffhistoryController extends Controller {
    public function fake() {
        yii::app()->japi->useFake();
        yii::app()->japi->fakeConnection(

            FRequest::get()
            ->auth()
            ->call('setVgTariffSchedule', array(
                'agent_id' => 2,
                'change_time' => '2012-09-24 17:55:00',
                'multi_tariff' => true,
                'record_id' => 861,
                'tar_id_new' => 133,
                'time_to' => '',
                'vg_id' => 913
            )),

            FResponse::get()
            ->auth()
            ->result(true)
        );
    }
    public function actionList() {
        $list = new OSSList(array('useSort' => false));
        $list->get('getVgTariffs', array(
            'vg_id' => (int) $this->param('vg_id')
        ));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend(
            (((bool) $this->param('is_multi')) ? 'delMultiTariff' : 'delVgTariffSchedule'),
            array(
                (((bool) $this->param('is_multi')) ? 'record_id' : 'rasp_id') => (int) $this->param('record_id')
            )
        ));
    }
    public function actionUpdate() {
        //$this->fake();
        $this->success(yii::app()->japi->callAndSend('setVgTariffSchedule', array(
            'agent_id' => (int) $this->param('agent_id'),
            'change_time' => (string) $this->param('change_time'),
            'multi_tariff' => (bool) $this->param('multi_tariff'),
            'record_id' => (int) $this->param('id'),
            'tar_id_new' => (int) $this->param('tar_id_new'),
            'time_to' => (string) $this->param('time_to'),
            'vg_id' => (int) $this->param('vg_id'),
            'discount' => (float) $this->param('discount')
        )));
    }
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setVgTariffSchedule', array(
            'agent_id' => (int) $this->param('agent_id'),
            'change_time' => (string) $this->param('change_time'),
            'multi_tariff' => (bool) $this->param('multi_tariff'),
            'tar_id_new' => (int) $this->param('tar_id_new'),
            'time_to' => (string) $this->param('time_to'),
            'vg_id' => (int) $this->param('vg_id'),
            'discount' => (float) $this->param('discount')
        )));
    }
}

?>
