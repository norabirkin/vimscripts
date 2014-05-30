<?php

class DTV_Equipment_Helper extends LBWizardItem {
    private $smartcards = array();
    private $equipment = array();
    private $vgroups = array();
    private $idle = array();
    private $binded = array();
    private $grid = array();
    public function __construct(LBWizard $wizard) {
        $this->setWizard($wizard);
    }
    public function init() {
        $this->setSmartcards();
        $this->setEquipment();
        $this->grid['vgroup'] = new DTV_Equipment_BindedTo_Vgroup($this->wizard());
        $this->grid['smartcard'] = new DTV_Equipment_BindedTo_Smartcard($this->wizard());
        $this->grid['none'] = new DTV_Equipment_NotBinded($this->wizard());
    }
    private function setSmartcards() {
        foreach ($this->a('getSmartCards') as $smartcard) {
            $this->smartcards[$smartcard->smartcard->cardid] = $smartcard;
        }
    }
    private function setEquipment() {
        foreach($this->a('getEquipment') as $equipment) {
            $this->equipment[$equipment->equipment->equipid] = $equipment;
            if ($equipment->vgid) {
                $this->setBindedEquipment($equipment);
            } else {
                $this->setIdle($equipment);
            }
        }
    }
    private function setBindedEquipment($equipment) {
        try {
            if (!$this->vgroup($equipment->vgid)->vgroup->usecas) {
                return;
            }
        } catch(Exception $e) {
            return;
        }
        if ($equipment->equipment->cardid) {
            $this->setEquipmentBindedToSmartcard($equipment);
        } else {
            $this->setEquipmentBindedToVgroup($equipment);
        }
    }
    public function vgroupBindedToEquipment($vgid) {
        return (bool) $this->binded[$vgid];
    }
    private function setBindedEquipmentVgroup($equipment) {
        if (!isset($this->binded[$equipment->vgid])) {
            $this->binded[$equipment->vgid] = array();
        }
        $this->binded[$equipment->vgid][$equipment->equipment->equipid] = $equipment;
    }
    private function setIdle($equipment) {
        if (!isset($this->idle[$equipment->equipment->agrmid])) {
            $this->idle[$equipment->equipment->agrmid] = array();
        }
        $this->idle[$equipment->equipment->agrmid][$equipment->equipment->equipid] = $equipment;
        $this->equipment[$equipment->equipment->equipid]->idle = true;
    }
    private function setEquipmentBindedToVgroup($equipment) {
        try {
            if ($this->vgroup($equipment->vgid)->vgroup->usesmartcards) {
                return;
            }
        } catch(Exception $e) {
            return;
        }
        $this->setBindedEquipmentVgroup($equipment);
        if (!isset($this->vgroups[$equipment->vgid])) {
            try {
                $this->vgroups[$equipment->vgid] = $this->vgroup($equipment->vgid);
            } catch(Exception $e) {
            }
        }
        if ($this->vgroups[$equipment->vgid]->equipment === null) {
            $this->vgroups[$equipment->vgid]->equipment = array();
        }
        $this->vgroups[$equipment->vgid]->equipment[$equipment->equipment->equipid] = $equipment;
        $this->equipment[$equipment->equipment->equipid]->vgroup = $this->vgroups[$equipment->vgid];
    }
    private function setEquipmentBindedToSmartcard($equipment) {
        try {
            if (!$this->vgroup($equipment->vgid)->vgroup->usesmartcards) {
                return;
            }
        } catch(Exception $e) {
        }
        $this->setBindedEquipmentVgroup($equipment);
        if ($this->smartcards[$equipment->equipment->cardid]->equipment === null) {
            $this->smartcards[$equipment->equipment->cardid]->equipment = array();
        }
        $this->smartcards[$equipment->equipment->cardid]->equipment[$equipment->equipment->equipid] = $equipment;
        $this->equipment[$equipment->equipment->equipid]->smartcard = $this->smartcards[$equipment->equipment->cardid];
    }
    public function smartcards() {
        return $this->smartcards;
    }
    public function smartcard($cardid = null) {
        if ($cardid === null) {
            $cardid = $this->param('cardid');
        }
        if (!$cardid) {
            throw new Exception('No cardid');
        }
        return $this->smartcards[(int) $cardid];
    }
    public function vgroups() {
        return $this->vgroups;
    }
    public function equipment($equipid) {
        return $this->equipment[$equipid];
    }
    public function binded($type) {
        if ($this->grid[$type]) {
            return $this->grid[$type];
        } else {
            throw new Exception('Invalid type');
        }
    }
    public function idle($agrmid) {
        $agreement = $this->idle[$agrmid];
        return $agreements ? array() : $this->idle[$agrmid];
    }
}

?>
