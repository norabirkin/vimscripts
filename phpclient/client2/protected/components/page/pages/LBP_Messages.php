<?php

class LBP_Messages extends LBPage {
    protected function getRoute() {
        return 'messages/index';
    }
    protected function getTitle() {
        return 'Messages';
    }
    protected function getLocalizationFile() {
        return 'messages';
    }
}

?>
