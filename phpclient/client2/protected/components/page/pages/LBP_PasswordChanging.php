<?php

class LBP_PasswordChanging extends LBPage {
    protected function getRoute() {
        return 'passwordChanging/index';
    }
    protected function getTitle() {
        return 'Password changing';
    }
    protected function getLocalizationFile() {
        return 'password_changing';
    }
}

?>
