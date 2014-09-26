<?php
class ManagersController  extends Controller {
    
    public function actionList() {
        $params = array();
        if ((int)$this->param("group_id") != 0) {
            $params['in_group_id'] = (int)$this->param("group_id");
        }
        if($this->param("search") != '') {
            $params['search'] = $this->param("search");
        }
        $managers = yii::app()->japi->call('getManagers', $params);
        yii::app()->japi->send( true );
        $result = $managers->getResult();
        $this->success($result);
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delManager', array(
            "person_id" => (int) $this->getRequest()->getParam('person_id')
        )));
    }

    public function actionSave() {    
        $params = array(
            "person_id"                 => (int)$this->param("person_id"),
            "cash_register_folder"      => (string)$this->param("cash_register_folder"),
            "descr"                     => (string)$this->param("descr"),
            "email"                     => (string)$this->param("email"),
            "external_id"               => (string)$this->param("external_id"),
            "fio"                       => (string)$this->param("fio"),
            "login"                     => (string)$this->param("login"),
            "office"                    => (string)$this->param("office"),
            'pay_class_id'              => (int) $this->param("pay_class_id"),
            "payments"                  => ((string)$this->param('payments') == 'on') ? true : false,
            "open_pass"                  => ((string)$this->param('open_pass') == 'on') ? true : false
        );

        if ($this->param("pass_changed") == 'true') {
            $params['pass'] = (string)$this->param("pass");
        }

        $this->success( yii::app()->japi->callAndSend('setManager', $params));
    }

    public function actionGet() {
        $manager = yii::app()->japi->callAndSend('getManagers', array(
            'person_id' => (int) $this->param('id')
        ));
        $this->success($manager[0]);
    }
    
} ?>
