<?php

class Other_Confirm_Nonrecurrent extends DTV_Confirm {
    public function init() {
    }
    protected function service() {
        return $this->usbox()
        ->categories()
        ->all(false)
        ->get($this->param('catidx'));
    }
    public function usbox() {
        return parent::usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => 0
        ));
    }
    /*public function output() {
        return $this->servicesGrid().parent::output();
    }*/
    private function servicesGrid() {
        $services = new DTV_Services_Grid($this->wizard());
        return $services->active(array(
            'title' => 'Ordered services',
            'data' => $this->data(),
            'columns' => array($this, 'columns')
        ));
    }
    public function data() {
        $data = array();
        foreach ($this->usbox()->all(false) as $service) {
            if ($service->catidx == $this->param('catidx')) {
                $data[] = $service;
            }
        }
        return $data;
    }
    public function columns($columns) {
        $columns['timefrom'] = 'Date of order';
        unset($columns['action']);
        return $columns;
    }
}

?>
