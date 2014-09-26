<?php
class AddonsStaffController extends Controller{
    
    /*
    * Получение списка методов GET для списка доп. полей
    * $type -> id вкладки в интерфейсе
    */
    
    public function getSetMethodGet($type) {
        if($type == 2) {
            $method = 'getVgroupsAddonsSet';
        } else if($type == 0) {
            $method = 'getAccountsAddonsSet';
        } else {
            $method = 'getAgreementsAddonsSet';
        }
        return $method;
    }
    
    /*
    * Получение списка методов GET для списка возможных зачений доп. полей
    * $type -> id вкладки в интерфейсе
    */
    
    public function getStaffMethodGet($type) {
        if($type == 2) {
            $method = 'getVgroupsAddonsStaff';
        } else if($type == 0) {
            $method = 'getAccountsAddonsStaff';
        } else {
            $method = 'getAgreementsAddonsStaff';
        }
        return $method;
    }
    
    
    /*
    * Получение списка методов SET для списка возможных зачений доп. полей
    * $type -> id вкладки в интерфейсе
    */
    
    public function getStaffMethodSet($type) {
        if($type == 2) {
            $method = 'setVgroupsAddonsStaff';
        } else if($type == 0) {
            $method = 'setAccountsAddonsStaff';
        } else {
            $method = 'setAgreementsAddonsStaff';
        }
        return $method;
    }
    
    /*
    * Получение списка методов SET для списка доп. полей
    * $type -> id вкладки в интерфейсе
    */
    
    public function getSetMethodSet($type) {
        if($type == 2) {
            $method = 'setVgroupsAddonsSet';
        } else if($type == 0) {
            $method = 'setAccountsAddonsSet';
        } else {
            $method = 'setAgreementsAddonsSet';
        }
        return $method;
    }
    
    /*
    * Получение списка методов DELETE для списка доп. полей
    * $type -> id вкладки в интерфейсе
    */
    
    public function getSetMethodDel($type) {
        if($type == 2) {
            $method = 'delVgroupsAddonsSet';
        } else if($type == 0) {
            $method = 'delAccountsAddonsSet';
        } else {
            $method = 'delAgreementsAddonsSet';
        }
        return $method;
    }
    
    /*
    * Получение списка дополнительных полей (для настройки) в открытой вкладке интерфейса
    */
    
    public function actionList() {
        $addons = yii::app()->japi->callAndSend($this->getSetMethodGet($this->param('addonsType')), array('get_full' => true));
        foreach($addons as $k=>$addon) {
            if($addon['type'] == 1 && count($addon['values'])>0) {
                $vals = array();
                foreach($addon['values'] as $value) {
                    $vals[] = $value['value'];
                }
                $addons[$k]['str_value'] = implode('; ', $vals);
                unset($addons[$k]['values']);
            }
        }        
        $this->success( $addons );
    }
    
    /*
    * Получение списка значений дополнительного поля. Актуально для поля с типом "Список"
    */
    
    public function actionValues() {
        $params = array(
            'name' => $this->param('name')
        );
        $result = yii::app()->japi->callAndSend($this->getStaffMethodGet($this->param('type')), $params);
        $this->success( $result['values'] );
    }
    
    
    public function actionSet() {
        if((string)$this->param('name') == '') {
            $this->success();
        }
        
        $params = array(
            'name' => (string)$this->param('name'),
            'descr' => (string)$this->param('descr'),
            'type' => (int)$this->param('type'),
            'values' => array()
        );
        
        if($this->param('type') == 1) {
            $params['values'] = CJSON::decode( $this->param('values'));
        }
        
        if($this->param('agent_id') != '') {
            $params['agent_id'] = (int)$this->param('agent_id');
        }
        
           $result = yii::app()->japi->callAndSend($this->getSetMethodSet($this->param('addonsType')), $params);
        $this->success($result);
    }
    
    
    public function actionDeleteParams() {
        if((string)$this->param('name') == '') {
            $this->success();
        }
        
        $values = CJSON::decode( $this->param('values'));
        foreach($values as $k=>$value) {
            if($value['idx'] == (int)$this->param('idx')) {
                unset($values[$k]);
            }
        }
        
        $params = array(
            'name' => (string)$this->param('name'),
            'values' => $values
        );
        
           $result = yii::app()->japi->callAndSend($this->getStaffMethodSet($this->param('addonsType')), $params);
        $this->success($result);
    }
    
    
    public function actionDeleteAddon() {
        /*if((string)$this->param('name') == '') {
            $this->success();
        }*/
        
        $params = array(
            'name' => (string)$this->param('name')
        );

           $result = yii::app()->japi->callAndSend($this->getSetMethodDel($this->param('addonsType')), $params);
        $this->success($result);
    }
    
} ?>
