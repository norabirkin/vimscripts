<?php class ClientScriptRegistration {
    private static $scripts = array();
    public static function addScript( $script ) {
        if (in_array($script, self::$scripts)) {
            return;
        }
        self::$scripts[] = $script;
    }
	public function RegisterScripts() {
		Yii::app()->clientScript->registerCoreScript('jquery');
		Yii::app()->clientScript->registerCoreScript('jquery.ui');
		Yii::app()->clientScript->registerScriptFile(Yii::app()->theme->baseUrl.'/js/jquery.fancybox.pack.js',CClientScript::POS_END);
        foreach ( self::$scripts as $script ) Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/' . $script . '.js');
		Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/payment.js');
    	Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/common.css');
        /*
    	Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/controls.css');
		Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/lanbilling.css');
		Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/jquery-ui-1.8.16.custom.css'); // red skin
		Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/jquery.fancybox.css');
		Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/grid.css');
        */
	}
	public static function run() {
        $clientScriptRegistration = MainTemplateHelper::getInstance()->GetTheme()->getClientScriptRegistration();
        if (!$clientScriptRegistration) {
            $clientScriptRegistration = new self;
        }
		$clientScriptRegistration->RegisterScripts();
	}
} ?>
