<?php
class ManagerrolesController  extends Controller {
    
    public function actionList() {
        $params = array();
       
        if ($this->param('person_id')) {
            $params['person_id'] = (integer)$this->param('person_id');
        }
        if ($this->param('unused')) {
            $params['unused'] = $this->param('unused') == 1 ? true : false;
        }

        $groups = yii::app()->japi->call('getManagersRoles', $params);
        yii::app()->japi->send( true );
        $this->success($groups->getResult());
    }

    public function actionAddRoleToManager() {
        $roles = explode(',', $this->param('role_id'));
        if(count($roles) > 0) {
            foreach($roles as $role) {
                $params = array(
                    "person_id" => (int)$this->param('person_id'),
                    "role_id" => (int)$role
                );

                $result = yii::app()->japi->callAndSend('addManagerRole', $params);
            }
        }
           
        
        $this->success();
    }

    public function actionDeleteRoleFromManager() {
        $roles = explode(',', $this->param('role_id'));
        
        if(count($roles) > 0) {
            foreach($roles as $role) {
                $params = array(
                    "person_id" => (int)$this->param('person_id'),
                    "role_id" => (int)$role
                );

                $result = yii::app()->japi->callAndSend('delManagerRole', $params);
            }
        }
        
        $this->success();

    }

} ?>
