<?php

class Antivirus_Helper extends LBWizardItem {
    private $usbox = array();
    public function categories($vgid = null) {
        if (!$vgid) {
            $vgid = $this->param('vgid');
        }
        $result = array();
        foreach ($this->usbox($vgid)->categories()->all(false) as $k => $v) {
            if ($this->isAntivirus($v)) {
                $result[$k] = $v;
            }
        }
        return $result;
    }
    public function isActive($service) {
        return strtotime($service->service->activated) <= time();
    }
    public function active() {
        $result = array();
        foreach ($this->usbox($this->param('vgid'))->active() as $k => $v) {
            if ($this->isAntivirus($v)) {
                $result[$k] = $v;
            }
        }
        return $result;
    }
    public function isAntivirus($service) {
        return strpos($service->uuid, $this->prefix()) === 0;
    }
    public function usbox($vgid) {
        if (!$this->usbox[$vgid]) {
            $this->usbox[$vgid] = parent::usbox(array(
                'vgid' => $vgid,
                'common' => 1,
                'unavail' => 0,
                'dtvtype' => 0
            ));
        }
        return $this->usbox[$vgid];
    }
    private function prefix() {
        if (yii::app()->params['antivirusCategoryPrefix']) {
            return yii::app()->params['antivirusCategoryPrefix'];
        } else {
            return 'Antivirus#';
        }
    }
}

?>
