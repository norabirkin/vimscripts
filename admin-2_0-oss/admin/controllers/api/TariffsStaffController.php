<?php
class TariffsStaffController extends Controller{

    public function actionList() {
        $params = array();
        if ($this->param('in_group')) {
            $params['group_id'] = (integer) $this->param('in_group');
        }
        if ($this->param('search_field_value')) {
            $params['tar_name'] = $this->param('search_field_value');
        }
        $this->success( yii::app()->japi->callAndSend("getTarifsStaff", $params) );
    }
} ?>
