<?php
Yii::import('zii.widgets.CPortlet');

class UserMenu extends CPortlet
{
    public function init()
    {
        $this->hideOnEmpty=true;
        $controllerId = Yii::app()->controller;
        parent::init();
    }
    protected function renderContent()
    {
        $links = $this->checkMenuLink();
        $this->render('userMenu',array('links'=>$links,'rentSoftAvailable' => $this->IsRentSoftAvailable()));
    }

	protected function IsRentSoftAvailable() {
		$getClientServFuncs = new getClientServFuncs;
		if (!$getClientServFuncs->getItem('selectRensoft')) return false;
		if (!yii::app()->params['menu_rentsoft']) return false;
		if (!yii::app()->hasModule('RentSoft')) return false;
		try {
			if (!yii::app()->getModule('RentSoft')->rentsoft->getAgreementsList()) return false;
		} catch (Exception $e) {
			return false;
		}
		return true;
	}

    public function checkMenuLink()
    {
        if (Yii::app()->hasModule('DTV')) {
            $_filter = array( 'id' => Yii::app()->user->getId() );
            if( false != ($result = Yii::app()->controller->lanbilling->get("getClientMenu", $_filter, true))){
                if(!is_array($result)) { $result = array($result); }
            }
            $links = array();
            if (is_array($result) && count($result) > 0) {
		$result = array("EQUIPMENT");
		if ( yii::app()->getModule('DTV')->SmartCardTabs->getVgroups() ) $result[] = "SMARTCARDS";
                foreach ($result as $k=>$linkCode) {
                    $links[] = CHtml::link(Yii::t('menu', $linkCode),array('/DTV/'.strtolower($linkCode)), array('class'=>'nav-menu-link'));
                }
            }
            return $links;
        }
    }

}
