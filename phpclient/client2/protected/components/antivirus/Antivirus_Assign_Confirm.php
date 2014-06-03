<?php

class Antivirus_Assign_Confirm extends DTV_Confirm_Assign {
    protected function __form() {
        $form = parent::__form();
        $form->add(array(
            'type' => 'custom',
            'value' => yii::app()->controller->renderPartial('application.components.antivirus.views.license', array(
                'url' => yii::app()->baseUrl . '/docs/islovia_F_secure.pdf'
            ), true)
        ));
        return $form;
    }
    protected function submit() {
        $submit = parent::submit();
        $submit['options'] = array(
            'id' => 'lbantivirus_confirm_submit',
            'class' => 'disabled',
            'disabled' => 'disabled'
        );
        return $submit;
    }
}

?>
