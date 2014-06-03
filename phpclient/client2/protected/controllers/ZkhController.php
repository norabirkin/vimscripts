<?php class ZkhController extends Controller {
	
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_zkh'
            )
        ));
    }

	public function actionIndex() {
		$this->breadcrumbs = array(
			yii::t('ZKH', 'Header')
		);
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('ZKH', 'Header');
		
		$zkh = new ZKH;
		$html = '';
		foreach ($zkh->getVGroups() as $vgroup) {
			$ZKHServicesGrid = new ZKHServicesGrid;
			$ZKHServicesGrid->setServices($vgroup["services"]);
            $html .= $this->form(array(
                    array(
                        'type' => 'display',
                        'value' => $vgroup['login'],
                        'label' => yii::t('ZKH', 'Device')
                    ),
                    array(
                        'type' => 'display',
                        'value' => $vgroup["serial"] ? $vgroup["serial"] : yii::t('ZKH','NoSerial'),
                        'label' => yii::t('ZKH', 'Serial')
                    )
                ))->render().
                '<div style="height: 40px;"></div>'.
                $ZKHServicesGrid->Render();
		}
		
		$this->render('index', array(
			'agreements' => $html ? $html : yii::t('main', 'No vgroups found')
		));
	}
	
	public function actionRegistration($vgid, $catidx) {
		$zkh = new ZKHRegistration;
		$this->breadcrumbs = array(
			yii::t('ZKH', 'Header') => $this->createUrl('zkh/index'),
			yii::t('ZKH', 'Registration')
		);
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('ZKH', 'Registration');
		$registration = $zkh->setVGroupID($vgid)->setCategoryID($catidx)->getRegistration();
		$registration["vgid"] = $vgid;
		$registration["catidx"] = $catidx;
		if (!$registration) $this->redirect(array('zkh/index'));
		$this->render('registration', $registration);
	}
	
	
	public function actionSave() {
		$model = new ZKHModel;
		$model->setScenario('save');
		$model->setAttributes($_REQUEST);
		
		if ($model->validate() AND $model->save()) yii::app()->user->setFlash('success', yii::t('ZKH', 'Success'));
		else {
			yii::app()->user->setFlash('error', yii::t('ZKH', 'Fail'));
			if ($model->getErrors()) Dumper::log($model->getErrors(), 'error.ZKHModel');
		}
		$this->redirect(array('zkh/index'));
	}
	
	public function actionConfirm() {
		$model = new ZKHModel;
		$_REQUEST['registrationDate'] = $_REQUEST['registrationDate'] . ' 00:00:00';
		$model->setAttributes($_REQUEST);
		
		if (!$model->validate()) {
			Dumper::log($model->getErrors(), 'error.ZKHModel');
			$this->redirect(array('zkh/index'));
		}
		
		$this->breadcrumbs = array(
			yii::t('ZKH', 'Header') => $this->createUrl('zkh/index'),
			yii::t('ZKH', 'Registration') => $this->createUrl('zkh/registration', array('vgid' => $model->vgid, 'catidx' => $model->catidx)),
			yii::t('ZKH', 'Confirm')
		);
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('ZKH', 'Confirm');
			
		$data = $model->getDataToConfirm();
		$this->render('confirm', $data);
	}
	
} ?>
