<?php
class GrouprolesController  extends Controller {
    
    public function actionList() {

        $params = array();
       
        if ($this->param('group_id')) {
            $params['group_id'] = (integer)$this->param('group_id');
        }
        if ($this->param('unused')) {
            $params['unused'] = $this->param('unused') == 1 ? true : false;
        }

        $groups = yii::app()->japi->call('getManagersGroupRoles', $params);
        yii::app()->japi->send( true );
        $this->success($groups->getResult());
    }

    public function actionAddRoleToGroup() {

        $this->success( yii::app()->japi->callAndSend('addManagerGroupRole', array(
            "group_id" => (int) $this->param('group_id'),
            "role_id" => (int) $this->param('role_id')
        )));

    }

    public function actionDeleteRoleFromGroup() {

        $this->success( yii::app()->japi->callAndSend('delManagerGroupRole', array(
            "group_id" => (int) $this->param('group_id'),
            "role_id" => (int) $this->param('role_id')
        )));

    }

} ?>
