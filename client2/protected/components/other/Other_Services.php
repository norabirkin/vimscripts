<?php

class Other_Services extends LBWizardStep {
    private $serviceFunctions;
    private $notBindedServiceFunctions;
    private $agreementServices = array();
    private $vgroupServices = array();
    public function output() {
        $this->serviceFunctions();
        $html = '';
        foreach ($this->lb()->agreements as $agrmid => $agreement) {
            $html .= $this->agreementServicesGrid($agrmid);
        }
        $html = $this->notBindedServiceFunctionsGrid().$html;
        if (!($html = $html . $this->outputVgroupServices())) {
            $html = $this->t('No services found');
        }
        return yii::app()->controller->getPage()->menu().$html;
    }
    private function outputVgroupServices() {
        $grid = new DTV_Services_Grid(array(
            'wizard' => $this->wizard(),
            'defaultTimefrom' => '',
            'defaultTimeto' => $this->t('Unlimited')
        ));
        $html = '';
        foreach ($this->vgroupServices as $vgid => $services) {
            $html .= $grid->idle(array(
                'title' => $this->vgroup($vgid)->vgroup->login,
                'data' => $services,
                'hideOnEmpty' => true,
                'processor' => array(
                    $this,
                    'vgroupProcessor'
                ),
                'columns' => array(
                    $this,
                    'vgroupColumns'
                )
            ));
        }
        return $html;
    }
    public function vgroupColumns($columns) {
        $columns = $this->assocIns($columns, 3, 'timefrom', 'From');
        $columns = $this->assocIns($columns, 4, 'timeto', 'To');
        $columns = $this->assocIns($columns, 5, 'state', 'State of service');
        return $columns;
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
        if (!$service->common) {
            return $this->lnext('Order', array(
                'vgid' => $service->vgid,
                'catidx' => $service->catidx,
                'common' => 0
            ));
        }
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
        if (!$service->common) {
            return '';
        }
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
            'vgid' => $service->vgid,
            'catidx' => $service->catidx,
            'common' => $service->common
        ));
    }
    private function stop($service) {
        return $this->lnext('Stop', array(
            'vgid' => $service->vgid,
            'servid' => $service->service->servid,
            'catidx' => $service->catidx,
            'common' => $service->common
        ));
    }
    private function cancel($service) {
        return $this->lnext('Cancel', array(
            'vgid' => $service->vgid,
            'cancel' => true,
            'servid' => $service->service->servid,
            'catidx' => $service->catidx,
            'common' => $service->common
        ));
    }
    public function vgroupProcessor($row) {
        $row->action = $this->action($row);
        $row->state = $this->state($row);
        if (!$row->common) {
            $row->timefrom = false;
            $row->timeto = false;
        }
        return $row;
    }
    private function agreementServicesGrid($agrmid) {
        $services = new DTV_Services_Grid($this->wizard());
        return $services->idle(array(
            'title' => LB_Style::agrmTitle($agrmid),
            'data' => $this->agreementServices($agrmid),
            'hideOnEmpty' => true,
            'columns' => array($this, 'columns')
        ));
    }
    private function agreementServices($agrmid) {
        $this->agreementServices[$agrmid] = array();
        foreach ($this->vgroups($agrmid) as $vgroup) {
            $this->vgroupServices($vgroup);
        }
        return $this->agreementServices[$agrmid];
    }
    private function vgroupServices($vgroup) {
        foreach ($this->usbox(array(
            'vgid' => $vgroup->vgroup->vgid
        ))->categories('Other_Usbox_Categories')->all() as $category) {
            $this->addVgroupService($vgroup, $category);
        }
    }
    private function addVgroupService($vgroup, $category) {
        if ($module = $this->module($category, $vgroup)) {
            $this->agreementServices
                [$vgroup->vgroup->agrmid]
                [
                    $vgroup->vgroup->tarifid
                    .'.'.
                    $category->catidx
                ]
            = $this->moduleLink($category, $module);
        }
    }
    private function module($category, $vgroup) {
        if (
            (
                !$category->available
                AND
                $category->state != 'active'
            )
            OR
            $category->dtvtype != 0
            OR
            $this->isAntivirus($category)
            OR
            $this->isTurboService($category)
        ) {
            return null;
        } else {
            if ($module = $this->matchServiceFunction($category)) {
                return $module;
            } else {
                $this->addVgroupCategory($category, $vgroup);
            }
        }
    }
    private function addVgroupCategory($category, $vgroup) {
        $this->vgroupServices[$vgroup->vgroup->vgid][$category->catidx] = $category;
    }
    private function vgroupHasDtvAgent($vgroup) {
        return (bool) $vgroup->vgroup->usecas;
    }
    private function isTurboService($category) {
        $turbo = new Internet_Turbo_Helper;
        return $turbo->isTurboService($category);
    }
    private function isAntivirus($category) {
        $antivirus = new Antivirus_Helper;
        return $antivirus->isAntivirus($category);
    }
    private function addLink($category, $vgroup) {
        if ($category->error) {
            $category->descr = $this->noLink($category, $module);
        } else {
            $category->descr = $this->defaultLink($category, $vgroup);
        }
        return $category;
    }
    private function matchServiceFunction($category) {
        foreach ($this->serviceFunctions() as $module => $function) {
            if (@preg_match($function->uuid, $category->uuid)) {
                if (isset($this->notBindedServiceFunctions[$module])) {
                    unset($this->notBindedServiceFunctions[$module]);
                }
                return $module;
            }
        }
        return false;
    }
    private function noLink($category) {
        return $category->descr .' '.  LB_Style::warning($category->error);
    }
    private function moduleLink($category, $module) {
        if ($category->error) {
            $category->descr = $this->noLink($category);
        } else {
            $category->descr = CHtml::link($category->descr, array('/'.$module, array(
                'usbox_uuid' => $category->uuid
            )));
        }
        return $category;
    }
    private function defaultLink($category, $vgroup) {
        return $this->lnext($category->descr, array(
            'catidx' => $category->catidx,
            'agrmid' => $vgroup->vgroup->agrmid,
            'tarid' => $category->tarid,
            'common' => $category->common
        ));
    }
    private function serviceFunctions() {
        if (!$this->serviceFunctions) {
            $this->serviceFunctions = array();
            $this->notBindedServiceFunctions = array();
            foreach ($this->a('getClientServFuncs') as $function) {
                $this->addServiceFunction($function);
            }
        }
        return $this->serviceFunctions;
    }
    private function addServiceFunction($function) {
        if (
            in_array(
                ($module = str_replace('action_', '', $function->savedfile)),
                yii::app()->params['service_function_modules']
            )
        ) {
            $this->serviceFunctions[$module] = $function;
            $this->notBindedServiceFunctions[$module] = $function;
        }
    }
    private function notBindedServiceFunctionsGrid() {
        return $this->grid(array(
            'columns' => array(
                'name' => 'Service name',
                'descr' => 'Description'
            ),
            'hideOnEmpty' => true,
            'data' => $this->notBindedServiceFunctions()
        ))->render();
    }
    private function notBindedServiceFunctions() {
        $data = array();
        foreach ($this->notBindedServiceFunctions as $module => $function) {
            $data[] = array(
                'name' => CHtml::link($function->descr, array('/'.$module)),
                'descr' => $function->descrfull
            );
        }
        return $data;
    }
    public function columns($columns) {
        unset($columns['action']);
        return $columns;
    }
    public function title() {
        return 'Choose service';
    }
}

?>
