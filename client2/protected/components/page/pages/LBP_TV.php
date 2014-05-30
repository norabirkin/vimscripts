<?php

class LBP_TV extends LBPage {
    protected function getRoute() {
        return 'tv/index';
    }
    protected function getTitle() {
        return 'Home TV';
    }
    protected function getLocalizationFile() {
        return 'tv';
    }
}

?>
