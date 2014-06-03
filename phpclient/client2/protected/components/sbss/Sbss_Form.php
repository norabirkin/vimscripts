<?php

class Sbss_Form extends LBWizardStep {
    protected $defaultparam = '';
    protected $statusid = 0;
    protected $statuses = array(
        'list' => array(),
        'current' => null,
        'default' => 0
    );
    public function init() {
        $this->subtitle();
        $this->statuses();
    }
    protected function formConfig() {
        return array(
            array(
                'type' => 'select',
                'name' => 'statusid',
                'data' => $this->statuses['list'],
                'value' => $this->statuses['default'],
                'label' => 'Status of request'
            ),
            array(
                'type' => 'file',
                'name' => 'attach',
                'boxClass' => 'sbss-file-box',
                'fileName' => 'sbss_file',
                'label' => 'Attach file'
            ),
            array(
                'type' => 'textarea',
                'name' => 'text',
                'label' => 'Message'
            ),
            array(
                'type' => 'submit'
            )
        );
    }
    private function statuses() {
        $param = $this->defaultparam;
        foreach ($this->helper()->statuses() as $status) {
            if ($status->type == 3 || $status->type == 0) {
                if ($status->$param) {
                    $this->statuses['default'] = $status->id;
                }
                if ($status->id == $this->statusid) {
                    $this->statuses['current'] = $status;
                }
                $this->statuses['list'][$status->id] = $status->descr;
            }
        }
        if (!$this->statuses['list']) {
            throw new Exception('Cannot get statuses. Please contact to manager.');
        }
        if (!$this->statuses['default']) {
            $statuses = array_keys($this->statuses['list']);
            $this->statuses['default'] = $statuses[0];
        }
    }
}

?>
