<?php
class AddonsValuesVgroupsController extends Controller{

    public function actionList() {
        $params = array(
            'vg_id' => (int)$this->param('vg_id') 
        );
        $fields = yii::app()->japi->callAndSend("getVgroupsAddonsSet", array('get_full' => (bool)true));
        
        $values = yii::app()->japi->callAndSend("getVgroupAddons", $params);

        if(!is_array($values)) {
            $values = array($values);
        }
        
        if(!is_array($fields)) {
            $fields = array($fields);
        } 

        array_walk($fields, create_function('&$item', '
            $A = array(
                "type" => $item["type"],
                "name" => $item["name"],
                "descr" => $item["descr"],
                "values" => (!is_array($item["values"]) && !is_null($item["values"])) ? array($item["values"]) : $item["values"]
            );
            $item = $A;
        '));
        
        
        foreach($values as &$res) {
            foreach($fields as $key=>$ress) {
                if($res['name'] == $ress['name']) {     
                    $fields[$key]['idx'] = $res['idx'];
                    $fields[$key]['str_value'] = $res['str_value'];
                }
                if ($fields[$key]['str_value'] == '' && $fields[$key]['type'] == 1) {
                    $fields[$key]['str_value'] = 'Undefined';
                }
                
                if ($fields[$key]['type'] == 2) {
                    if ($fields[$key]['str_value'] == '1') {
                        $fields[$key]['str_value'] = 'true';
                    }
                    if ($fields[$key]['str_value'] == '0') {
                        $fields[$key]['str_value'] = 'false';
                    }
                }
            }           
        } 

        
        $this->success( $fields );
    }
    
    
    public function actionSet() {
        $str =  $this->param('str_value');
        
        $struct = array(
            'idx' => (int)$this->param('str_value'),
            'name' => $this->param('name'),
            'str_value' => $this->param('str_value'),
            'vg_id' => (int)$this->param('vg_id')
        );

        $result = yii::app()->japi->callAndSend("setVgroupAddon", $struct);
        $this->success();
    }
} ?>
