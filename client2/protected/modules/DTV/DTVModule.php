<?php
/**
 * This module includes complete Digital TV support into application
 */
class DTVModule extends CWebModule
{
    /**
     * @var array
     * @desc TV packages, which will be excluded from la carte list
     */
    public $packages;

    /**
     * @var int
     * @desc Smart card mobility option
     */
    public $mobility;

    public function init()
    {
        // import the module-level models and components
        $this->setImport(array(
            'DTV.models.*',
            'DTV.components.*',
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
		return Yii::t("DTVModule", $message, $params);
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
