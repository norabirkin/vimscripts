<?php class Wizard extends CWidget {
	private $finalStep;
	private $params = array();
	private $allparams = array();
	private $step = 1;
	private $title = '';
	private $steps = array();
	private $breadcrumbs = array();
	private $route;
	public function setFinalStep( WizardFinalStep $finalStep ) {
		$this->finalStep = $finalStep;
	}
	public function createForm( $conf ) {
		$form = new LBForm;
		$form->attachEventHandler("onBeforeItemsSet", array( $this, "setHiddenItems" ));
		$form->configure( $conf );
		return $form;
	}
	public function setHiddenItems( CEvent $event ) {
		foreach( $event->params["items"] as $k => $v ) {
			if( $event->params["items"][$k]["name"] )  $event->params["items"][$k]["name"] = "params[" . ($this->step + 1) . "][" . $event->params["items"][$k]["name"] . "]";
		}
		$url = $this->getNextStepUrl();
		$url = yii::app()->controller->createUrl($url["route"], $url["params"]);
		$url = urldecode( $url );
		$url = explode( "?", $url );
		$url = $url[1];
		$url = explode("&", $url);
		foreach( $url as $param ) {
			$param = explode("=", $param);
			$event->params["items"][] = array(
				"type" => "hidden",
				"name" => $param[0],
				"value" => $param[1]
			);
		}
	}
	public function setRoute( $route ) {
		$this->route = (string) $route;
	}
	public function setTitle( $title ) {
		$this->title = (string) $title;
	}
	public function setSteps( $steps ) {
		foreach ($steps as $component) $this->setStepComponent( $component );
	}
	public function setStepComponent( WizardStep $component ) {
        $component->setWizard($this);
		$this->steps[] = $component;
	}
	private function getCurrentStep() {
		return $this->steps[ $this->step - 1 ];
	}
	public function setStep( $step ) {
		$this->step = (int) $step;
	}
	public function setBreadcrumbs( $breadcrumbs ) {
		$this->breadcrumbs = (array) $breadcrumbs;
	}
	private function getStepParams( $step ) {
		$result = array();
		foreach ($this->params as $s => $params) {	
			if ($s > $step) continue;
			$result[$s] = $params;
		}
		return $result;
	}
	public function getStepUrl( $step, $params = array() ) {
		$p = array( "step" => $step );
		$saveParams = $this->getStepParams( $step );
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
		return $current->getDescription();
	}
	private function getStepsCount() {
		return count( $this->steps );
	}
	private function getTitle( $step = null ) {
		if ($step === null) $step = $this->step;
		$stepComponent = $this->steps[ $step - 1 ];
		return $this->title . ': ' . yii::t('wizard', 'Step') . ' ' . $step . '. ' . $stepComponent->getDescription();
	}
	private function getPreviousStepUrl() {
		$prevStep = ($this->step == 1) ? 1 : ($this->step - 1);
		return $this->getStepUrl( $prevStep );
	}
	public function redirectToFirstStepWithErrorMessage( $msg ) {
			yii::app()->user->setFlash( "error", $msg );
			$url = $this->getStepUrl(1);
			yii::app()->controller->redirect( array_merge(array( $url["route"] ), $url["params"]) );
	}
	private function getContent() {
		try {
			$html = $this->getCurrentStep()->output();
		} catch ( Exception $e ) {
			if ($this->step != 1) $this->redirectToFirstStepWithErrorMessage( $e->getMessage() );
			else yii::app()->user->setFlash( "error", $e->getMessage() );
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
	public function getParam( $name ) {
		return $this->allparams[ $name ];
	}
	public function init() {
		$this->setParams();
		if (method_exists( yii::app()->controller, 'setWizard' )) yii::app()->controller->setWizard( $this );
	}
	private function executeFinalStep() {
		try {
			$success = $this->finalStep->execute();
			$this->finalStep->getMessage( $success );
		} catch ( Exception $e ) {
			$this->redirectToFirstStepWithErrorMessage( $e->getMessage() );
		}
		yii::app()->controller->redirect($this->finalStep->getRedirectUrl());
	}
	private function renderContent() {
		yii::app()->controller->breadcrumbs = $this->getBreadcrumbs();
		yii::app()->controller->pageTitle = $this->getTitle();
		return $this->render( 'wizard', array(
			'step' => $this->step,
			'title' => $this->getTitle(),
			'iconCls' => 'image steps step-' . $this->step . '-of-' . $this->getStepsCount(),
			'content' => $this->getContent()
		), true);
	}
	public function run() {
		if( $this->step > $this->getStepsCount() ) $this->executeFinalStep();
		else return $this->renderContent();
	}	

} ?>
