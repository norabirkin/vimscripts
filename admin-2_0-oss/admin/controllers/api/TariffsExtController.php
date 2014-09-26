<?php

class TariffsExtController extends Controller {
    public function actionGet() {
        if (count($data = yii::app()->japi->callAndSend('getTariffs', array(
            'tar_id' => (int) $this->param('id')
        ))) == 1) {
            $data = $data[0];
            $data = $this->addExtData($data);
            $fields = new ComplexFields;
            $data = $fields->add($data, array($fields->serviceCode()));
            $data = $this->addCurrency($data);
            $this->success($data);
        } else {
            $this->error('Tariff is not found');
        }
    }
    public function actionUpdate() {
        $this->save(array(
            'tar_id' => (int) $this->param('id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    private function save($params = array()) {
        $this->success(yii::app()->japi->callAndSend('setTariff',
            array_merge($params, array(
                'act_block' => (int) $this->param('act_block'),
                'additional' => (int) $this->param('additional'),
                'adm_block_rent' => (float) $this->param('adm_block_rent'),
                'block_rent' => (float) $this->param('block_rent'),
                'block_rent_duration' => (int) $this->param('block_rent_duration'),
                'charge_incoming' => (int) $this->param('charge_incoming'),
                'coef_high' => (float) $this->param('coef_high'),
                'coef_low' => (float) $this->param('coef_low'),
                'cur_id' => (int) $this->param('cur_id'),
                'daily_rent' => (int) $this->param('daily_rent'),
                'descr' => (string)  $this->param('descr'),
                'descr_full' => (string)  $this->param('descr_full'),
                'dyn_route' => (int) $this->param('dyn_route'),
                'dynamic_rent' => (int) $this->param('dynamic_rent'),
                'link' => (string) $this->param('link'),
                'rent' => (float) $this->param('rent'),
                'rent_multiply' => (int) $this->param('rent_multiply'),
                'sale_dictionary_id' => (
                    $this->param('sale_dictionary_id') == '' ?
                    null :
                    (int) $this->param('sale_dictionary_id')
                ),
                'shape' => (int) $this->param('shape'),
                'shape_prior' => (int) $this->param('shape_prior'),
                'traff_limit' => (int) $this->param('traff_limit'),
                'traff_limit_per' => (int) $this->param('traff_limit_per'),
                'traff_type' => (int) $this->param('traff_type'),
                'type' => (int) $this->param('type'),
                'unavailable' => (int) $this->param('unavailable'),
                'usr_block_rent' => (float) $this->param('usr_block_rent'),
                'uuid' => (string) $this->param('uuid')
            ))
        ));                  
    }
    private function addExtData($data) {
        $data = array_merge($data, $data['ext_data']);
        unset($data['ext_data']);
        return $data;
    }
    private function addCurrency($data) {
        $data['currency'] = CJSON::encode(array(
            'id' => $data['cur_id'],
            'name' => $data['cur_name'],
            'symbol' => $data['symbol']
        ));
        unset($data['cur_id']);
        return $data;
    }
}

?>
