<?php

class Other_Vgroups extends LBWizardStep {
    public function data() {
        $data = array();
        foreach ($this->vgroups($this->param('agrmid')) as $vgroup) {
            $this->addService($vgroup, $data);
        }
        return $data;
    }
    private function addService($vgroup, &$data) {
        if ($vgroup->vgroup->tarifid == $this->param('tarid')) {
            $data[] = $this->processService($this->getService($vgroup), $vgroup);
        }
    }
    private function getService($vgroup) {
        return $this->usbox(array(
            'vgid' => $vgroup->vgroup->vgid,
            'unavail' => 0,
            'common' => $this->param('common')
        ))
        ->categories()
        ->all()
        ->get($this->param('catidx'));
    }
    private function processService($service, $vgroup) {
        $service->vgid = $vgroup->vgroup->vgid;
        $service->login = $vgroup->vgroup->login;
        $service->above = $this->price($service->above);
        $service->timefrom = $this->timefrom($service);
        $service->timeto = $this->timeto($service);
        $service->action = $this->action($service);
        $service->state = $this->state($service);
        return $service;
    }
    private function timefrom($service) {
        return $this->period($service, 'timefrom');
    }
    private function timeto($service) {
        return $this->period($service, 'timeto');
    }
    private function period($service, $prop) {
        if ($service->state != 'idle') {
            return $this->time($service->service->$prop, $this->t('Unlimited'));
        }
        return '';
    }
    protected function action($service) {
        switch ($service->state) {
            case 'idle':
                return $this->assign($service);
            case 'active':
                return $this->stop($service);
            case 'scheduled':
                return $this->cancel($service);
        }
    }
    private function state($service) {
        switch ($service->state) {
            case 'idle':
                return $this->t('Not active');
            case 'active':
                return $this->t('Active');
            case 'scheduled':
                return $this->t('Scheduled');
        }
    }
    private function assign($service) {
        return $this->lnext('Assign', array(
            'vgid' => $service->vgid
        ));
    }
    private function stop($service) {
        return $this->lnext('Stop', array(
            'vgid' => $service->vgid,
            'servid' => $service->service->servid
        ));
    }
    private function cancel($service) {
        return $this->lnext('Cancel', array(
            'vgid' => $service->vgid,
            'cancel' => true,
            'servid' => $service->service->servid
        ));
    }
    protected function columns() {
        return array(
            'login' => 'Account',
            'timefrom' => 'From',
            'timeto' => 'To',
            'state' => 'State of service',
            'above' => 'Above',
            'action' => ''
        );
    }
    public function output() {
        return $this->grid(array(
            'title' => LB_Style::agrmTitle($this->param('agrmid')),
            'data' => $this->data(),
            'columns' => $this->columns()
        ))->render();
    }
    public function title() {
        return 'Choose account';
    }
}

?>
