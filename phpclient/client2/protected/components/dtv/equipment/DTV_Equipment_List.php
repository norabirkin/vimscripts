<?php

class DTV_Equipment_List extends LBWizardStep {
    public function output() {
        if (
            $html =
            $this->helper()->eq()->binded('vgroup')->output() .
            $this->helper()->eq()->binded('smartcard')->output()
        ) {
            return $html;
        } else {
            return $this->t('Nothing found');
        }
    }
    public function title() {
        return 'Equipment list';
    }
}

?>
