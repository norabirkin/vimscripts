<?php

class Profile_PhoneMask {
    public static function script() {
        if (yii::app()->params['editing_client_info']['phoneMask']) {
            ClientScriptRegistration::addScript('jquery.inputmask-2.x/js/jquery.inputmask');
            return '$("{id}").inputmask({'.
                        'mask: "'.yii::app()->params['editing_client_info']['phoneMask'].'"'.
                   '});';
        } else {
            ClientScriptRegistration::addScript('maskRe');
            return 'new MaskRe("{id}", MaskRe.INTEGER);';
        }
    }
}

?>
