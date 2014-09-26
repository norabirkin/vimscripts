<?php
class TariffsController extends Controller{

    public function actionList() {
        $params = array(
            'ext_count' => true
        );
        if (
            $this->param('tar_types') !== '' AND
            $this->param('tar_types') !== null AND
            $this->param('tar_types') != -1
        ) {
            $params['tar_types'] = array();
            foreach (explode(',', $this->param('tar_types')) as $type) {
                $params['tar_types'][] = (int) $type;
            }
        } elseif (
            $this->param('property') !== '' AND
            $this->param('property') !== null AND
            $this->param('property') != -1
        ) {
            $params['tar_types'] = array((int) $this->param('property'));
        } elseif (
            $this->param('type') !== '' AND
            $this->param('type') !== null AND
            $this->param('type') != -1
        ) {
            $params['tar_types'] = array((int) $this->param('type'));
        }
        if ((int) $this->param('agent_id')) {
            $params['agent_id'] = (int) $this->param('agent_id');
            $params['act_block'] = (int) $this->param('act_block');
            $params['cur_id'] = (int) $this->param('cur_id');
        }
        $result = array();
        if ($this->param('tarsearch')) {
            $params['name'] = $this->param('tarsearch');        
        }
        if ($this->param('value')) {
            $params['name'] = $this->param('value');
        }
        if ($this->param('query')) {
            $params['name'] = $this->param('query');
        }
        $list = new OSSList( array("useSort" => false) );
        $tariffs = $list->getList( 'getTariffs', $params );
        foreach ($tariffs['result']->getResult() as $tariff) {
            $result[] = $this->addExtData($tariff);
        }
        $this->success($result, $tariffs['total']->getResult());
    }

    public function actionImportCategories() {
        $this->success(array(
            'tar_id' => (int) $this->param('tar_id'),
            'catalog_id' => (int) $this->param('catalog_id'),
            'file' => Uploader::get('file', true)
        ));
    }

    public function actionGet() {
        if (!$result = yii::app()->japi->callAndSend('getTariffs', array(
            'tar_id' => (int) $this->param('id')
        ))) {
            $this->success(null);
        } else {
            $this->success($this->addExtData($result[0]));
        }
    }
    
    private function addExtData($tariff) {
        return array_merge($tariff, $tariff["ext_data"]);
    }
    
    private function getServiceCode($item) {
        if (
            $item['sale_dictionary_id'] AND
            (
                $service_code = yii::app()->japi->callAndSend('getSaleDictionaryEntries', array(
                    'record_id' => $item['sale_dictionary_id']
                ))
            )
        ) {
            $item['service_code'] = CJSON::encode($service_code[0]);
        } else {
            $item['service_code'] = null;
        }
        return $item;
    }
    
    public function actionTariffData() {

        $params = array(
            'tar_id' => (int)$this->param('tar_id')
        );
    
        $list = new OSSList( array("useSort" => true) );
        $data = $list->getList("getTariffs", $params);
        
        $item = $data['result']->getResult();
        $result = array();

        foreach($item[0]['ext_data'] as $key=>$value) {
            $result[$key] = ($key == 'catalog_ids') ? array($value) : $value;
        }

        $result = $this->getServiceCode($result);
        unset($result['sale_dictionary_id']);
        
        $result['descr'] = $item[0]['descr'];
        $result['tar_id'] = $item[0]['tar_id'];
        $result['ext_vg_count'] = $item[0]['ext_vg_count'];
        $result['time_mark'] = $item[0]['time_mark'];
        $result['type'] = $item[0]['type'];
        $result['currency'] = CJSON::encode(array(
            'id' => $result['cur_id'],
            'name' => $result['cur_name'],
            'symbol' => $result['symbol']
        ));
        unset($result['cur_id']);
        
        $this->success($result, $data['total']->getResult());
        
    }

