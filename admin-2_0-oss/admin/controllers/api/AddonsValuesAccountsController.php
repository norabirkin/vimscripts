<?php
class AddonsValuesAccountsController extends Controller{

    public function actionList() {
        $params = array(
            'uid' => (int)$this->param('user_id') 
        );
        $fields = yii::app()->japi->callAndSend("getAccountsAddonsSet", array('get_full' => (bool)true));
        
        $values = yii::app()->japi->callAndSend("getAccountAddons", $params);

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

        $struct = array(
            'idx' => (int)$this->param('str_value'),
            'name' => $this->param('name'),
            'str_value' => $this->param('str_value'),
            'uid' => (int)$this->param('user_id')
        );

        $result = yii::app()->japi->callAndSend("setAccountAddon", $struct);
        $this->success();
    }
} ?>
