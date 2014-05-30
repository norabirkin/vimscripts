<?php
/**
 * This module includes complete TURBO-button support into application
 */
class TurboModule extends CWebModule
{
    /**
     * Show terms page /client2/protected/modules/turbo/views/turbo/Terms.php
     * @var boolean
     */
    public $turbo;
    
    public $func1;
    
    public $terms = true;

    /**
     * @var string
     */
    public $description = '';

    /**
     * @var string
     */
    public $dealInfo = '';

    /**
     * @var string
     */
    public $agreementInfo = '';

    public $categoryPrefix = '/^turbo_/';

    public $longActionService = false;

    public $allowStopService  = false;

    /**
     * Show grid with current TURBO services on every page
     */
    public $showCurrentTurbo = true;

    // Service minimal duration
    public $minDuration = 1;
    // Service maximum duration
    public $maxDuration = 30;

    public function init()
    {
        $this->defaultController = 'turbo';
        // import the module-level models and components
        $this->setImport(array(
            'turbo.models.*',
            'turbo.components.*',
        ));
    }

    public function beforeControllerAction($controller, $action)
    {
        if(parent::beforeControllerAction($controller, $action))
        {
            return true;
        }
        else
            return false;
    }

	/**
     * Translate a message
     *
	 * @param string $message Message to be translated
	 * @param array $params Params for translation
	 * @return string
	 */
	public static function t( $message = '', $params=array()) {
		return Yii::t("TurboModule", $message, $params);
	}

    /**
     * Logs a message.
     *
     * @param string $message Message to be logged
     * @param string $level Level of the message (e.g. 'trace', 'warning',
     * 'error', 'info', see CLogger constants definitions)
     */
    public static function log($message, $level='error')
    {
        Yii::log($message, $level, __CLASS__);
    }

}
