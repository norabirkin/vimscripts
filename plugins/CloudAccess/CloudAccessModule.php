<?php class CloudAccessModule extends CWebModule {
    public function t($str, $params = array()) {
        return yii::t('CloudAccessModule.main', $str, $params);
    }
} ?>
