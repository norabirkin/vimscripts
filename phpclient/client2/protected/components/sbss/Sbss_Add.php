<?php

class Sbss_Add extends Sbss_Form {
    protected $defaultparam = 'defaultnew';
    public function title() {
        return $this->t('Add request');
    }
    protected function formConfig() {
        $config = array(
            array(
                'type' => 'select',
                'name' => 'classid',
                'label' => 'Class of request',
                'data' => $this->classes(),
                'value' => 0
            )
        );
        foreach (parent::formConfig() as $k => $item) {
            if ($k == 2) {
                $config[] = array(
                    'type' => 'text',
                    'name' => 'name',
                    'label' => 'Subject of request'
                );
            }
            $config[] = $item;
        }
        return $config;
    }
    public function output() {
        return $this->fnext($this->formConfig())->render();
    }
    private function classes() {
        $data = array($this->t('Default'));
        foreach ($this->a('getSbssRequestClasses') as $item) {
            $data[$item->id] = $item->descr;
        }
        return $data;
    }
}

?>
