<?php

class InstallmentsController extends Controller {
    public function actionList() {
        $this->success(yii::app()->japi->callAndSend('getInstallmentsPlans'));
    }
}

?>
