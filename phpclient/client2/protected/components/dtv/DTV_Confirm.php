<?php

class DTV_Confirm extends LBWizardStep {
    protected $catdescrTitle;
    protected $pageTitle;
    protected $multiple = false;
    private $service;
    public function __construct($params) {
        $this->catdescrTitle = $params['catdescr'] ? (string) $params['catdescr'] : 'Service name';
        $this->pageTitle = (string) $params['title'];
        $this->multiple = (bool) $params['multiple'];
    }
    public function title() {
        return $this->pageTitle;
    }
    public function init() {
        if (!$this->wizard()->isStepStyled()) {
            $this->subtitle();
        }
    }
    protected function __service() {
        if (!$this->service) {
            if (!($this->service = $this->service())) {
                throw new Exception('Service not found');
            }
        }
        return $this->service;
    }
    protected function addAccount() {
        return array(
            'type' => 'display',
            'label' => 'Account',
            'value' => $this->vgroup($this->param('vgid'))->vgroup->login
        );
    }
    protected function addTariff() {
        return array(
            'type' => 'display',
            'label' => 'Tariff plan',
            'value' => $this->vgroup()->vgroup->tarifdescr
        );
    }
    protected function addCatdescr() {
        return array(
            'type' => 'display',
            'label' => $this->catdescrTitle,
            'value' => $this->__service()->descr
        );
    }
    protected function addAbove() {
        return array(
            'type' => 'display',
            'label' => 'Above',
            'value' =>
                $this->price(
                    $this->__service()->above
                ).
                ' / '.
                $this->t(
                    $this->writeoff(
                        $this->__service()->common
                    )
                )
        );
    }
    private function writeoff($common) {
        switch ($common) {
            case 0:
                return 'one-time';
            case 1:
            case 3:
                return 'month';
            case 2:
                return 'day';
        }
    }
    protected function __form() {
        return $this->fnext(array(
            $this->addAccount(),
            $this->addTariff(),
            $this->addCatdescr(),
            $this->addAbove()
        ));
    }
    protected function submit() {
        return array(
            'type' => 'submit',
            'value' => 'Confirm'
        );
    }
    protected function common() {
        return $this->param('common');
    }
    public function output() {
        $form = $this->__form();
        $form->add($this->submit());
        return $form->render();
    }
}

?>
