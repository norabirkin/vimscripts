<?php

class SiteController extends Controller {
    
    /**
     * Layout variable. Initialize in actionIndex
     * Localize url path to use in script tag to load data
     * @var String
     */
    public $localizeUrl = null;
    
    /**
     * Layout variable. Initialize in actionIndex
     * Licese url path to use in script tag to load data
     * @var String
     */
    public $licenseUrl = null;
    
    /**
     * Layout variable. Initialize in actionIndex
     * Front-end url path to use in script tag to load data
     * @var String
     */
    public $bootStrap = null;
    
    
    
    /**
     * Default action to show HTML code with front-end links
     * 
     */
    public function actionIndex()
    {
        $bootstrap = NULL;
        
        if(YII_DEVELOP === true) {
            $file = (
                Yii::app()->basePath.
                DIRECTORY_SEPARATOR.
                'public'.
                DIRECTORY_SEPARATOR.
                'index.html'
            );
            if(file_exists($file)) {
                $this->bootStrap = file_get_contents($file);
            }
        }
        
        $this->localizeUrl = Yii::app()->controller->createUrl('api/language/localize');
        $this->licenseUrl = Yii::app()->controller->createUrl('api/license/strict');
        
        $this->sendResponse(200, array(
            "message" => Yii::t("messages", "Loading")
        ));
    }
    
    
    /**
     * This is default function to 
     * @param $status Integer Code status
     * @param $params Array   Params to apply to view
     */
    public function sendResponse($status = 200, $params = array()) {
        if($status == 200) {
            $this->render('index', $params);
        }
        else {
            $this->render('error', $params);
        }
    }
    
    
    /**
     * Show error message according to the DEBUG mode
     * 
     */
    public function showError() {
        if (YII_DEBUG == true) {
            $this->setErrorRize(false);
        }
        else {
            $this->sendResponse($error['code'], array_replace_recursive(
                array(
                    "t" => array(
                        "code" => Yii::t("messages", "Error code")
                    ),
                    "code" => 500,
                    "message" => ""
                ),
                $this->getError()
            ));
        }
    }
    
    
    /**
     * Build page title
     * 
     */
    public function getPageTitle() {
        $build = defined('APP_BUILD') ? " (" . APP_BUILD . ") " : "";
        
        if(empty($build) && YII_DEVELOP === true) {
            $build = " (DEV) ";
        }
        
        return Yii::app()->name . $build;
    }
}

?>
