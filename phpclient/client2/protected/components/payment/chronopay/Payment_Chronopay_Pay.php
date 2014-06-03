<?php

class Payment_Chronopay_Pay extends LBWizardFinalStep {
    public function execute() {
        yii::app()->controller->redirect('https://secure.chronopay.com/index_shop.cgi?product_id='.$this->param('agrmid').'&product_price='.$this->param('sum'));
    }
}

?>
