<?php

class LBWizard {
    private $action;
    private $count;
    private $formArray = array();
    private $executingFinal = false;
    private $subtitle;
    private $finalStep;
    private $params = array();
    private $allparams = array();
    private $step = 1;
    private $title = '';
    private $steps = array();
    private $breadcrumbs = array();
    private $route;
    private $style = 'default';
    private $helper;
    private $validate = array();
    public function __construct($params = array()) {
        $this->initPageProperties();
        $this->count = (int) $params['count'];
        $this->setStep(yii::app()->request->getParam('step', 1));
        $this->setSteps($params['steps']);
        $this->setParams();
        if ($params['helper']) {
            $this->setHelper($params['helper']);
        }
        $this->setStyle($params['style']);
        if ($params['final']) {
            $this->setFinalStep($params['final']);
        }
        if ($params['validate']) {
            $this->validate = $params['validate'];
        }
    }
    public function setAction(LBWizardAction $action) {
        $this->action = $action;
    }
    public function action() {
        return $this->action;
    }
    public function isStepStyled() {
        return $this->style == 'steps';
    }
    public function subtitle() {
        $this->subtitle = $this->getStepDescription();
    }
    public function setHelper(LBWizardItem $helper) {
        $helper->setWizard($this);
        $this->helper = $helper;
    }
    public function helper() {
        return $this->helper;
    }
    private function setStyle($value) {
        if ($value == 'steps') {
            $this->style = $value;
        }
    }
    private function initPageProperties() {
        if (!$page = yii::app()->controller->getPage()) {
            return;
        }
        $breadcrumbs = $page->breadcrumbs();
        unset($breadcrumbs[end(array_keys($breadcrumbs))]);
        $this->setBreadcrumbs($breadcrumbs);
        $this->setRoute($page->route());
        $this->setTitle($page->title());
    }
    public function fin( $finalStep ) {
        $this->setFinalStep($finalStep);
    }
    public function setFinalStep( LBWizardFinalStep $finalStep ) {
        $finalStep->setWizard($this);
        $this->finalStep = $finalStep;
    }
    public function createForm( $conf, $next = true ) {
        yii::import('application.components.form.*');
        $form = new LB_Form;
        $form->setBeforeItemAddHandler(array($this, $next ? 'beforeFormItemForNextStepRender' : 'beforeFormItemForCurrentStepRender'));
        $form->setBeforeRenderHandler(array($this, $next ? 'beforeFormForNextStepRender' : 'beforeFormForCurrentStepRender'));
        $form->addItems($conf);
        return $form;
    }
    public function beforeFormItemForNextStepRender($item, $form) {
        $this->beforeFormItemRender($item, $form, ($this->step + 1));
        return true;
    }
    public function beforeFormItemForCurrentStepRender($item, $form) {
        $this->beforeFormItemRender($item, $form, $this->step);
        return true;
    }
    public function beforeFormForNextStepRender($items, $form) {
        $this->beforeFormRender($items, $form, ($this->step + 1));
    }
    public function beforeFormForCurrentStepRender($items, $form) {
        $this->beforeFormRender($items, $form, $this->step);
    }
    private function getFormArray($step) {
        if (!$this->formArray[$step]) {
            $array1 = new LB_Form_Item_Array(array('name' => 'params'));
            $array2 = new LB_Form_Item_Array(array('name' => $step));
            $array2->setParent($array1);
            $this->formArray[$step] = $array2;
        }
        return $this->formArray[$step];
    }
    public function beforeFormItemRender($item, $form, $step) {
        if (!$item->getParent()) {
            $item->setParent($this->getFormArray($step));
        }
    }
    public function beforeFormRender($items, $form, $step) {
        $form->setBeforeItemAddHandler(array($this, 'beforeHiddenFieldAdd'));
        $url = $this->getStepUrl($step);
        $isPost = strtolower($form->getMethod()) == 'post';
        $form->hidden(
            array_merge(
                $url['params'],
                (
                    $isPost ?
                    array() :
                    array(
                        'r' => $url['route']
                    )
                )
            )
        );
        if ($isPost) {
            $form->action(yii::app()->controller->createUrl($url['route']));
        }
        $form->setBeforeItemAddHandler(null);
    }
    public function beforeHiddenFieldAdd($item, $form) {
        return !$form->hasField($item->get('name'));
    }
    public function afterCreatingItem( CEvent $event, $step ) {
        $event->params["item"]->modifyName('modifyName', $this, $step);
    }
    public function afterCreatingItemForNextStep( CEvent $event ) {
        $this->afterCreatingItem( $event, $this->step + 1 );
    }
    public function afterCreatingItemForCurrentStep( CEvent $event ) {
        $this->afterCreatingItem( $event, $this->step );
    }
    public function modifyName($name, &$step) {
        return "params[" . $step . "][" . $name . "]";
    }
    public function setHiddenItems( $form, $step ) {
        $url = $this->getStepUrl($step);
        $url = yii::app()->controller->createUrl($url["route"], $url["params"]);
        $url = urldecode( $url );
        $url = explode( "?", $url );
        $url = $url[1];
        $url = explode("&", $url);
        $config = array();
        foreach( $url as $param ) {
            $param = explode("=", $param);
            if (!$form->hasField($param[0])) {
                $config[] = array(
                    "type" => "hidden",
                    "name" => $param[0],
                    "value" => $param[1]
                );
            }
        }
        $form->setItems($config);
    }
    public function setRoute( $route ) {
        $this->route = (string) $route;
    }
    public function setTitle( $title ) {
        $this->title = (string) $title;
    }
    public function setSteps( $steps = array() ) {
        foreach ($steps as $component) $this->setStepComponent( $component );
    }
    public function add( $component ) {
        $this->setStepComponent($component);
    }
    public function setStepComponent( LBWizardStep $component ) {
        $component->setWizard($this);
        $this->steps[] = $component;
    }
    public function getPreviousStep() {
        if (isset($this->steps[$this->step - 2])) {
            return $this->steps[$this->step - 2];
        } else {
            throw new Exception('It is the first step');
        }
    }
    public function getCurrentStep() {
        return $this->steps[ $this->step - 1 ];
    }
    public function setStep( $step ) {
        $this->step = (int) $step;
    }
    public function setBreadcrumbs( $breadcrumbs ) {
        $this->breadcrumbs = (array) $breadcrumbs;
    }
    private function getStepParams( $step, $skip = array() ) {
        $result = array();
        foreach ($this->params as $s => $params) {  
            if ($s > $step) continue;
            if ($skip) {
                foreach ($params as $k => $v) {
                    foreach ($skip as $item) {
                        if ($k == $item) {
                            unset($params[$k]);
                        }
                    }
                }
            }
            if ($params) {
                $result[$s] = $params;
            }
        }
        return $result;
    }
    public function getStep() {
        return $this->step;
    }
    public function lcurr($text, $params = array(), $options = array()) {
        return $this->getStepLink($text, $params, false, $options);
    }
    public function curl($params = array()) {
        $url = $this->getCurrentStepUrl($params);
        return yii::app()->createUrl($url['route'], $url['params']);
    }
    public function getCurrentStepUrl($params = array()) {
        return $this->getStepUrl($this->step, $params);
    }
    public function getStepUrl( $step, $params = array(), $skip = array() ) {
        $step = (string) $step;
        $p = array( "step" => $step );
        $saveParams = $this->getStepParams( $step, $skip );
        if ($params) $currentParams = array($step => $params);
        else $currentParams = array();
        $allParams = CMap::mergeArray( $saveParams, $currentParams );
        if( $allParams ) $params = array( "params" => $allParams );
        $p = CMap::mergeArray( $p, $params );
        return array(
            "route" => $this->route,
            "params" => $p
        );
    }
    public function getStepLink($text, $params = array(), $next = true, $options = array()) {
        $url = $this->getStepUrl($this->step + ($next ? 1 : 0), $params);
        return CHtml::link(
            yii::t('main', $text),
            array_merge(array( $url["route"] ), $url["params"]),
            $options
        );
    }
    public function getNextStepUrl( $params = array() ) {
        $result = $this->getStepUrl( ($this->step + 1), $params );
        return $result;
    }
    private function getBreadcrumbs() {
        $breadcrumbs = $this->breadcrumbs;
        for( $i = 1; $i <= $this->step; $i++ ) {
            if( $i == $this->step ) $breadcrumbs[] = $this->getTitle( $i );
            else {
                $url = $this->getStepUrl( $i );
                $breadcrumbs[ $this->getTitle( $i ) ] = array_merge( array($url["route"]), $url["params"] );
            }
        }
        return $breadcrumbs;
    }
    private function getStepDescription() {
        $current = $this->getCurrentStep();
        return yii::t('main', $current->title());
    }
    private function getStepsCount() {
        if ($this->count) {
            return $this->count;
        }
        return count( $this->steps );
    }
    private function getTitle( $step = null ) {
        if ($step === null) $step = $this->step;
        $stepComponent = $this->steps[ $step - 1 ];
        if ($this->style == 'steps') {
            return $this->title . ': ' . yii::t('wizard', 'Step') . ' ' . $step . '. ' . yii::t('main', $stepComponent->title());
        } else {
            return (($step == 1) ? $this->title : yii::t('main', $stepComponent->title()));
        }
    }
    private function getPreviousStepUrl() {
        $prevStep = ($this->step == 1) ? 1 : ($this->step - 1);
        return $this->getStepUrl( $prevStep );
    }
    public function redirectToFirstStepWithErrorMessage( $msg ) {
            yii::app()->user->setFlash( "error", yii::t('main',$msg) );
            $url = $this->getStepUrl(1);
            yii::app()->controller->redirect( array_merge(array( $url["route"] ), $url["params"]) );
    }
    private function getContent() {
        try {
            $this->beforeRun();
            $html = $this->getCurrentStep()->output();
        } catch ( Exception $e ) {
            if ($this->step != 1) $this->redirectToFirstStepWithErrorMessage( $e->getMessage() );
            else yii::app()->user->setFlash( "error", yii::t('main',$e->getMessage()) );
        }
        return $html;
    }
    private function setParams() {
        if (!$_REQUEST["params"]) return;
        $this->params = $_REQUEST["params"];
        foreach( $this->params as $step ) {
            foreach( $step as $k => $v ) $this->allparams[$k] = $v;
        }
    }
    public function setParam($name, $value) {
        $this->params[$this->step][$name] = $value;
        $this->allparams[$name] = $value;
    }
    public function param($name) {
        return $this->getParam($name);
    }
    public function getParam( $name ) {
        return $this->allparams[ $name ];
    }
    public function logParams() {
        Dumper::log($this->params);
    }
    private function validate() {
        foreach ($this->validate as $k => $v) {
            if (!is_string($k)) {
                throw new Exception('Invalid validator 1');
            }
            if ($this->param($k)) {
                $object = $v[0];
                if (!is_object($object)) {
                    throw new Exception('Invalid validator 2');
                }
                $method = $v[1];
                if (!is_string($method) OR !method_exists($object, $method)) {
                    throw new Exception('Invalid validator 3');
                }
                $object->$method();
            }
        }
        return;
    }
    private function beforeRun() {
        $this->validate();
    }
    public function executingFinal() {
        return $this->executingFinal;
    }
    private function executeFinalStep() {
        $this->executingFinal = true;
        try {
            $this->beforeRun();
            $success = $this->finalStep->execute();
            $this->finalStep->getMessage( $success );
        } catch ( Exception $e ) {
            $this->redirectToFirstStepWithErrorMessage( $e->getMessage() );
        }
        yii::app()->controller->redirect($this->finalStep->getRedirectUrl());
    }
    private function render($params) {
        return yii::app()->controller->renderPartial('application.components.wizard.views.wizard', $params, true);
    }
    private function beforeRender() {
        $this->getCurrentStep()->init();
        if ($this->helper) {
            $this->helper->init();
        }
    }
    private function renderContent() {
        $this->beforeRender();
        yii::app()->controller->breadcrumbs = $this->getBreadcrumbs();
        yii::app()->controller->pageTitle = $this->getTitle();
        return $this->render(array(
            'step' => $this->step,
            'title' => $this->style == 'steps' ? $this->getTitle() : $this->title,
            'subtitle' => $this->subtitle,
            'iconCls' => ($this->style == 'steps' ? ('image steps step-' . $this->step . '-of-' . $this->getStepsCount()) : ''),
            'content' => $this->getContent()
        ));
    }
    public function run() {
        if ($this->step > $this->getStepsCount()){
            $this->executeFinalStep();
        }
        else {
            return $this->renderContent();
        }
    }   
}

?>
