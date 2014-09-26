<?php
class PhonereplacesController extends Controller {

    public function actionCreate() {
        $this->success( yii::app()->japi->callAndSend( "setPhoneReplace", array(
                "agent_id" => (int) $this->param( "agent_id" ),
                "l_trim" => (int) $this->param( "l_trim" ),
                "replace_what" => (int) $this->param( "replace_what" ),
                "old_number" => $this->param( "old_number" ),
                "new_number" => $this->param( "new_number" )
        )));
    }

    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend( "setPhoneReplace", array(
                "record_id" => (int) $this->param( "id" ),
                "agent_id" => (int) $this->param( "agent_id" ),
                "l_trim" => (int) $this->param( "l_trim" ),
                "replace_what" => (int) $this->param( "replace_what" ),
                "old_number" => $this->param( "old_number" ),
                "new_number" => $this->param( "new_number" )
        )));

    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( "delPhoneReplace", array(
            "record_id" => (int) $this->param( "id" ),
        )));
    }

    public function actionList() {
        $this->success( yii::app()->japi->callAndSend( "getPhoneReplaces", array(
            "agent_id" => (int) $this->param("agent_id")
        )));
    }
} ?>
