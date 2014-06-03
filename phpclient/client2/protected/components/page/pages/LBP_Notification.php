<?php

class LBP_Notification extends LBPage {
    protected function getRoute() {
        return 'notification/index';
    }
    protected function getTitle() {
        return 'Notification';
    }
    protected function getLocalizationFile() {
        return 'notification';
    }
}

?>
