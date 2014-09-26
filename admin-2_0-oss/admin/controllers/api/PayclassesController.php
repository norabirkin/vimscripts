<?php
class PayclassesController extends Controller {
    
    public function actionList() {
        $permissions = UserIdentity::getPermissions();
        if ( $this->param("selectdefault") ) {
            $manager = yii::app()->japi->call("getManagers", array(
                "person_id" => $permissions['person_id']
            ));
            $transferclass = yii::app()->japi->call("getOption", array("name" => "default_transfer_classid"));
        }
        $classes = yii::app()->japi->call("getPayClasses");
        yii::app()->japi->send( true );
        $classes = $classes->getResult();
        if ( $this->param("selectdefault") ) {
            $manager = $manager->getResult();
            $transferclass = $transferclass->getResult();
            foreach ($classes as $k => $v) {
                $classes[$k]["default"] = ($v["class_id"] == $manager[0]["pay_class_id"] ? true : false);
                $classes[$k]["default_transfer"] = ($v["class_id"] == $transferclass["value"] ? true : false);
            }
        }
        $this->success( $classes );
    }
    
    public function actionGet() {
        $this->success( yii::app()->japi->callAndSend("getPayClasses", array(
            "class_id" => (int) $this->param("id", 0)
        )));
    }
    
    public function actionCreate() {
        $this->success( yii::app()->japi->callAndSend("setPayClass", array(
            'descr' => $this->param("descr", ""),
            'extern_code' => $this->param("extern_code", ""),
            'name' => $this->param("name", "")
        )));
    }
    
    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend("setPayClass", array(
            "class_id" => (int) $this->param("id", 0),
            'descr' => (string)$this->param("descr", ""),
            'extern_code' => $this->param("extern_code", ""),
            'name' => (string)$this->param("name", "")
        )));
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend("delPayClass", array(
            "class_id" => (int) $this->param("class_id", 0)
        )));
    }
    
} ?>
