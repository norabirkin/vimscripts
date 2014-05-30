<?php

class Internet_Turbo_Active extends LBWizardItem {
    public function output() {
        return $this->grid(array(
            'title' => 'Current turbo services',
            'data' => $this->data(),
            'columns' => array(
                'timefrom' => 'Start date',
                'timeto' => 'End date',
                'login' => 'Login',
                'shape' => 'Shape',
                'descr' => 'Description'
            )
        ))->render();
    }
    protected function data() {
        $data = array();
        foreach ($this->vgroups() as $vgroup) {
            if ($vgroup->turboshape) {
                $data = array_merge($data, $this->arr($vgroup->turboshape));
            }
        }
        return $this->processTurboShape($data);
    }
    protected function processTurboShape($turboshape) {
        foreach ($turboshape as $k => $v) {
            $turboshape[$k]->shape = LB_Style::kbToMb($v->shape);
        }
        return $turboshape;
    }
}

?>
