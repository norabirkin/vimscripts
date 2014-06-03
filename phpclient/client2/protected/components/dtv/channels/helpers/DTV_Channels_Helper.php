<?php

class DTV_Channels_Helper extends LBWizardItem {
    private $dtvVgroups;
    private $data;
    private $eq;
    public function setWizard(LBWizard $wizard) {
        parent::setWizard($wizard);
        $this->eq = new DTV_Equipment_Helper($wizard);
    }
    public function init() {
        $this->eq->init();
    }
    public function isDtvVgroup($vgroup) {
        return $this->eq()->vgroupBindedToEquipment($vgroup->vgroup->vgid);
    }
    public function eq() {
        return $this->eq;
    }
    public function vgroups() {
        $result = array();
        foreach(parent::vgroups() as $vgroup) {
            if (!$this->isDtvVgroup($vgroup)) {
                continue;
            }
            $result[] = $vgroup;
        }
        return $result;
    }
    public function smartcard($vgid = 0) {
        foreach ($this->eq()->smartcards() as $smartcard) {
            if ($smartcard->smartcard->vgid == $vgid) {
                return $smartcard;
            }
        }
        return null;
    }
    public function personal($type = null) {
        if (!$this->data) {
            $this->data = array(
                'stop' => array(),
                'assign' => array(),
                'all' => array()
            );
            foreach ($this->usbox(array(
                'vgid' => $this->param('vgid'),
                'dtvtype' => 2,
                'periodic' => true
            ))
            ->categories()
            ->all() as $service) {
                if ($service->state != 'scheduled') {
                    if ($service->available OR $service->state == 'active') {
                        $this->data['all'][] = $service;
                    }
                }
                if ($this->stop($service)) {
                    $this->data['stop'][] = $service;
                }
                if ($this->assign($service)) {
                    $this->data['assign'][] = $service;
                }
            }
        }
        if (!$type) {
            return $this->data['all'];
        } else {
            return $this->data[$type];
        }
    }
    private function stop($service) {
        return $service->state == 'active' AND !in_array($service->service->servid, $this->idx('servid'));
    }
    private function assign($service) {
        return $service->state == 'idle' AND in_array($service->catidx, $this->idx('catidx'));
    }
    private function idx($param) {
        $param = $this->param($param, array());
        if (!is_array($param)) {
            $param = array();
        }
        return array_keys($param);
    }
}

?>
