<?php

class Internet_MAC_Helper extends LBWizardItem {
    private $macs;
    private $mac;
    public function macs() {
        if ($this->macs === null) {
            $this->macs = $this->a('getMacStaff', array(
                'flt' => array(
                    'vgid' => $this->param('vgid')
                )
            ));
        }
        return $this->macs;
    }
    public function mac() {
        if ($this->mac === null) {
            foreach ($this->macs() as $mac) {
                if ($mac->macid == $this->param('macid')) {
                    $this->mac = $mac;
                    break;
                }
            }
            if (!$this->mac) {
                throw new Exception('MAC-address is not found');
            }
        }
        return $this->mac;
    }
}

?>
