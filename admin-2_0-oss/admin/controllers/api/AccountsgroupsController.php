<?php 
class AccountsgroupsController extends Controller{
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getGroupsExt') ); 
    }

    public function actionUpdateRecord() {
        $this->success( yii::app()->japi->callAndSend('setGroup', array(
            "group_id" => (int) $this->getRequest()->getParam('group_id'),
            "descr" => $this->getRequest()->getParam('descr', ""),
            "name" => $this->getRequest()->getParam('name', "")
        )));
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delGroup', array(
            "group_id" => (int) $this->getRequest()->getParam('group_id')
        )));
    }


    public function actionRemoveAccount() {

        if ($this->param('remove_all')) {

            $this->success( yii::app()->japi->callAndSend('delGroupStaff', array(
                "group_id" => (int) $this->param('group_id')
            )));

        } else {

            $ids = explode( ",", $this->param("vg_ids", "") );
            if (!$ids) {
                return;
            }
            foreach ($ids as $id) {
                yii::app()->japi->callAndSend('delGroupStaff', array(
                    "group_id" => (int) $this->param('group_id'),
                    "vg_id" => (int) $id
                ));
            }
            $this->success(true);
        }
    }

    public function actionAddAccount() {

        $ids = explode( ",", $this->param("vg_ids", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->callAndSend('setGroupStaff', array(
                "group_id" => (int) $this->param('group_id'),
                "vg_id" => (int) $id
            ));
        }
        $this->success(true);
    }

    public function actionRemoveTariff() {

        $ids = explode( ",", $this->param("tar_ids", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->callAndSend('delTarifStaffItem', array(
                "group_id" => (int) $this->param('group_id'),
                "tar_id" => (int) $id
            ));
        }
        $this->success(true);
    }

    public function actionAddTariff() {

        $ids = explode( ",", $this->param("tar_ids", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->callAndSend('setTarifStaffItem', array(
                "group_id" => (int) $this->param('group_id'),
                "tar_id" => (int) $id
            ));
        }
        $this->success(true);
    }

} ?>
