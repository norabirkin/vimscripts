<?php

class Internet_Turbo_Confirm extends Internet_Turbo_Form {
    protected function getForm() {
        $form = $this->baseForm();
        $form->add(array(
            'type' => 'display',
            'label' => 'Duration',
            'value' => ((int) $this->param('mul')) . ' ' . $this->t('hours')
        ));
        $form->add(array(
            'type' => 'display',
            'label' => 'Total cost',
            'value' => $this->price($this->helper()->totalAbove())
        ));
        return $form;
    }
    public function title() {
        return 'Confirm service assigning';
    }
}

?>
