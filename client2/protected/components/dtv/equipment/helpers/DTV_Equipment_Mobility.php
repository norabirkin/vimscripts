<?php

class DTV_Equipment_Mobility extends LBWizardItem {
    private $allowJoin = array();
    private $mobility = array();
    public function __construct(LBWizard $wizard) {
        $this->setWizard($wizard);
    }
    public function allowJoin($cardid) {
        if (!$this->allowJoin[$cardid]) {
            try {
                $mobility = $this->mobility($cardid);
            } catch ( Exception $e ) {
                $mobility = (int) Yii::app()->lanbilling->getOption('usbox_eqip_min');
            }
            if ( $mobility === true ) {
                $this->allowJoin[$cardid] = true;
            } else {
                $this->allowJoin[$cardid] = ($this->count($cardid) < $mobility);
            }
        }
        return $this->allowJoin[$cardid];
    }
    public function count($cardid) {
        if (!$smartcard = $this->wizard()->helper()->eq()->smartcard($cardid)) {
            throw new Exception('No smartcard');
        }
        return count($smartcard->equipment);
    }
    protected function mobility( $cardid ) {
        if (($result = $this->ifNotAllSmartCardOptionsAreSet()) !== null) {
            return $result;
        }
        if ($this->isMobililtyServiceAssigned($cardid)) {
            return (int) $this->option("smartcard_eqip_max");
        } else {
            return (int) $this->option('usbox_eqip_min');
        }
    }
    protected function ifNotAllSmartCardOptionsAreSet() {
        if (
            !$this->option("usbox_eqip_min")
            AND
            !$this->option("smartcard_eqip_max")
        ) {
            return true;
        }
        if (!$this->option("smartcard_usbox_tag")) {
            if ($this->option("usbox_eqip_min")) {
                $this->flash('error', 'Unable to link equipment. Please contact manager');
                return 0;
            }
            return (int) $this->option("smartcard_eqip_max");
        }
        return null;
    }
    protected function isMobililtyServiceAssigned($cardid) {
        if (!isset($this->mobility[$cardid])) {
            $this->mobility[$cardid] = (
                $this->usbox(array(
                    'vgid' => $this->wizard()->helper()->eq()->smartcard($cardid)->smartcard->vgid,
                    'uuid' => $this->option('smartcard_usbox_tag')
                ))
                ->categories()
                ->active()
                ->first() !== null
            );
        }
        return $this->mobility[$cardid];
    }
}

?>
