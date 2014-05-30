<?php

class Internet_Turbo_Form extends LBWizardStep {
    protected function baseForm() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup()->vgroup->login
            ),
            array(
                'type' => 'display',
                'label' => 'Agreement number',
                'value' => $this->agreement()->number
            ),
            array(
                'type' => 'display',
                'label' => 'Agreement balance',
                'value' => $this->price($this->agreement()->balance)
            ),
            array(
                'type' => 'display',
                'label' => 'Available balance',
                'value' => $this->t(
                    '{totalBalance} (Agreement balance: {balance}; credit: {credit})',
                    array(
                        '{totalBalance}' => $this->price($this->helper()->totalBalance()),
                        '{balance}' => $this->price($this->agreement()->balance),
                        '{credit}' => $this->price($this->agreement()->credit)
                    )
                )
            ),
            array(
                'type' => 'display',
                'label' => 'Service',
                'value' => $this->service()->descr
            ),
            array(
                'type' => 'display',
                'label' => 'Above',
                'value' => $this->price($this->service()->above, $this->t('RUB/hour'))
            ),
            array(
                'type' => 'display',
                'label' => 'Speed after assigning service',
                'value' => $this->speed()
            )
        ));
    }
    private function speed() {
        $speed = explode(':', $this->service()->script);
        return LB_Style::kbToMb($speed[3]);
    }
    public function service() {
        return $this->helper()->service();
    }
    public function output() {
        $turbo = new Internet_Turbo_Active;
        $form = $this->getForm();
        if (!$this->param('done')) {
            $form->add(array(
                'type' => 'submit',
                'value' => 'Confirm'
            ));
        }
        return $form->render() .
        '<br/>' .
        $turbo->output();
    }
}

?>
