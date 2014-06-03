<?php

class Block_Vgroups extends Vgroups_Grid_Base {
    public function row($row) {
        if (!$this->show($row)) {
            return null;
        }
        return array(
            'agentdescr' => $this->serviceType($row),
            'login' => $row->vgroup->login,
            'tarifdescr' => $row->vgroup->tarifdescr,
            'state' => $this->t($this->state($row)),
            'actions' => $this->action($row)
        );
    }
    private function serviceType($row) {
        if (Vgroup_Type::check($row, 'internet')) {
            return $this->t('Internet');
        } elseif (Vgroup_Type::check($row, 'telephony')) {
            return $this->t('Telephony');
        } elseif (Vgroup_Type::check($row, 'services')) {
            return $this->t('Other services');
        } elseif (Vgroup_Type::check($row, 'tv')) {
            return $this->t('Home TV');
        }
    }
    private function state($vgroup) {
        switch ($vgroup->vgroup->blocked) {
            case Block_Helper::ACTIVE:
                return $this->helper()->hasStateChangingScheduledByClient($vgroup) ? 'Locking is scheduled' : Block_Helper::stateDescription($vgroup->vgroup->blocked);
                break;
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return $this->helper()->hasStateChangingScheduledByClient($vgroup) ? 'Unlocking is scheduled' : Block_Helper::stateDescription($vgroup->vgroup->blocked);
                break;
            default:
                return Block_Helper::stateDescription($vgroup->vgroup->blocked);
                break;
        }

    }
    private function action($vgroup) {
        if ($this->helper()->hasStateChangingScheduledByClient($vgroup)) {
            return $this->lnext($this->helper()->cancelChangeStateText($vgroup), array(
                'vgid' => $vgroup->vgroup->vgid,
                'cancel' => 1
            ));
        } elseif ($vgroup->vgroup->blocked == Block_Helper::ACTIVE) { 
            return $this->lnext('Lock', array( 
                'vgid' => $vgroup->vgroup->vgid,  
                'blkreq' => Block_Helper::SWITCHED_OFF_BY_USER
            ));
        } elseif ($vgroup->vgroup->blocked == Block_Helper::SWITCHED_OFF_BY_USER) {
            return $this->lnext('Unlock', array( 
                'vgid' => $vgroup->vgroup->vgid,  
                'blkreq' => Block_Helper::ACTIVE
            ));
        }
    }
    protected function columns() {
        return array(
            'agentdescr' => 'Service',
            'login' => 'Account',
            'tarifdescr' => 'Tariff plan',
            'state' => 'State',
            'actions' => 'Actions'
        );
    }
    protected function show($row) {
        return $this->helper()->canChangeState($row);
    }
}

?>
