<?php
class TariffsFreeStaffController extends Controller{

    public function actionList() {
        $params = array(
            "group_id" => $this->param('not_in_group') ? (integer) $this->param('not_in_group') : (integer) $this->param('group_id') ,
            "skip_assigned" => $this->param('not_in_group') ? true : false,
        );
        if ($this->param('search_field_value')) {
            $params['tar_name'] = $this->param('search_field_value');
        }
        $this->success( yii::app()->japi->callAndSend("getTarifsForUserGroup", $params) );
    }
} ?>
