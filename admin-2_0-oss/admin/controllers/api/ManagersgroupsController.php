<?php
class ManagersgroupsController  extends Controller {
    
    public function actionList() {

        $params = array();
       
        if ($this->param('person_id')) {
            $params['person_id'] = (integer)$this->param('person_id');
        }
        if ($this->param('not_have_person_id')) {
            $params['not_have_person_id'] = (integer)$this->param('not_have_person_id');
        }

        $groups = yii::app()->japi->call('getManagerGroups', $params);
        yii::app()->japi->send( true );
        $this->success($groups->getResult());
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delManagerGroup', array(
            "group_id" => (int) $this->getRequest()->getParam('group_id')
        )));
    }

    public function actionSave() {
        $params = array(
            "group_id"                 => (int)$this->param("group_id"),
            "descr"                    => (string)$this->param("descr"),
            "name"                     => (string)$this->param("name")
        );
        $this->success( yii::app()->japi->callAndSend('setManagerGroup', $params));
    }

    public function actionAddManagerToGroup() {

        $this->success( yii::app()->japi->callAndSend('addManagerGroupStaff', array(
            "group_id" => (int) $this->param('group_id'),
            "person_id" => (int) $this->param('person_id')
        )));

    }

    public function actionRemoveManagerFromGroup() {

        $this->success( yii::app()->japi->callAndSend('delManagerGroupStaff', array(
            "group_id" => (int) $this->param('group_id'),
            "person_id" => (int) $this->param('person_id')
        )));

    }
      
    
} ?>
