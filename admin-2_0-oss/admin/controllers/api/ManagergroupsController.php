<?php
class ManagergroupsController  extends Controller {
    
    public function actionList() {
        $managers = yii::app()->japi->call('getManagers');
        $groups = yii::app()->japi->call('getManagers', array(
            "istemplate" => 1
        ));
        yii::app()->japi->send( true );
        
        if ($this->param("groupsonly", 0) == 1) {
            $result = $groups->getResult();
        } else {
            $result = array_merge(
                $groups->getResult(),
                $managers->getResult()
            );
        }
        
        $this->success($result);
    }

    public function actionPayment() {
        $this->success(yii::app()->japi->callAndSend( 'getManagers', array( 
            "pay_allowed" => 1
        ))); 
    }
    
    public function actionGet() {
        $this->success(yii::app()->japi->callAndSend('getManagers', array(
            "parentid" => (int) $this->param("id", 0)
        )));
    }
} ?>
