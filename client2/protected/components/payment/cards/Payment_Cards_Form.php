<?php

class Payment_Cards_Form extends Payment_Form {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'select',
                'label' => 'Select agreement',
                'value' => 3,
                'data' => array(
                    1 => 'item #1',
                    2 => 'item #2',
                    3 => 'item #3',
                    4 => 'item #4'
                )
            ),
            array(
                'type' => 'display',
                'label' => 'Selected agreement',
                'value' => $this->agrmnum()
            ),
            array(
                'type' => 'text',
                'name' => 'card_serial',
                'label' => 'Serial number',
                'note' => 'without spaces'
            ),
            array(
                'type' => 'text',
                'name' => 'card_code',
                'label' => 'Card code',
                'note' => 'without spaces'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))->render();
    }
    public function title() {
        return yii::t('main', 'Pay card form');
    }
}

?>
