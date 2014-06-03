<?php

class Payment_Pay extends LBWizardFinalStep {
    private function formSumbitJS() {
        $output = '';
        Yii::app()->clientScript->registerCoreScript('jquery');
        Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/formautosubmit.js'); 
        Yii::app()->clientScript->render($output);
        return $output;
    }
    protected function post($data, $url) {
        echo yii::app()->controller->renderPartial('application.components.payment.assist.views.request', array(
            'js' => $this->formSumbitJS(),
            'form' => $this->form()
                ->action($url)
                ->method('post')
                ->id('autosubmit')
                ->hidden($data)
                ->render()
        ), true);
        die();
    }
    protected function prepayment($agrmid, $sum, $comment = '') {
        return $this->g('insPrePayment', array(
            "isInsert" => 1,
            "val" => array(
                "agrmid" => $agrmid,
                "amount" => $sum,
                "curname" => 'RUR',
                "paydate" => date('Y-m-d H:i:s'),
                'comment' => $comment
            )
        ));
    }
}

?>
