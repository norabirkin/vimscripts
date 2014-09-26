<?php

class TarCategoryExtController extends Controller {
    public function actionList() {
        $params = array(
            'tar_id' => (int) $this->param('tar_id')
        );
        if ($this->param('catsearch')) {
            $params['name'] = $this->param('catsearch');
        }
        $list = new OSSList(array('useSort' => true));
        $data = $list->fields(array(
            'descr',
            'cat_id',
            'tar_id',
            'cat_idx',
            'oper_id',
            'oper_name'
        ))->get('getTarCategory', $params);
    }
    public function actionGet() {
        if (count($result = $this->tariffTypeCratchGet(
            yii::app()->japi->callAndSend('getTarCategory', array(
                'tar_id' => (int) $this->param('tar_id'),
                'cat_idx' => (int) $this->param('id') 
            ))
        )) == 1) {
            $result = $result[0];
            if ($result['cat_idx_master']) {
                $result['master'] = CJSON::encode(array(
                    'cat_idx' => $result['cat_idx_master'],
                    'descr' => $result['cat_idx_master_descr']
                ));
                unset($result['cat_idx_master']);
            }
            $fields = new ComplexFields;
            $this->success($fields->add($result, array(
                $fields->serviceCode(),
                array(
                    'id' => 'cat_id',
                    'key' => 'catalog',
                    'method' => 'getCatalogs',
                    'params' => function($id) {
                        return array(
                            'catalog_id' => $id
                        );
                    }
                ),
            )));
        } else {
            $this->error('Category is not found');
        }
    }
    public function actionDeletelist() {
        $this->deleteList('delTarCategory', 'cat_idx', array(
            'tar_id' => (int) $this->param('tar_id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    public function actionUpdate() {
        $this->save(array(
            'cat_idx' => (int) $this->param('id')
        ));
    }
    private function save($params = array()) {
        $this->success(yii::app()->japi->callAndSend(
            'setTarCategory',
            array_merge($params, array(
                'above' => (float) $this->param('above'),
                'adm_block_above' => (float) $this->param('adm_block_above'),
                'archive' => (int) $this->param('archive'),
                'auto_assign' => (int) $this->param('auto_assign'),
                'available' => (int) $this->param('available'),
                'cat_id' => (
                    (int) $this->param('cat_id') ?
                    (int) $this->param('cat_id') :
                    null
                ),
                'cat_idx_master' => (
                    (int) $this->param('cat_idx_master') ?
                    (int) $this->param('cat_idx_master') :
                    null
                ),
                'code_okei' => (
                    (int) $this->param('code_okei') ?
                    (int) $this->param('code_okei') :
                    null
                ),
                'common' => (int) $this->param('common'),
                'descr' => (string) $this->param('descr'),
                'descr_full' => (string) $this->param('descr_full'),
                'dis_prior' => (int) $this->param('dis_prior'),
                'dtv_type' => (int) $this->param('dtv_type'),
                'enabled' => (int) $this->param('enabled'),
                'free_seconds' => (int) $this->param('free_seconds'),
                'includes' => (int) $this->param('includes'),
                'keep_turned_on' => (int)$this->param('keep_turned_on'),
                'link' => (string) $this->param('link'),
                'min_charge_dur' => (int) $this->param('min_charge_dur'),
                'oper_id' => (int) $this->param('oper_id'),
                'perm_above' => (float) $this->param('perm_above'),
                'round_seconds' => (int) $this->param('round_seconds'),
                'script' => (string) $this->param('script'),
                'script_off' => (string) $this->param('script_off'),
                'serv_func_id' => (
                    (int) $this->param('serv_func_id') ?
                    (int) $this->param('serv_func_id') : 
                    null
                ),
                'tar_id' => (int) $this->param('tar_id'),
                'usr_block_above' => (float) $this->param('usr_block_above'),
                'uuid' => $this->tariffTypeCratchSet(),
                'sale_dictionary_id' => (
                    (int) $this->param('sale_dictionary_id') ?
                    (int) $this->param('sale_dictionary_id') :
                    null
                )
            ))
        ));
    }
    private function tariffTypeCratchGet($result) {
        if ($result) {
            $tar_type = explode(';', $result[0]['uuid']);
            $result[0]['tar_type'] = (int) $tar_type[1];
        }
        return $result;
    }
    private function tariffTypeCratchSet() {
        return uniqid().';'.((string)((int) $this->param('tar_type')));
    }
}

?>
