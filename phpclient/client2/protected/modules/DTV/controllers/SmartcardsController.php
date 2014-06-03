<?php class SmartcardsController extends Controller {
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_television'
            )
        ));
    }
	public function actionIndex() {
		$this->breadcrumbs=array(
			Yii::t('menu','Television'),
			Yii::t('DTVModule.smartcards','TV channels')
		);
		$this->pageTitle = yii::app()->name . ' - ' . Yii::t('DTVModule.smartcards','TV channels');
		$this->render('TVPackagesTabs',array(
			'title' => Yii::t('DTVModule.smartcards','TV channels'),
			'smartCardTabs' => $this->getModule()->SmartCardTabs->Render() 
		));
	}
	public function actionPersonalTV($vgid,$tab) {
		$this->breadcrumbs=array(
			Yii::t('menu','Television'),
			Yii::t('DTVModule.smartcards','TV channels') => array('/DTV/smartcards'),
			Yii::t('DTVModule.smartcards','PersonalTelevision'),
		);
		$this->pageTitle = Yii::app()->name.' - '.Yii::t('DTVModule.smartcards', 'PersonalTelevision');
		$this->getModule()->PersonalTVGrid->SetVgid($vgid);
		$this->render('PersonalTV',array(
			'title' => Yii::t('DTVModule.smartcards', 'PersonalTelevision'),
			'personalTVGrid' => $this->getModule()->PersonalTVGrid->Render(),
			'actionURL' => $this->createUrl('smartcards/PersonalTVSelectedChannels',array("tab" => Yii::app()->request->getParam("tab",0))),
			'vgid' => $vgid,
			'backLink' => CHtml::link(Yii::t('DTVModule.smartcards', 'Back'), array('/DTV/smartcards',"tab" => Yii::app()->request->getParam("tab",0)))
		));
	}
	public function actionThanks($vgid,$tab) {
		$this->breadcrumbs = array(
			Yii::t('menu', 'Television'),
			Yii::t('DTVModule.smartcards','TV channels') => array('/DTV/smartcards'),
			Yii::t('DTVModule.smartcards', 'PackageSubscribing')
		);
		$this->pageTitle = Yii::app()->name.' - '.Yii::t('DTVModule.smartcards', 'PackageSubscribing');
		$this->render('thanks',array(
			'link' => CHtml::link(
				yii::t('DTVModule.smartcards',"Link"),
    			array(
    				"/DTV/Smartcards/PersonalTV", 
    				"tab" => $tab,
    				"vgid"=>$vgid
				)
			)
		));
	}
	public function actions() {
		return array(
			'PersonalTVSelectedChannels' => 'application.modules.DTV.controllers.smartcards.PersonalTVSelectedChannels',
			'ApplyPersonalTVUpdate' => 'application.modules.DTV.controllers.smartcards.ApplyPersonalTVUpdate',
			'AssignTVPackage' => 'application.modules.DTV.controllers.smartcards.AssignTVPackage',
			'UnsubscribeTVPackage' => 'application.modules.DTV.controllers.smartcards.UnsubscribeTVPackage',
		);
	}
} ?>
