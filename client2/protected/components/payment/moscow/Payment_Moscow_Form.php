<?php

class Payment_Moscow_Form extends LBWizardStep {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'number',
                'name' => 'AMOUNT',
                'label' => 'Sum'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))->render();
    }
    private function nonce() {
        $nonce = '';
        $characters = explode('.', '0.1.2.3.4.5.6.7.8.9.A.B.C.D.E.F');
        $count = count($characters);
        for ( $i = 0; $i < $count; $i++ ){
            $nonce .= $characters[mt_rand(0, ($count - 1))];
        }
        return $nonce;
    }
    public function title() {
        return 'Payment form';
    }
}

?>
