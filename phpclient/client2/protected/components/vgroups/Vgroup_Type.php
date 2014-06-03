<?php

class Vgroup_Type {
    private static $instance;
    public static function check($vgroup, $type) {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance->__check($vgroup, $type);
    }
    public function __check($vgroup, $type) {
        return $this->tariffChecker($type)->check($vgroup->vgroup->tariftype, $vgroup);
    }
    private function tariffChecker($type) {
        yii::import('application.components.tariff.Tariff_Type');
        yii::import('application.components.internet.Internet_Tariff_Type');
        yii::import('application.components.phone.Phone_Tariff_Type');
        yii::import('application.components.services.Services_Tariff_Type');
        yii::import('application.components.dtv.DTV_Vgroup_Type');
        $checkers = array(
            'internet' => new Internet_Tariff_Type,
            'telephony' => new Phone_Tariff_Type,
            'services' => new Services_Tariff_Type,
            'tv' => new DTV_Vgroup_Type
        );
        return $checkers[$type];
    }
}

?>
