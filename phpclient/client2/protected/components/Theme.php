<?php class Theme {
    private $viewsDirectory = 'views';
    protected $antivirusModuleParams = array (
    	'title'=> 'Antivirus',
        'subscription' => 'Active antivirus services',
    	'license' => "License"
    );
    protected function import($path) {
        yii::import($this->getPath().'.'.$path);
    }
    public function getPath() {
        return 'webroot.themes.'.yii::app()->getTheme()->getName();
    }
    public function getViewPath($view) {
        return $this->getPath().'.'.$this->viewsDirectory.'.'.$view;
    }
    protected function render($tpl, $params = array()) {
        $tpl = $this->getViewPath($tpl);
        return yii::app()->controller->renderPartial($tpl, $params, true);
    }
    protected function breadcrumbs($cls) {
        return yii::app()->controller->widget('zii.widgets.CBreadcrumbs', array(
            'links' => yii::app()->controller->breadcrumbs,
            'separator'=>'<span class="divider">/</span>',
            'homeLink' => CHtml::link(yii::t('main','HomePage'), Yii::app()->homeUrl),
            'htmlOptions' => array(
                'class' => $cls
            )
        ),true);
    }
    public function BeforeContent($params) {
        return '';
    }
    public function BeforeUserMenu($params) {
        return '';
    }
    public function ContentBegining($params) {
        return '';
    }
    public function BeforeLoginBlock($params) {
        return '';
    }
    public function getClientScriptRegistration() {
        return null;
    }
    public function PageHeader($params) {
        return '';
    }
    public function GetLoginFormTemplate() {
        return $this->getViewPath('Login');
    }
    public function getServiceFunctionWidgets() {
        return new ServiceFunctionWidgets;
    }
    public function getAntivirusModuleParams() {
    	return $this->antivirusModuleParams;
    }
} ?>
