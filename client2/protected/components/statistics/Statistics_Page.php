<?php

class Statistics_Page extends LBWizardStep {
    protected function __data() {
        throw new Exception('define "data" method');
    }
    protected function table() {
        throw new Exception('define "table" method');
    }
    protected function dtto() {
        return $this->param('dtto', $this->defaultDtto());
    }
    protected function dtfrom() {
        return $this->param('dtfrom', $this->defaultDtfrom());
    }
    protected function defaultDtfrom() {
        switch (yii::app()->params['statDatePeriod']) {
            case 'd':
            return date('Y-m-d');
            break;
            case 'w':
            return date('Y-m-d',strtotime('-1 week'));
            break;
            case 'm':
            return date('Y-m-d',strtotime('last month'));
            break;
            default:
            return date('Y-m-d',strtotime('-1 day'));
            break;
        }
    }
    protected function defaultDtto() {
        return date('Y-m-d',strtotime('+1 day'));
    }
    protected function period() {
        return $this->fcurr(array(
            array(
                'type' => 'period',
                'label' => 'Period',
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto()
            )
        ), false)->render();
    }
    protected function agreementSelectData() {
        $data = array(
            '0' => $this->t('All agreements')
        );
        foreach ($this->lb()->agreements as $item) {
            $data[$item->agrmid] = $item->number;
        }
        return $data;
    }
    protected function agrmPeriod() {
        return $this->processForm($this->fcurr(array(
            $this->configureAgrmPeriod($this->agreementSelectData())
        ), false))->render();
    }
    protected function processForm($form) {
        return $form;
    }
    protected function configureAgrmPeriod($data) {
        return array(
            'type' => 'agrmPeriod',
            'label' => 'Agreement',
            'dtfrom' => $this->dtfrom(),
            'dtto' => $this->dtto(),
            'agrmdata' => $data,
            'agrmid' => $this->param('agrmid')
        );
    }
    protected function csvLink() {
        return $this->lcurr('Download history', array(
                'csv' => 1,
            ), array(
                'class' => 'download_statistics'
            )
        );
    }
    protected function __table() {
        $grid = $this->table();
        $grid->setTitle($this->gridTitle());
        $grid->setData($this->data());
        $grid->setCsv($this->csv());
        $grid->setTop(40);
        return $grid->render();
    }
    public function output() {
        return $this->period() . $this->__table();
    }
    protected function data() {
        $data = $this->__data();
        if (!$data->isPagingRequest()) {
            throw new Exception('Data must be remotely paginated');
        }
        return $this->csv() ? $data->all() : $data;
    }
    protected function csv() {
        return $this->param('csv');
    }
    protected function gridTitle() {
        $params = array();
        $tpl = $this->titleTpl();
        if (strpos($tpl, '{login}')) {
            $params['{login}'] = $this->itemLogin();
        }
        if (strpos($tpl, '{link}')) {
            $params['{link}'] = $this->csvLink();
        }
        return array(
            $tpl,
            $params
        );
    }
    public function title() {
        $tpl = $this->titleTpl();
        $params = array(
            '{link}' => ''
        );
        if (strpos($tpl, '{login}')) {
            $params['{login}'] = $this->itemLogin();
        }
        return $this->t($tpl, $params);
    }
    protected function titleTpl() {
        throw new Exception('Define "titleTpl" method');
    }
    protected function itemLogin() {
        return $this->vgroup()->vgroup->login;
    }
}

?>
