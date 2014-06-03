<?php class PersonalTVSelectedChannels extends CAction {
	private $backURL;
	
	public function run() {
		$this->CheckVgidParam();
		$this->SetBreadcrumbs();
		$this->SetPageTitle();
		$this->SetChannelsGridParams();
		$this->CheckChannelsToUpdateAreSelected();
		$this->CheckBalance();
		$this->RenderData();
	}
	
	private function CheckVgidParam() {
		if (!yii::app()->request->getParam('vgid',0)) yii::app()->controller->redirect(array('smartcards/index','tab' => yii::app()->request->getParam('tab',0)));
	}
	
	private function SetBreadcrumbs() {
		yii::app()->controller->breadcrumbs=array(
    		Yii::t('menu','Television'),
    		Yii::t('DTVModule.smartcards','TV channels') => array('/DTV/smartcards'),
			Yii::t('DTVModule.smartcards','PersonalTelevision') => $this->GetBackUrl(),
    		Yii::t('DTVModule.smartcards','UpdateChannelsList'),
		);
	}
	
	private function SetPageTitle() {
		yii::app()->controller->pageTitle = Yii::app()->name.' - '.Yii::t('DTVModule.smartcards', 'UpdateChannelsList');
	}
	
	private function SetChannelsGridParams() {
		$params = array(
			'vgid' => yii::app()->request->getParam('vgid',0), 
			'catidxList' => yii::app()->request->getParam('catidx',array())
		);
		yii::app()->controller->getModule()->TVChannelsToAssignGrid->SetParams($params);
		yii::app()->controller->getModule()->TVChannelsToStopGrid->SetParams($params);
	}
	
	private function CheckChannelsToUpdateAreSelected() {
		if ( 	yii::app()->controller->getModule()->TVChannelsToAssignGrid->IsNoData() AND
			 	yii::app()->controller->getModule()->TVChannelsToStopGrid->IsNoData()
		) yii::app()->controller->redirect($this->GetBackUrl());
	}
	
	private function CheckBalance() {
		if (!yii::app()->controller->getModule()->TVChannelsToAssignGrid->CheckBalance()) {
			Yii::app()->user->setFlash('error', Yii::t('DTVModule.smartcards', 'LowBalance'));
			yii::app()->controller->redirect($this->GetBackUrl());
		}
	}
	
	private function RenderData() {
		yii::app()->controller->render('SelectedTVChanels',array(
			'title' => Yii::t('DTVModule.smartcards', 'UpdateChannelsList'),
			'TVChannelsToAssignGrid' => yii::app()->controller->getModule()->TVChannelsToAssignGrid->Render(),
			'TVChannelsToStopGrid' => yii::app()->controller->getModule()->TVChannelsToStopGrid->Render(),
			'TVChannelsToUpdateHiddenFields' => yii::app()->controller->getModule()->SelectedTVChannelsGrid->GetTVChannelsToUpdateHiddenFields(),
			'backLink' => CHtml::link(Yii::t('DTVModule.smartcards', 'Back'), $this->GetBackUrl()),
			'actionURL' => yii::app()->controller->createUrl('smartcards/ApplyPersonalTVUpdate', array('tab' => yii::app()->request->getParam('tab',0)))
		));
	}
	
	private function GetBackUrl() {
		if (!$this->backURL) $this->backURL = yii::app()->controller->createUrl('/DTV/Smartcards/PersonalTV', array(
				'tab' => yii::app()->request->getParam('tab',0),
				'vgid' => yii::app()->request->getParam('vgid',0)
		));
		return $this->backURL;
	}
} ?>