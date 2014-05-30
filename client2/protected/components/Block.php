<?php class Block extends CApplicationComponent {
	private $assignedDTVServices_ThatCanBeKeptTurnedOn;
	private $categories;
	private $vgroup;
	private function lb() {
		return yii::app()->controller->lanbilling;
	}
	private function getCurrentTime() {
		return strtotime( date('Y-m-d') );
	}
	private function getNextDay() {
		return $this->getCurrentTime() + 86400;
	}
	private function getDateLimitParameter() {
		return (yii::app()->controller->getWizard()->getParam('action')) ? "allow_unblock_immediately" : "allow_block_immediately";
	}
	public function getMinDate() {
		if(yii::app()->params["block"][$this->getDateLimitParameter()]) return $this->getCurrentTime();
		else return $this->getNextDay();
	}
	public function validateDate( $date ) {
		if (!$date) throw new Exception( yii::t("tariffs_and_services", "DateIsNotSelected") );
		if (!preg_match( "/[0-9]{4}-[0-9]{2}-[0-9]{2}/", $date )) throw new Exception( yii::t("tariffs_and_services", "InvalidDateFormat") );
		if (yii::app()->block->getMinDate() > strtotime($date)) throw new Exception( yii::t("tariffs_and_services", "VGStateChangeIsNotAllowedForThisDate") );
	}
	public function getDate() {
		$date = yii::app()->controller->getWizard()->getParam("date");
		$this->validateDate( $date );
		return yii::app()->controller->formatDate(strtotime($date));
	}
	private function addDTVStepIfNessecary( $widget ) {
		if(!$widget->getParam( "action" ) AND $widget->getParam( "vgid" )) {
			try {
			 	$assignedDTVServices_ThatCanBeKeptTurnedOn = $this->getAssignedDTVServices_ThatCanBeKeptTurnedOn();
			} catch ( Exception $e ) {
				$widget->redirectToFirstStepWithErrorMessage( $e->getMessage() );
			}
			if ( $assignedDTVServices_ThatCanBeKeptTurnedOn ) $widget->setStepComponent( new BlockDTVStep );
		}
	}
	public function getWizard() {
		$steps = array();
		$steps[] = new BlockVGStep;
		$widget = yii::app()->controller->createWidget('Wizard', array(
			'step' => yii::app()->request->getParam( 'step', 1 ),
			'title' => yii::t('tariffs_and_services', 'UsersBlock'),
			'route' => 'services/block',
			'steps' => $steps,
			'breadcrumbs' => array(
            			Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services')
			)
		));
		if ($widget->getParam("action") !== null) {
			if ( $widget->getParam("action") != 2 ) { 
				$widget->setStepComponent( new BlockDateStep );
				$this->addDTVStepIfNessecary( $widget );
				$widget->setStepComponent( new BlockConfirmStep );
				$widget->setFinalStep( new BlockFinalStep );
			} else {
				$widget->setStepComponent( new BlockCancelConfirm );
				$widget->setFinalStep( new BlockCancelFinalStep );
			}
		}
		$html = $widget->run();
		return $html;
	}
	private function getDTVServices() {
		return $this->lb()->getRows('getVgroupServices',array(
			'flt' => array(
            			'vgid' => yii::app()->controller->getWizard()->getParam("vgid"),
            			'common' => 1,
            			'unavail' => -1,
            			'needcalc' => 1, 
            			'defaultonly' => 1
        		)
		));
	}
	private function getTarCategories() {
		if(!$this->categories) $this->categories = $this->lb()->getRows('getTarCategories', array("id" => $this->getVgroup()->vgroup->tarifid));
		return $this->categories;
	}
	private function getTarCategory( $id ) {
		foreach ($this->getTarCategories() as $category) {
			if( $category->catidx == $id ) return $category;
		}
	}
	public function getAssignedDTVServices_ThatCanBeKeptTurnedOn() {
		if($this->assignedDTVServices_ThatCanBeKeptTurnedOn === null) {	
			$this->assignedDTVServices_ThatCanBeKeptTurnedOn = array();
			foreach ($this->getDTVServices() as $service) {
				if( $this->getTarCategory($service->catidx)->keepturnedon ) $this->assignedDTVServices_ThatCanBeKeptTurnedOn[] = $service;
			}
		}
		return $this->assignedDTVServices_ThatCanBeKeptTurnedOn;
	}
	public function getCancelChangeStateText( $vgroup ) {
		if ($vgroup->blockrasp->blkreq == 0) return yii::t("tariffs_and_services", "UndoUnblock");
		elseif ($vgroup->blockrasp->blkreq == 2) return yii::t("tariffs_and_services", "UndoBlock");
	}
	public function VGHasStateChangingSheduledByClient( $vgroup ) {
		if (!isset($vgroup->blockrasp) OR !$vgroup->blockrasp) return false;
		if (is_array($vgroup->blockrasp)) return false;
		if ($vgroup->blockrasp->requestby != -1) return false;
		if ($vgroup->blockrasp->blkreq != 0 AND $vgroup->blockrasp->blkreq != 2) return false;
		return true;
	}
	public function VGHasStateChangingScheduledByAdministrator( $vgroup ) {
		if (!isset($vgroup->blockrasp) OR !$vgroup->blockrasp) return false;
		return !$this->VGHasStateChangingSheduledByClient( $vgroup );
	}
	public function isVGroupAvailableForStateChanging( $vgroup, $action = null ) {
		if ($this->VGHasStateChangingScheduledByAdministrator( $vgroup )) return false;
		if ($action === null) return ($vgroup->vgroup->blocked == 2 OR $vgroup->vgroup->blocked == 0);
		$hasBlockSchedule = $this->VGHasStateChangingSheduledByClient( $vgroup );
		if ($action == 2) return ($hasBlockSchedule);
		if ($hasBlockSchedule) return false;
		if ($action == 0) return ($vgroup->vgroup->blocked == 0);
		if ($action == 1) return ($vgroup->vgroup->blocked == 2);
	}
	public function getVgroup() {
		if (!$this->vgroup) {
			$vgid = yii::app()->controller->getWizard()->getParam('vgid');
			if(!$vgid) throw new Exception( yii::t("tariffs_and_services", "NoVgroup") );
			$vgroup = $this->lb()->getItem('getClientVgroups', array('flt' => array('vgid' => $vgid)));
			if(!$this->isVGroupAvailableForStateChanging($vgroup, yii::app()->controller->getWizard()->getParam("action"))) throw new Exception( yii::t("tariffs_and_services", "VGroupIsNotAvailableForStateChanging") );
			$this->vgroup = $vgroup;
		}
		if(!$this->vgroup) throw new Exception( yii::t("tariffs_and_services", "NoVgroup") );
		return $this->vgroup;
	}
	public function getAgreement() {
		$vgroup = $this->getVgroup()->vgroup;
		$agrmid = $vgroup->agrmid;
		return $this->lb()->agreements[$agrmid]->number;
	}
	private function getAgentID() {
		return $this->getVgroup()->vgroup->agentid;
	}
	private function getBlockState() {
		return (yii::app()->controller->getWizard()->getParam("action")) ? 0 : 2;
	}
	private function isCurrentDateChosenForStateChanging() {
		return yii::app()->controller->getWizard()->getParam("date") == date("Y-m-d");
	}
	public function changeVGState() {
        	$struct = array(
            		"id" => $this->getAgentID(),
            		"vgid" => (int) yii::app()->controller->getWizard()->getParam("vgid"),
            		"blkreq" => $this->getBlockState(),
            		"requestby" => $this->lb()->client
        	);
		if ( !$this->isCurrentDateChosenForStateChanging() ) $struct["changetime"] = yii::app()->controller->getWizard()->getParam("date");
		return $this->lb()->save( "insBlkRasp", $struct, true );
	}
} ?>
