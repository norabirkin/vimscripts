<?php class LBRegister_Scripts {
    public function run() {
        $this->core('jquery');
        $this->js('../bootstrap-sass-3.2.0/lb-register/javascripts/bootstrap.js');
        $this->css('../bootstrap-sass-3.2.0/lb-register/stylesheets/styles.css');
    }
    public function publish($path) {
        yii::app()->assetManager->publish($path);
        return yii::app()->assetManager->getPublishedUrl($path);
    }
    public function js($path) {
        yii::app()->clientScript->registerScriptFile($this->publish($path));
    }
    public function css($path) {
        yii::app()->clientScript->registerCssFile($this->publish($path));
    }
    public function core($url) {
        yii::app()->clientScript->registerCoreScript($url);
    }
} ?>
