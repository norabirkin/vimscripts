<?php

class Tariff_Helper extends LBWizardItem {
    public function byUser($item) {
        return $item->requestby == 'null';
    }
    public function requestby($item) {
        return $this->t($this->byUser($item) ? 'By user' : 'By manager');
    }
}

?>
