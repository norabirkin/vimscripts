<?php class EquipmentController extends Controller {
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_television'
            )
        ));
    }
	public function actionIndex() {
		$this->breadcrumbs=array(Yii::t('DTVModule.equipment','Equipments'));
		$this->pageTitle = yii::app()->name . ' - ' . Yii::t('DTVModule.equipment','Equipments');
		$show = '';
		foreach ($this->getModule()->equipment->getEquipmentsBindedToVgroups() as $item) {
			$grid = new EquipmentsBindedToVgrouprsGrid(array( "title" => $item["vglogin"], "equipments" => $item["data"] ));
			$show .= $grid->Render();
		}
		$hide = '';
		$i = 0;
		foreach ($this->getModule()->equipment->getEquipmentsBindedToSmartcards() as $item) {
			$grid = new EquipmentsBindedToVgrouprsGrid(array( "title" => "", "equipments" => $item["data"] ));
			$item_html = $this->renderPartial('equipments', array( 
				'carddescedit' => getSmartCards::descEditWidget($item["card"]['cardid']),
				'cardid' => $item["card"]['cardid'],
				'grid' => ($item["data"]) ? $grid->Render() : null,
				'name' => $item["card"]['name'],
				'serial' => $item["card"]['serial'],
				'descr' => $item["card"]['descr'],
				'joineq' => $this->getModule()->equipment->allowJoin( $item["card"]["cardid"] ) ? CHtml::link(
					yii::t('DTVModule.equipment','JoinEquipment'),
					array('/DTV/Equipment/JoinEquipmet', 'smartcard' => $item["card"]['cardid'])
				): '',
                'message' => $this->getModule()->equipment->getEquipmentLinkUnavailableMessageIfNeccessary($item["card"]['cardid'])
			),true);
			if ($i < 2) $show .= $item_html;
			else $hide .= $item_html;
			$i ++;
		}
		if ($hide) $hide = $this->renderPartial('hidden',array('content' => $hide),true);
		$html = $show.$hide;
		$params = array('content' => $show ? $html : (yii::t('DTVModule.equipment','There is no available devices')).'.');
		if(!isset($_GET['ajax'])) $this->render('index', $params);
		else  $this->renderPartial('index', $params);
	}
	public function actionJoinEquipmet($smartcard) {
		$this->breadcrumbs = array(
			Yii::t('DTVModule.equipment','Equipments') => array('/DTV/equipment'),
			yii::t('DTVModule.equipment','JoinEquipment')
		);
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('DTVModule.equipment','JoinEquipment');
		$model = new getSmartCards;
		$model->smartcard = $smartcard;
		$smartcard_info = $model->getItem('selectSmartcard');
		if (!$smartcard_info) {
			yii::app()->user->setFlash('error',yii::t('DTVModule.equipment','NoSmartCard'));
			$this->redirect(array('/DTV/Equipment/'));
		}
		$cardname = $smartcard_info->smartcard->name;
		$model = new getClientVgroups;
		$model->vgid = $smartcard_info->smartcard->vgid;
		$agrmid= $model->getItem()->vgroup->agrmid;
		$model = new getEquipment;
		$model->agrmid = $agrmid;
		$grid = $model->getGrid(array(
			'modelname' => Yii::t('DTVModule.equipment','Model name'),
			'name' => Yii::t('DTVModule.equipment','Name'),
			'serial' => Yii::t('DTVModule.equipment','Serial'),
			'agrmnum' => Yii::t('DTVModule.equipment','Agreement number'),
			'mac' => Yii::t('DTVModule.equipment','Mac'),
			'chipid' => Yii::t('DTVModule.equipment','Chip ID'),
			'description' => Yii::t('DTVModule.equipment','Description'),
			'connect' => ''
		), 'equipmentList');
		$equipment = $this->getModule()->equipment->getNotBindedEquipment( $agrmid );
		$grid = new EquipmentsBindedToVgrouprsGrid(array( 
			"title" => "", 
			"equipments" => $equipment 
		));
		$this->render('join',array('grid' => $grid->Render(), 'cardname' => $cardname));
	}
	public function actionJoinRequest() {
		$model = new setCardEquipment('joinEquipment');
		$model->setAttributes($_REQUEST);
		if ($model->update()) yii::app()->user->setFlash('success',yii::t('DTVModule.equipment','EquipmentSuccesfullyJoined'));
		else yii::app()->user->setFlash('error',yii::t('DTVModule.equipment','EquipmentJoinError'));
		$this->redirect(array('/DTV/Equipment/'));
	}
	public function actionDetachEquipment($equipid) {
		$model = new setCardEquipment('detachEquipment');
		$model->setAttributes($_REQUEST);
		$model->cardid = 0;
		if ($model->update()) yii::app()->user->setFlash('success',yii::t('DTVModule.equipment','EquipmentSuccesfullyDetached'));
		else yii::app()->user->setFlash('error',yii::t('DTVModule.equipment','EquipmentDetachError'));
		$this->redirect(array('/DTV/Equipment/'));
	}
} ?>