    public function actionSetTariffData() {
        $params= array(
            'act_block' => (int)$this->param('act_block'),
            'additional' => (int)$this->param('additional'),
            'adm_block_rent' => (float)$this->param('adm_block_rent'),
            'block_rent' => (float)$this->param('block_rent'),
            'block_rent_duration' => (int)$this->param('block_rent_duration'),
            'charge_incoming' => (int)$this->param('charge_incoming'),
            'coef_high' => (float)$this->param('coef_high'),
            'coef_low' => (float)$this->param('coef_low'),
            'cur_id' => (int)$this->param('cur_id'),
            'daily_rent' => (int)$this->param('daily_rent'),
            'descr' => $this->param('descr'),
            'descr_full' => $this->param('descr_full'),
            'dyn_route' => (int)$this->param('dyn_route'),
            'dynamic_rent' => (int)$this->param('dynamic_rent'),
            'link' => $this->param('link'),
            'rent' => (float)$this->param('rent'),
            'rent_multiply' => (int)$this->param('rent_multiply'),
            'sale_dictionary_id' => ($this->param('sale_dictionary_id')=='') ? null : (int)$this->param('sale_dictionary_id'),
            'shape' => (int)$this->param('shape'),
            'shape_prior' => (int)$this->param('shape_prior'),
            'tar_id' => (int)$this->param('tar_id'),
            'traff_limit' => (int)$this->param('traff_limit'),
            'traff_limit_per' => (int)$this->param('traff_limit_per'),
            'traff_type' => (int)$this->param('traff_type'),
            'type' => (int)$this->param('type'),
            'unavailable' => (int)$this->param('unavailable'),
            'usr_block_rent' => (float)$this->param('usr_block_rent'),
            'uuid' => $this->param('uuid')
        );
        //$params = $this->addFakeShapes($params);
        

        $this->success( yii::app()->japi->callAndSend('setTariff', $params) );                  
    }
    
    
    public function actionTariffCatalog() {

        $params = array(
            'tar_id' => (int)$this->param('tar_id')
        );
    
        $list = new OSSList( array("useSort" => true) );
        $data = $list->getList("getTariffs", $params);
        $item = $data['result']->getResult();
        $result = array();
        
        foreach($item[0]['ext_data']['catalog_ids'] as $key=>$value) {
            $result[$key] = $value;
        }
        
        $this->success($result, $data['total']->getResult());
        
    }
    
    
    public function  actionDelete() {
        $params = array(
            'tar_id' => (int)$this->param('tar_id')
        );
        $this->success( yii::app()->japi->callAndSend('delTariff', $params) );
    }
    
    
    public function  actionClone() {
        $params = array(
            'tar_id' => (int)$this->param('tar_id'),
            'descr_prefix' => ' ('. $this->param('descr') . ')'
        );
        $this->success( yii::app()->japi->callAndSend('cloneTariff', $params) );
    }
        
        
    public function actionCategoriesList() {

        $params = array(
            'tar_id' => (int)$this->param('tar_id')
        );
        if ($this->param('catsearch')) {
            $params['name'] = $this->param('catsearch');
        }
    
        $list = new OSSList( array("useSort" => true) );
        $data = $list->getList("getTarCategory", $params);
        $result = array();
        foreach($data['result']->getResult() as $item) {
            
            $result[] = array(
                'descr' => $item['descr'],
                'cat_id' => $item['cat_id'],
                'tar_id' => (int)$this->param('tar_id'),
                'cat_idx' => $item['cat_idx'],
                'oper_id' => $item['oper_id'],
                'oper_name' => $item['oper_name']
            );
        } 
        $this->success($result);
    }

    public function actionCatalogs() {
        $list = new OSSList;
        $list->get('getCatalogs', array(
            'type' => (int) $this->param('type'),
            'name' => (string) $this->param('query')
        ));
    }
    
    public function actionLoadCategoryData() {
        $send = false;
        $params = array(
            'tar_id' => (int)$this->param('tar_id'),
            'cat_idx' => (int)$this->param('cat_idx') 
        );
        $result = yii::app()->japi->callAndSend('getTarCategory', $params);
        $tar_type = explode(';', $result[0]['uuid']);
        $result[0]['tar_type'] = (int) $tar_type[1];
        if ($result[0]['sale_dictionary_id']) {
            $result[0]['service_code'] = yii::app()->japi->call('getSaleDictionaryEntries', array(
                'record_id' => $result[0]['sale_dictionary_id']
            ));
            $send = true;
        }
        if ($result[0]['cat_id']) {
            $result[0]['catalog'] = yii::app()->japi->call('getCatalogs', array(
                'catalog_id' => $result[0]['cat_id']
            ));
            $send = true;
        }
        if ($send) {
            yii::app()->japi->send(true);
        }
        foreach (array('service_code', 'catalog') as $name) {
            if ($result[0][$name]) {
                $result[0][$name] = $result[0][$name]->getResult();
                $result[0][$name] = CJSON::encode($result[0][$name]);
            }
        }
        $this->success($result);
    }

