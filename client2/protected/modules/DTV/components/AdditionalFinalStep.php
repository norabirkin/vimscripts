<?php class AdditionalFinalStep  extends WizardFinalStep {
	private $vg;
	private $main;
	public function getRedirectUrl() {
		$url = yii::app()->controller->getwizard()->getstepurl(1);
		return yii::app()->controller->createurl( $url["route"], $url["params"] );
	}
	private function assignService() {
		$vgid = yii::app()->controller->getWizard()->getParam("vgid");
		$catidx = yii::app()->controller->getWizard()->getParam("catidx");
		$vg = $this->getVG();
		$struct = array(
         		"servid"    =>  0,
            		"vgid"      =>  (int) $vgid,
            		"tarid"     =>  $vg->vgroup->tarifid,
            		"catidx"    =>  $catidx,
            		"mul"       =>  1,
            		'common' => 1,
            		"timefrom"  =>  yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d 00:00:00'),
            		'rate' => 1,
		);
		$success = yii::app()->controller->lanbilling->save( "insupdClientUsboxService", $struct , true );
		return $success;
	}
	private function stopService() {
		$servid = yii::app()->controller->getWizard()->getParam("servid");
		if (!$servid) throw new Exception(yii::t("DTVModule.additional", "CategoryNotFound"));
		$struct = array(
        		"id" => $servid,
            		"timeto" => ""
        	);	
		$success = yii::app()->controller->lanbilling->get( "stopUsboxService", $struct, false );
		return $success;
	}
	public function execute() {
		if (yii::app()->controller->getWizard()->getParam("act")) return $this->assignService();
		else return $this->stopService();
	}
	private function getActionDescr() {
		return yii::app()->controller->getWizard()->getParam("act") ? "Assign" : "Stop";
	}
	private function getMainClass() {
		if (!$this->main) $this->main = new Additional;
		return $this->main;
	}
	private function getVG() {
		$vgid = yii::app()->controller->getWizard()->getParam("vgid");
		if (!$this->vg) $this->vg = $this->getMainClass()->getVGData($vgid);
		return $this->vg;
	}
	private function getVGLogin() {
		return $this->getVG()->vgroup->login;
	}
	private function getCatDescr() {
		return $this->getMainClass()->getCategory( $this->getVG()->vgroup->tarifid, yii::app()->controller->getWizard()->getParam("catidx") )->descr;
	}
	protected function getSuccessMessage() {
		return yii::t("DTVModule.additional", "Success" . $this->getActionDescr(), array(
			"{vg}" => $this->getVGLogin(),
			"{cat}" => $this->getCatDescr()
		));
	}
	protected function getErrorMessage() {
		return yii::t("DTVModule.additional", "Error" . $this->getActionDescr(), array( 
			"{vg}" => $this->getVGLogin(),
			"{cat}" => $this->getCatDescr()
		));
	}
} ?>