    public function actionCategoryDiscounts() {

        $params = array(
            'tar_id' => (int)$this->param('tar_id'),
            'cat_idx' => (int)$this->param('cat_idx') 
        );
        $result = yii::app()->japi->callAndSend('getTarCategoryDiscount', $params);
        // count, rate, object, tar_id, cat_idx
        if (empty($result)) {
            $this->success(array());
        }
        
        if(!is_array($result)) {
            $result = array($result);
        }
        
        $data = array();
        foreach ($result as $item) {

            if(!is_array($item['discounts'])) {
                $item['discounts'] = array($item['discounts']);
            }
            
            foreach($item['discounts'] as $disc) {
                $data[] = array(
                    'count' => $disc['count'],
                    'rate' => $disc['rate'],
                    'record_id' => $disc['record_id'],
                    'object' => $item['object'],
                    'tar_id' => $item['tar_id'],
                    'cat_idx' => $item['cat_idx']
                );
            }
        
        }
        $this->success($data);
    }
    
    
    
    public function actionSetCategoryDiscount() {
        
        $discounts = array(
            'record_id'=> (int)$this->param('record_id'),
            'count'=> (int)$this->param('count'),
            'rate'=> (float)$this->param('rate')
        );
        
        $params = array(
            'tar_id' => (int)$this->param('tar_id'),
            'cat_idx' => (int)$this->param('cat_idx'),
            'object' => (int)$this->param('object'),
            'discounts' => array( $discounts )
        );
        
        yii::app()->japi->callAndSend('setTarCategoryDiscount', $params);
        $this->success();
    }   
    
    
    
    public function actionMasterCategory() {
        $list = new OSSList;
        $list->get('getMasterCategory', array(
            'cat_id' => (int) $this->param('cat_id'),
            'descr' => (string) $this->param('query')
        ));
    }   
    
    
    
    public function actionSetTariffCategory() {
        $params = array(
            'above' => (float)$this->param('above'),
            'adm_block_above' => (float)$this->param('adm_block_above'),
            'archive' => (int)$this->param('archive'),
            'auto_assign' => (int)$this->param('auto_assign'),
            'available' => (int)$this->param('available'),
            //'cat_id' => (int)$this->param('cat_id'),
            'cat_idx' => (int)$this->param('cat_idx'),
            'cat_idx_master' => null,//(int)$this->param('cat_idx_master'),
            'code_okei' => null,//(int)$this->param('code_okei'),
            'common' => (int)$this->param('common'),
            'descr' => $this->param('descr'),
            'descr_full' => $this->param('descr_full'),
            'dis_prior' => (int)$this->param('dis_prior'),
            'dtv_type' => (int)$this->param('dtv_type'),
            'enabled' => (int)$this->param('enabled'),
            'free_seconds' => (int)$this->param('free_seconds'),
            'includes' => (int)$this->param('includes'),
            'keep_turned_on' => (int)$this->param('keep_turned_on'),
            'link' => $this->param('link'),
            'min_charge_dur' => (int)$this->param('min_charge_dur'),
            'oper_id' => (int)$this->param('oper_id'),
            'perm_above' => (float)$this->param('perm_above'),
            'round_seconds' => (int)$this->param('round_seconds'),
            'sale_dictionary_id' => ($this->param('sale_dictionary_id')=='') ? null : (int)$this->param('sale_dictionary_id'),
            'script' => $this->param('script'),
            'script_off' => $this->param('script_off'),
            'serv_func_id' => null,//(int)$this->param('serv_func_id'),
            'tar_id' => (int)$this->param('tar_id'),
            'usr_block_above' => (float)$this->param('usr_block_above'),
            'uuid' => uniqid().';'.((string)((int) $this->param('tar_type'))) 
        );
        
        yii::app()->japi->callAndSend('setTarCategory', $params);
        $this->success();
    }
} ?>
