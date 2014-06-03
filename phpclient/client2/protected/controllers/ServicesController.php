<?php

class ServicesController extends Controller
{
    private $wizard;
    public function setWizard( Wizard $wizard ) {
	$this->wizard = $wizard;
    }
    public function getWizard() {
	return $this->wizard;
    }

    /**
     * @return array action filters
     */
    public function filters()
    {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_services'
            )
        ));
    }

    public $defaultAction = 'StartPage';

    public function actionBlock() {
	if (!yii::app()->params["vgroup_change_status"]) $this->redirect(array("account/index"));
	$this->render( 'block', array(
		'content' => yii::app()->block->getWizard()
	));
    }
    public function actionStartPage()
    {
        if(!isset($_GET['ajax'])) $this->render('main');
        else  $this->renderPartial('main');
    }
	
	public function actionTest() {
		$vgroups = $this->lanbilling->get('getClientVgroups');
		//Dumper::dump($vgroups);
		
		$tarid = 645;
		$grouptarid = 642;
		echo '<meta charset="utf-8">';
		$params = array('id' => $tarid);
		echo '<h1>[getTarif]:request</h1>';
		Dumper::dump($params);
		$tarif = yii::app()->controller->lanbilling->get('getTarif',$params);
		echo '<h1>[getTarif]:response</h1>';
		Dumper::dump($tarif);
		
    	$params = array('filter' => array(
        	'groupid' => 0,
        	'grouptarid' => $grouptarid,
        	'groupmoduleid' => 0,
        	'tarid' => $tarid
    	));
		echo '<h1>[getTarifsStaff]:request</h1>';
		Dumper::dump($params);
		$staff = yii::app()->controller->lanbilling->get('getTarifsStaff',$params);
		echo '<h1>[getTarifsStaff]:response</h1>';
		Dumper::dump($staff);
	}

    public function actionTariff()
    {
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup'),
        );
        
        if (!yii::app()->params['vgroup_schedule']) $this->redirect(array('account/index'));
        $model = new Services();
        $agreements = $model->vgroups_list_for_tarif();
        
        $vgroups_html = '';
        foreach ($agreements as $k => $agreement) {
            $grid = $model->get_grid($agreement['vgroups'],array(
                'agentdescr' => Yii::t('tariffs_and_services', 'Agent'),
                'vgroup' => Yii::t('tariffs_and_services', 'VGroup'),
                'tarifdescr' => Yii::t('tariffs_and_services', 'CurrentTariff'),
                'servicerent' => Yii::t('tariffs_and_services', 'Rental')
            ));
            $vgroups_html .= $this->renderPartial('list_agreements',array(
                'agreement' =>  yii::t('tariffs_and_services','Agreement').': '.$agreement['number'],
                'balance' => $agreement['balance'],
                'grid' => $grid
            ),true);
        }
        if (!$agreements) $vgroups_html = Yii::t('tariffs_and_services', 'NoVGroupsForTariffChange');
        
        $params = array(
            'grid' => $vgroups_html, 
            'step' => 1, 
            'title' => yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup'),
            'description' => Yii::app()->params['services_tardescr_text']
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }
	
    public function actionChooseVgroupForService() {
        $this->pageTitle = Yii::app()->name.' - '.yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 2 '.yii::t('tariffs_and_services', 'ChooseVGroup');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService') => array('/services/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 2 '.yii::t('tariffs_and_services', 'ChooseVGroup')
        );
            
        $model = new Services();
        $vgroups = $model->getVgroupsForService($_REQUEST);
                
        $columns = array( 
                'login' => yii::t('tariffs_and_services','VGroup'),
                'action' => yii::t('tariffs_and_services','Actions')
        );
        if ((int) $_REQUEST['common']) $columns = array_merge ($columns, array(
            'timefrom' => yii::t('tariffs_and_services','TimeFrom'),
            'timeto' => yii::t('tariffs_and_services','TimeTo'),
            'state' => yii::t('tariffs_and_services','ServicesState')
        ));
        $grid = $model->get_grid($vgroups,$columns);
        $grid = $this->renderPartial('choose_vgroup_for_services',array(
            'category_description' => $model->stored('catdescr'),
            'vgroups' => $grid,
            'tarif_description' => $model->stored('tardescr')
        ),true);
            
        $params = array('grid' => $grid, 'step' => 2, 'title' => yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 2 '.yii::t('tariffs_and_services', 'ChooseVGroup'));
        if(!isset($_GET['ajax'])) $this->render('chooseService', $params);
        else  $this->renderPartial('chooseService', $params);
    }

	public function actionServices()
    {		
    	$list = yii::app()->Services->getList()->getData();
		
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService'),
        );
		$html = '';
		if ($list['service_functions']) $html .= yii::app()->grid->get_grid($list['service_functions'],array('description' => yii::t('tariffs_and_services','ServiceName')));
		foreach($list['agreements'] as $agrmid => $item) {
			$html .= $this->renderPartial('list_agreements',array(
                'agreement' => yii::t('tariffs_and_services','Agreement') . ': '.$this->lanbilling->agreements[$agrmid]->number,
                'grid' => yii::app()->grid->get_grid($item,array(
					'description' => yii::t('tariffs_and_services','ServiceName'),
					'full_description' => yii::t('tariffs_and_services','Description'),
					'price' => yii::t('tariffs_and_services','Price')
			))),true);
		}
        $params = array(
            'grid' => $list['agreements'] ? $html : yii::t('tariffs_and_services','NoVgroups'), 
            'step' => 1, 
            'title' => yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService'),
            'description' => ''
        );
        if(!isset($_GET['ajax'])) $this->render('chooseService', $params);
        else  $this->renderPartial('chooseService', $params);
    }
    
    /*public function actionServices()
    {
        $model = new Services();
        $functions = $model->getServiceFunctions();
        $services = $model->getUserServices();
        
        $columns = array(
            array(
                'name' => 'Наименование услуги',
                'value' => 'description',
                'htmlOptions' => array('class'=>'name_col')
            ),
            array(
            	'name' => 'Описание',
                'value' => 'full_description'
            ),
            array(
                'name' => 'Стоимость',
                'value' => 'price'
            )
        );
        
        $services_html = '';
        $model->store('functions', $functions);
        foreach ($services as $k=>$agr) {
            $agr['services'] = array_merge($agr['services'],$model->selectAgreementFunctions($k));
			
            $dp = new CArrayDataProvider($agr['services'], array(
                'id'=>'services_'.$k,
                'keyField' => 'description',
                'pagination' => false,
            ));
            $grid = $model->getGrid($dp,$columns);
            $services_html .= $this->renderPartial('list_agreements',array(
                'agreement' => 'Договор: '.$agr['agreement'],
                'grid' => $grid
            ),true);
        }
        $not_binded = $model->not_binded_functions();
        if ($not_binded) {
            $dp = new CArrayDataProvider($not_binded, array(
                'id'=>'services_not_binded',
                'keyField' => 'description',
                'pagination' => false,
            ));
            $grid = $model->getGrid($dp,$columns);
            $services_html =  $grid.$services_html;
        }
        
        $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Выбор услуги');
        $this->breadcrumbs = array(
            Yii::t('Services', 'Тарифы и услуги') => array('/services'),
            'Услуги: '.Yii::t('Services', 'Выбор услуги'),
        );
        
        $params = array(
            'grid' => $services_html, 
            'step' => 1, 
            'title' => 'Услуги: Шаг 1. Выбор услуги',
            'description' => ''
        );
        if(!isset($_GET['ajax'])) $this->render('chooseService', $params);
        else  $this->renderPartial('chooseService', $params);
    }*/
    
    /*public function actionServices()
    {
        $model = new Services();
        $params = array(
            'model' => $model, 
            'vglist' => $model->getVgWithTariffs(false,false,'services'),
            'section_name' => Yii::t('Services', 'Услуги'),
            'descr' => '',
            'item_path' => '/Services/ChoiceService'
        );
        if(!isset($_GET['ajax'])) $this->render('changeTariff',$params);
        else  $this->renderPartial('changeTariff',$params);
    }*/
    
    public function actionChoiceTariff()
    {
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 2. '.Yii::t('tariffs_and_services', 'ChooseTariff');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup') => array('/services/tariff'),
          	yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 2. '.Yii::t('tariffs_and_services', 'ChooseTariff')
        );
        
        if (!yii::app()->params['vgroup_schedule']) $this->redirect(array('account/index'));
        $model = new Services('tariffsList');
        $vgid = Yii::app()->request->getParam("vgid",0);
        if (Yii::app()->session->contains('service_vgid') && Yii::app()->session->get('service_vgid') > 0) {
            if ($vgid && $vgid != Yii::app()->session->get('service_vgid')) {
                Yii::app()->session->remove('service_vgid');
                Yii::app()->session['service_vgid'] = $vgid;
            } else {
                $vgid = Yii::app()->session->get('service_vgid');
            }
        } else {
            if ($vgid) Yii::app()->session['service_vgid'] = $vgid;
        }
        $model->vgid = $vgid;
        if ($model->get_scheduled_by_user()) yii::app()->user->setFlash('error',yii::t('tariffs_and_services','RemoveScheduled'));
        
        $grids = '';
        
        $schedule = $model->tarif_schedule();
        if ($schedule) {
            $schedule_grid = $model->get_grid($schedule,array(
                "changetime" => Yii::t('tariffs_and_services', 'ChangeTime'),
                "tarnewname" => Yii::t('tariffs_and_services', 'Tariff'),
                "requestby" => Yii::t('tariffs_and_services', 'RequestBy'),
                "drop" => Yii::t('tariffs_and_services', 'Actions')
            ));
        
            $grids .= $this->renderPartial('list_agreements',array(
                'grid' => $schedule_grid,
                'agreement' => Yii::t('tariffs_and_services', 'Scheduled')
            ),true);
        }
        
        $tarstaff = $model->tarstaff_list();
        $tarifs_grid = $model->get_grid($tarstaff, array(
            'tarname' => Yii::t('tariffs_and_services', 'TariffName'),
            'description' => yii::t('tariffs_and_services','Description'),
            'rent' => Yii::t('tariffs_and_services', 'Rental')
        ));
        
        $grids .= $this->renderPartial('list_agreements',array(
            'grid' => $tarifs_grid,
            'agreement' => Yii::t('tariffs_and_services', 'AvailableTariffs')
        ),true);
        
        $params = array(
            'grid' => $grids, 
            'step' => 2, 
            'title' => yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 2. '.Yii::t('tariffs_and_services', 'ChooseTariff'),
            'description' => ''
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }

    public function actionStopService() {
        $model = new Services('stopService');
        $model->attributes = $_REQUEST;
        $model->action = 'stop';
        if ($model->validate()) $model->stopUsboxService();
        $this->redirect(array('services/services'));
    }

    public function actionChoiceService()
    {
        $model = new Services('servicesList');
        $vgid = Yii::app()->request->getParam("vgid",0);
        if (Yii::app()->session->contains('service_vgid') && Yii::app()->session->get('service_vgid') > 0) {
            if ($vgid && $vgid != Yii::app()->session->get('service_vgid')) {
                Yii::app()->session->remove('service_vgid');
                Yii::app()->session['service_vgid'] = $vgid;
            } else {
                $vgid = Yii::app()->session->get('service_vgid');
            }
        } else {
            if ($vgid) Yii::app()->session['service_vgid'] = $vgid;
        }
        $model->vgid = $vgid;
        
        if (isset($_POST['Service'])) {
            
            //echo print_r($model->attributes);
            
            if($model->action = 'stop') {
                $model->scenario = 'stopService';
                $model->attributes = $_POST['Service'];
                if ($model->validate()) $model->stopUsboxService();
            }
        }
        
        foreach ($model->getErrors() as $e) {
            yii::app()->user->setFlash('error',$e[0]);
        }
        if(!isset($_GET['ajax'])) $this->render('choiceService',array('model' => $model, 'schedule' => ''));
        else  $this->renderPartial('choiceService',array('model' => $model, 'schedule' => ''));
    }
    
    public function data_complete($params) {
        foreach ($params as $p) {
            if (!isset($_REQUEST[$p])) return false;
        }
        return true;
    }
    
    public function data_not_empty($params) {
        foreach ($params as $p) {
            if (!$_REQUEST[$p]) return false;
        }
        return true;
    }
    
    public function actionServiceChooseDate()
    {
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseServiceAssignDate');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService') => array('/services/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 2 '.yii::t('tariffs_and_services', 'ChooseVGroup'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseServiceAssignDate')
        );
        
        if (!(
                $this->data_complete(array('vgid','catidx','tarif','servid','common')) AND
                $this->data_not_empty(array('vgid','tarif'))
        )) throw new CHttpException(404, Yii::t('tariffs_and_services', 'NoVgroup'));
        
        $servid = (int) $_REQUEST['servid'];
        $model = new Services('serviceChoiceDate');
        $model->vgid = (int) $_REQUEST['vgid'];
        $model->catidx = (int) $_REQUEST['catidx'];
        $common = (int) $_REQUEST['common'];
        $service_details = $model->getServiceDetails($model->vgid, $model->catidx);
        $model->catdescr = $service_details['catdescr'];
        
        if (isset($_POST['Services'])) {
            $model->attributes = $_POST['Services'];
            $model->scenario = 'addService';
            if ($model->validate()) {
                    Yii::app()->session['service_vgid'] = $model->vgid;
                    Yii::app()->session['service_catidx'] = $model->catidx;
                    Yii::app()->session['service_catdescr'] = $model->catdescr;
                    Yii::app()->session['service_dtfrom'] = $model->dtfrom;
                    Yii::app()->session['service_dtto'] = $model->dtto;
                    Yii::app()->session['service_servid'] = $servid;
                    Yii::app()->session['service_common'] = $common;
                    $this->redirect(Yii::app()->createUrl('/Services/ServiceApply'),true);
            }
            $model->scenario = 'serviceChoiceDate';
        }
        $model->dtfrom = date('Y-m-d');
        $dtfrom_label = ($common) ? yii::t('tariffs_and_services','ServiceTimeFrom') : yii::t('tariffs_and_services','ServiceOrderDate');
        
        $data = array(
            array(
                'label' => yii::t('tariffs_and_services','ChoosenService'),
                'value' => $model->catdescr
            ),
            array(
                'label' => $dtfrom_label,
                'date' => $model->date_picker('dtfrom',date('Y-m-d'))
            )
        );
        if ($common) $data[] = array(
            'label' => yii::t('tariffs_and_services','ServiceTimeTo'),
            'date' => $model->date_picker('dtto','')
        );
        
        $html = $this->renderPartial('tarif_apply',array(
            'hidden' => array(),
            'back_link' => '/services/services',
            'model' => $model,
            'button_text' => yii::t('tariffs_and_services','Save'),
            'data' => $data
        ),true);
        
        $params = array(
            'grid' => $html, 
            'step' => 3, 
            'title' => yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseServiceAssignDate'),
            'description' => ''
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }
    
     public function actionServiceChoiceDate()
    {
        if ((Yii::app()->session->contains('service_vgid') && Yii::app()->session->get('service_vgid') > 0) OR (isset($_POST['vgid']) AND $_POST['vgid'] > 0))
        {
            if (isset($_POST['servid'])) $servid = $_POST['servid'];
            else $servid = 0;
            $model = new Services('serviceChoiceDate');
            
            if (isset($_POST['vgid'])) Yii::app()->session['service_vgid'] = $_POST['vgid'];
            $model->vgid = Yii::app()->session->get('service_vgid');

            $catidx = Yii::app()->request->getParam("catidx",0);
            if (Yii::app()->session->contains('service_catidx') && Yii::app()->session->get('service_catidx') > 0) {
                if ($catidx && $catidx != Yii::app()->session->get('service_catidx')) {
                    Yii::app()->session->remove('service_catidx');
                    Yii::app()->session['service_catidx'] = $catidx;
                } else {
                    $catidx = Yii::app()->session->get('service_catidx');
                }
            } else {
                if ($catidx) Yii::app()->session['service_catidx'] = $catidx;
            }
            $model->catidx = $catidx;
            
            

            $catdescr = Yii::app()->request->getParam("catdescr",'');
            if (Yii::app()->session->contains('service_catdescr') && strlen(Yii::app()->session->get('service_catdescr')) > 0 ) {
                if ($catdescr && $catdescr != Yii::app()->session->get('service_catdescr')) {
                    Yii::app()->session->remove('service_catdescr');
                    Yii::app()->session['service_catdescr'] = $catdescr;
                } else {
                    $catdescr = Yii::app()->session->get('service_catdescr');
                }
            } else {
                if ($catdescr) Yii::app()->session['service_catdescr'] = $catdescr;
            }
            $model->catdescr = $catdescr;

            /**
             * change && validate
             */
            
            $service = $model->getServiceDetails($model->vgid,$model->catidx);
            
            if (isset($_POST['Services'])) {
                $model->attributes = $_POST['Services'];
                $model->scenario = 'addService';
                if ($model->validate()) {
                    Yii::app()->session['service_dtfrom'] = $model->dtfrom;
                    Yii::app()->session['service_dtto'] = $model->dtto;
                    Yii::app()->session['service_servid'] = $servid;
                    Yii::app()->session['service_common'] = $service['common'];
                    $this->redirect(Yii::app()->createUrl('/Services/ServiceApply'),true);
		}
                $model->scenario = 'serviceChoiceDate';
            }
            
            
            
        } else throw new CHttpException(404, Yii::t('Services', 'Не удалось определить учетную запись.'));
        

        if(!isset($_GET['ajax'])) $this->render('serviceChoiceDate',array('model' => $model,'servid' => $servid, 'common' => $service['common']));
        else  $this->renderPartial('serviceChoiceDate',array('model' => $model,'servid' => $servid, 'common' => $service['common']));
    }

	public function actionPayment() {
		$this->breadcrumbs = array(
			yii::t('tariffs_and_services','TariffsAndServices') => array('services/tariff'),
			yii::t('tariffs_and_services','TariffChange'),
			yii::t('tariffs_and_services','BalanceRefill')
		);
		$this->render('payment');
	}

    public function actionChoiceDate()
    {
        if (!yii::app()->params['vgroup_schedule']) $this->redirect(array('account/index'));
        if (Yii::app()->session->contains('service_vgid') && Yii::app()->session->get('service_vgid') > 0)
        {
            $this->pageTitle = Yii::app()->name . ' - ' . Yii::t('tariffs_and_services', 'Tariffs').': '.Yii::t('tariffs_and_services', 'Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseTariffChangeDate');
            $this->breadcrumbs = array(
                Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
                yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup') => array('/services/tariff'),
          		yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 2. '.Yii::t('tariffs_and_services', 'ChooseTariff'),
                Yii::t('tariffs_and_services', 'Tariffs').': '.Yii::t('tariffs_and_services', 'Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseTariffChangeDate')
            );
            
			$model = new Services('choiceDate');
            
            $model->vgid = Yii::app()->session->get('service_vgid');
			
            $tarid = Yii::app()->request->getParam("tarid",0);
            if (Yii::app()->session->contains('service_tarid') && Yii::app()->session->get('service_tarid') > 0) {
                if ($tarid && $tarid != Yii::app()->session->get('service_tarid')) {
                    Yii::app()->session->remove('service_tarid');
                    Yii::app()->session['service_tarid'] = $tarid;
                } else {
                    $tarid = Yii::app()->session->get('service_tarid');
                }
            } else {
                if ($tarid) Yii::app()->session['service_tarid'] = $tarid;
            }
            $model->tarid = $tarid;
			
			$model->validate();

            $tarname = Yii::app()->request->getParam("tarname",'');
            if (Yii::app()->session->contains('service_tarname') && strlen(Yii::app()->session->get('service_tarname')) > 0 ) {
                if ($tarname && $tarname != Yii::app()->session->get('service_tarname')) {
                    Yii::app()->session->remove('service_tarname');
                    Yii::app()->session['service_tarname'] = $tarname;
                } else {
                    $tarname = Yii::app()->session->get('service_tarname');
                }
            } else {
                if ($tarname) Yii::app()->session['service_tarname'] = $tarname;
            }
            $model->tarname = $tarname;
            if (isset($_POST['Services'])){
                $model->scenario = 'changeTariff';
                $model->attributes = $_POST['Services'];
                if ($model->validate()) {
                    Yii::app()->session['service_date'] = $model->changeDate;
                    $this->redirect(Yii::app()->createUrl('/Services/TariffApply'),true);
				}
                $model->scenario = 'choiceDate';
            }
            
            $html = ''; 
            $schedule_data = $model->tarif_schedule();
            if ($schedule_data) {
                $schedule_grid = $model->get_grid($schedule_data,array(
                    "changetime" => Yii::t('tariffs_and_services', 'ChangeTime'),
                    "tarnewname" => Yii::t('tariffs_and_services', 'Tariff'),
                    "requestby" => Yii::t('tariffs_and_services', 'RequestBy'),
                    "drop" => Yii::t('tariffs_and_services', 'Actions')
                ));
        
                $html .= $this->renderPartial('list_agreements',array(
                    'grid' => $schedule_grid,
                    'agreement' => Yii::t('tariffs_and_services', 'Scheduled')
                ),true);
            }
            
            if ($model->get_scheduled_by_user()) yii::app()->user->setFlash('error', Yii::t('tariffs_and_services', 'RemoveScheduled'));
            
            $d = $model->get_limit_of_tarif_change_date();
            
            $html .= $this->renderPartial('tarif_apply',array(
                'hidden' => array(),
                'back_link' => '/services/tariff',
                'model' => $model,
                'button_text' => yii::t('tariffs_and_services','Change'),
                'data' => array(
                    array(
                        'label' => yii::t('tariffs_and_services','ChoosenTariff'),
                        'value' => $model->tarname
                    ),
                    $d['message'],
                    array(
                        'label' => yii::t('tariffs_and_services','TariffChangeDate'),
                        'date' => $model->get_date_picker()
                    )
                )
            ),true);
        } else throw new CHttpException(404, Yii::t('tariffs_and_services', yii::t('tariffs_and_services','NoVgroup')));
        
        $params = array(
            'grid' => $html, 
            'step' => 3, 
            'title' => Yii::t('tariffs_and_services', 'Tariffs').': '.Yii::t('tariffs_and_services', 'Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseTariffChangeDate'),
            'description' => ''
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }
    
    
    public function actionServiceApply() {
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 4. '.yii::t('tariffs_and_services','ServiceAssignConfirm');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').'1. '.Yii::t('tariffs_and_services', 'ChooseService') => array('/services/services'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 2 '.yii::t('tariffs_and_services', 'ChooseVGroup'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseServiceAssignDate'),
            yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 4. '.yii::t('tariffs_and_services','ServiceAssignConfirm')
        );
        
        $model = new Services('applyService');
        
        $model->catdescr    = Yii::app()->session->get('service_catdescr');
        $model->servid = Yii::app()->session->get('service_servid');
        $model->catidx      = Yii::app()->session->get('service_catidx');
        $model->vgid       = Yii::app()->session->get('service_vgid');
        $model->dtfrom = Yii::app()->session->get('service_dtfrom');
        $model->dtto = Yii::app()->session->get('service_dtto');
        $model->common = Yii::app()->session->get('service_common');
        
        if (isset($_POST['Services'])){
            
            $model->scenario = 'addService';
            $model->attributes = $_POST['Services'];
            if ($model->validate() && $model->applyAddService()) {
                $success_message = Yii::t('tariffs_and_services','ServiceSuccessfullyAssigned',array(
                	'{service}'=>$model->catdescr, 
                	'{dtfrom}'=>$model->dtfrom, 
                	'{dtto}' => $model->dtto
				));
                Yii::app()->user->setFlash('success',$success_message);
                //if ($model->dtto) $success_message .= Yii::t('Services', ' до <strong>{dtto}</strong>', array('{dtto}' => $model->dtto));
               //Yii::app()->user->setFlash('success',Yii::t('Services','Услуга <strong>{service}</strong> успешно подключена на период от <strong>{dtfrom}</strong> до <strong>{dtto}</strong>',array('{service}'=>$model->catdescr, '{dtfrom}'=>$model->dtfrom, '{dtto}' => $model->dtto)));
                $this->redirect(Yii::app()->createUrl('/services/services'),true);
            } else {
                Yii::app()->user->setFlash('error',Yii::t('tariffs_and_services','ServiceAssignError'));
                $this->redirect(Yii::app()->createUrl('/services/services'),true);
            }
            $model->scenario = 'applyService';
        }
        
        $data = array(
            array(
                'label' => yii::t('tariffs_and_services','ChoosenService'),
                'value' => $model->catdescr
            ),
            array(
                'label' => yii::t('tariffs_and_services','ServiceTimeFrom'),
                'value' => $model->dtfrom
            )
        );
        if ($model->common) $data[] = array(
            'label' => yii::t('tariffs_and_services','ServiceTimeTo'),
            'value' => ($model->dtto) ? $model->dtto : yii::t('tariffs_and_services','Unlimited')
        );
        
        $html = $this->renderPartial('tarif_apply',array(
            'hidden' => array('catidx','servid','dtfrom','dtto'),
            'back_link' => '/services/services',
            'model' => $model,
            'button_text' => yii::t('tariffs_and_services','Confirm'),
            'data' => $data
        ),true);
        
        $params = array(
            'grid' => $html, 
            'step' => 4, 
            'title' => yii::t('tariffs_and_services','Services').': '.yii::t('tariffs_and_services','Step').' 4. '.yii::t('tariffs_and_services','ServiceAssignConfirm'),
            'description' => ''
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }

    public function actionTariffApply()
    {
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 4. '.Yii::t('tariffs_and_services', 'TariffChangeConfirm');
        $this->breadcrumbs = array(
            Yii::t('tariffs_and_services', 'TariffsAndServices') => array('/services'),
            yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 1. '.yii::t('tariffs_and_services','ChooseVGroup') => array('/services/tariff'),
          	yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 2. '.Yii::t('tariffs_and_services', 'ChooseTariff'),
            Yii::t('tariffs_and_services', 'Tariffs').': '.Yii::t('tariffs_and_services', 'Step').' 3. '.Yii::t('tariffs_and_services', 'ChooseTariffChangeDate'),
            yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 4. '.Yii::t('tariffs_and_services', 'TariffChangeConfirm')
        );
        
        if (!yii::app()->params['vgroup_schedule']) $this->redirect(array('account/index'));
        $model = new Services('applyTaiff');

        $model->tarname    = Yii::app()->session->get('service_tarname');
        $model->tarid      = Yii::app()->session->get('service_tarid');
        $model->vgid       = Yii::app()->session->get('service_vgid');
        $model->changeDate = Yii::app()->session->get('service_date');

        if (isset($_POST['Services'])){
            $model->scenario = 'changeTariff';
            $model->attributes = $_POST['Services'];
            if ($model->validate() && $model->applyChangeTariff()) {
                Yii::app()->user->setFlash('success',Yii::t('tariffs_and_services','TariffSuccessfullyScheduled',array(
                	'{tariff}'=>'<strong>'.$model->tarname.'</strong>', 
                	'{date}'=>'<strong>'.$model->changeDate.'</strong>'
				)));
                $this->redirect(Yii::app()->createUrl('account/index'),true);
            } else {
                Yii::app()->user->setFlash('error',Yii::t('tariffs_and_services','TariffSchedulingError'));
                $this->redirect(Yii::app()->createUrl('/services/tariff'),true);
            }
            $model->scenario = 'choiceDate';
        }
        
        $html = ''; 
        $schedule_data = $model->tarif_schedule();
        if ($schedule_data) {
            $schedule_grid = $model->get_grid($schedule_data,array(
                "changetime" => Yii::t('tariffs_and_services', 'ChangeTime'),
                "tarnewname" => Yii::t('tariffs_and_services', 'Tariff'),
                "requestby" => Yii::t('tariffs_and_services', 'RequestBy'),
                "drop" => Yii::t('tariffs_and_services', 'Actions')
            ));
            $html .= $this->renderPartial('list_agreements',array(
                'grid' => $schedule_grid,
                'agreement' => Yii::t('tariffs_and_services', 'Scheduled')
            ),true);
        }
        
        $html .= $this->renderPartial('tarif_apply',array(
            'hidden' => array('tarid', 'changeDate'),
            'back_link' => '/services/tariff',
            'model' => $model,
            'button_text' => yii::t('tariffs_and_services', 'Confirm'),
            'data' => array(
                array(
                    'label' => yii::t('tariffs_and_services', 'ChoosenTariff'),
                    'value' => $model->tarname
                ),
                array(
                    'label' => yii::t('tariffs_and_services', 'TariffChangeTime'),
                    'value' => $model->changeDate
                )
            )
        ),true);
        
        $params = array(
            'grid' => $html, 
            'step' => 4, 
            'title' => yii::t('tariffs_and_services','Tariffs').': '.yii::t('tariffs_and_services','Step').' 4. '.Yii::t('tariffs_and_services', 'TariffChangeConfirm'),
            'description' => ''
        );
        
        if(!isset($_GET['ajax'])) $this->render('chooseService',$params);
        else  $this->renderPartial('chooseService',$params);
    }


    /**
     * Action cell in datagrid
     *
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function applyLink($data,$row)
    {
        $name = (!empty($data['tarname'])) ? $data['tarname'] : '<em>' . Yii::t('Services', 'Название отсутствует') . '</em>';
        if (isset($data['disabled']) AND $data['disabled']) return $name;
        $url = array("/Services/ChoiceDate");
        return CHtml::link(
            $name,
            $url,
            array(
                "submit"=>$url,
                'params'=>array(
                    "tarid" => $data["tarid"],
                    "tarname" => $data["tarname"],
                )
            )
        );
    }

    /**
     * Удаление тарифа из расписания
     */
    public function actionRemoveTarRasp()
    {
        $model = new Services('removetariff');
        if ($model->deleteScheduled($_POST['recordid'])){
            Yii::app()->user->setFlash('success',Yii::t('tariffs_and_services','SuccessfullyDeleted'));
        } else {
            Yii::app()->user->setFlash('error',Yii::t('tariffs_and_services','CantDelete'));
        }
        $this->redirect(Yii::app()->request->urlReferrer);
    }

    /**
     * Action cell in datagrid
     *
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function dropRaspLink($data,$row){

        if ($data["requestby"] == -1)
        {
            $url = array("/Services/removeTarRasp");
            return CHtml::link(
                Yii::t('Services', 'Удалить из расписания'),
                $url,
                array(
                    "submit"=>$url,
                    'params'=>array(
                        "recordid" => $data["recordid"],
                    ),
                    'confirm' => Yii::t('Services','Вы уверены, что хотите удалить тариф {tariff} из расписания?',array('{tariff}' => $data["tarnewname"]))
                )
            );
        }
        else
            return '';
    }





    /**
     * Client side RADIUS services management
     */
    public function actionGetVgroups()
    {
        $model = new User;
        $agrmId = (int)$_POST['agrm_id'];
        $data = $model->getVgroupsList($agrmId);
        $data = CHtml::listData($data,'vgroup.vgid', 'vgroup.login');
        foreach($data as $value=>$name)
        {
            echo CHtml::tag('option', array('value'=>$value), CHtml::encode($name), true);
        }
    }

    /**
     * Get allowed tarifs to schedule for the selected vgroup item
     */
    function getVgroupTarifs($vgid)
    {
        $_tmp = array();
        $_flt = array(
            "vgid" => $vgid
        );
        if( false != ($_accVg = $this->lanbilling->get("getClientVgroups", array('flt'=>$_flt))) ) {
            if(!empty($_accVg)) {
                $_tmp = array();
                if(isset($_accVg) && isset($_accVg->tarstaff)) {
                    if(!is_array($_accVg->tarstaff)) {
                        $_accVg->tarstaff = array($_accVg->tarstaff);
                    }
                    array_walk($_accVg->tarstaff, create_function('&$val, $key, $_tmp', '
                        if($val->tartype == $_tmp[1]) {
                            $_tmp[0][] = array(
                                "id"        => $val->tarid,
                                "name"      => $val->tarname,
                                "rent"      => $val->rent,
                                "symbol"    => $val->tarsymbol,
                                "descrfull" => $val->tardescrfull
                            );
                        }
                    '), array(&$_tmp, &$_accVg->vgroup->tariftype));
                }
            }
        }
        if(sizeof($_tmp) > 0) { return $_tmp; } else return FALSE;
    } // end getVgroupTarifs()
    
    /**
     * This action allows users to change tarification/services
     */
    /*
    public function actionIndex() {
        error_reporting(7);
        $error = false;
        if (empty($this->lanbilling->agreements)){
            $error = true;
        }
        
        $this->pageTitle = Yii::t('title', 'Managing tariffs and services') . ' / ' . $this->lanbilling->clientInfo->account->name;
     
        // Получение всех учеток пользователя 
        $this->lanbilling->vGroups = $this->lanbilling->get("getClientVgroups", array('id' => Yii::app()->user->getId()),true);
        $this->lanbilling->vGroups  = is_array($this->lanbilling->vGroups) ? $this->lanbilling->vGroups : array($this->lanbilling->vGroups);

        // Получение id договора - Get agreement ID
        $agrmid = Yii::app()->request->getParam('agreement', 0);
        if (!$agrmid && !empty($this->lanbilling->agreements)) {
            $agrmids = array_keys($this->lanbilling->agreements);
            $agrmid = $agrmids[0];
        }
        // id учетки
        $vgid    = Yii::app()->request->getParam('vgid', 0);
        // Тип действия (Смена тарифа или подключение услуг) 
        $service = Yii::app()->request->getParam('service', 0);

        yii::import('ext.services.tarif_change_schedule');
        yii::import('ext.services.tarifs_and_services_page');
        $tsp = new tarifs_and_services_page($agrmid,$vgid,$service);
        
        $vgid = $tsp->current_vgroup ? $vgid : 0;
        $service = ( $vgid ) ? $service : 0;
        
        if (!$tsp->action_avaliable($service)) {
            if ($service == 1) {
                Yii::app()->user->setFlash('warning',str_replace('%s', '<b>'.$tsp->current_vgroup->vgroup->tarifdescr.'</b>', Yii::t('app', 'Нет доступных тарифов')));
                $service = 0;
                $this->lanbilling->flushCache(array("getClientVgroups"));
            } 
            elseif ($service == 2) {
                Yii::app()->user->setFlash('success',str_replace('%s', $tsp->current_vgroup->vgroup->tarifdescr, Yii::t('app', 'Message7')));
            }
        }
        
        switch ($service) {

            // Change tarif
            case 1:
                $tc_schedule = new tarif_change_schedule($tsp->current_vgroup);
                $tc_schedule->get_limit_of_tarif_change_date();

                // Enable new tarif
                if ($vgid && ($tarid_new = Yii::app()->request->getParam('tariff',0 ))) {
                    if (false == $tc_schedule->schedule_tarif_change(Yii::app()->request->getParam('date'), $tarid_new)) {
                        Yii::app()->user->setFlash('error',str_replace('%s', '<b>'.$tsp->current_vgroup->vgroup->tarifdescr.'</b>', Yii::t('app', 'Message4')));                    
                        $this->lanbilling->flushCache(array("getClientVgroups"));
                        
                    } else {
                        Yii::app()->user->setFlash('success',str_replace('%s', '<b>'.$tsp->current_vgroup->vgroup->login.'</b>', Yii::t('app', 'Message3')));
                        $this->lanbilling->flushCache(array("getClientVgroups"));
                        $this->redirect(array('account/index'));
                    }
                // Show possible tarifs
                }
                break;

            // Change services
            case 2:
                if (Yii::app()->request->getParam('submit', '')) {
                    $service_not_saved = 0;
                    $catidx = Yii::app()->request->getParam('catidx', array());
                    $dtfrom = Yii::app()->request->getParam('dtfrom');
                    $dtto = Yii::app()->request->getParam('dtto');
                    foreach ($tsp->current_vgroup_services as $serv) {
                        if ( in_array($serv->catidx, array_keys($catidx)) ){
                            $struct = array(
                                "vgid" => $vgid,
                                "tarid" => $tsp->current_vgroup->vgroup->tarifid,
                                "catidx" => $serv->catidx,
                                "mul" => 1,
                                "timefrom" => date("\His",strtotime($dtfrom)),
                                "timeto" => (!empty($dtto)) ? date("YmdHis",strtotime($dtto)) : ''
                            );


                            
                            if (!($this->lanbilling->save("insupdClientUsboxService", $struct, true, array("getVgroupServices")))) {

                                $service_not_saved = 1;
                            }
                        }
                    }

                    $this->lanbilling->flushCache(array("getTarCategories"));

                    if ($service_not_saved)
                        Yii::app()->user->setFlash('error',str_replace('%s', $tsp->current_vgroup->vgroup->tarifdescr, Yii::t('app', 'Message8')));
                    else
                        Yii::app()->user->setFlash('success',str_replace('%s', $tsp->current_vgroup->vgroup->tarifdescr, Yii::t('app', 'Message7')));
                    
                    //$service = 0;
                    //$vgid = 0;
                } else {
                    // Standart page
                }
                break;
        }
        if ($service == 1) $date = date('d.m.Y',strtotime($tc_schedule->limit_of_tarif_change_date['date']));
        elseif ($service == 2) $date = date('d.m.Y',time());
        $this->render('services', array(
                'date'             => $date,
                'date_strict'      => $tc_schedule->limit_of_tarif_change_date['strict'],
                'tarifs_volume'    => $tsp->service_volume['tarifs_volume'],
                'tarifs_unlimited' => $tsp->service_volume['tarifs_unlimited'],
                'agr'              => $agrmid,
                'vgid'             => $vgid,
                'service'          => $service,
                'error'            => $error,
                'tsp'              => $tsp
            )
        );
    }*/

    /**
     * This action allows users to change service options
     */
    public function actionOptions() {
        $this->pageTitle = Yii::t('app', 'ServiceOptions') . ' / ' . $this->lanbilling->clientInfo->account->name;
        $this->lanbilling->vGroups = $this->lanbilling->get('getClientVgroups', array('id' => (integer)$this->lanbilling->clientInfo->account->uid));
        $_filter = array('userid' => $this->lanbilling->client);
        $this->lanbilling->Tarifs = $this->lanbilling->get("getClientTarifs",  array("flt" => $_filter));
        $this->lanbilling->tarifs = array();
        $this->lanbilling->Tarifs  = is_array($this->lanbilling->Tarifs) ? $this->lanbilling->Tarifs : array($this->lanbilling->Tarifs);
        foreach ($this->lanbilling->Tarifs as $Tarif) {
            if (!empty($Tarif)) {
                $this->lanbilling->tarifs[$Tarif->tarid] = $Tarif;
            }
        }
        $this->lanbilling->vGroups  = is_array($this->lanbilling->Tarifs) ? $this->lanbilling->vGroups : array($this->lanbilling->vGroups);
        foreach ($this->lanbilling->vGroups as $vGroup) {
            if ($vGroup->vgroup->tarifid == $this->id) {
                $this->lanbilling->Tarif = $vGroup;
                $this->lanbilling->Tarif->services = $this->lanbilling->get("getTarCategories", array("id" => $this->id));
            }
        }
        if (Yii::app()->request->getParam('submit', '')) {
            $service_not_saved = 0;
            $catidx = Yii::app()->request->getParam('catidx', '');
            foreach ($this->lanbilling->Tarif->services as $serv) {
                $struct = array(
                    "servid" => empty($catidx[$serv->catidx]) ? 0 : 1,
                    "vgid" => $this->lanbilling->Tarif->vgroup->vgid,
                    "tarid" => $this->lanbilling->Tarif->vgroup->tarifid,
                    "catidx" => $serv->catidx,
                    "mul" => 1,
                    "timefrom" => date("Y-m-d H:i:s"),
                    "timeto" => date("Y-m-d H:i:s")
                );
                if (!($this->lanbilling->save("insupdClientUsboxService", $struct, empty($catidx[$serv->catidx]) ? 1 : 0, array("getVgroupServices")))) {
                    $service_not_saved = 1;
                }
            }
            $this->lanbilling->flushCache(array("getTarCategories"));
            $this->message = str_replace('%s', $this->lanbilling->Tarif->vgroup->tarifdescr, Yii::t('app', 'Message' . ($service_not_saved ? 7 : 8)));
            $this->render('index');
        } else {
            $this->render('service-options');
        }
    }



    /**
     * Get the list of the services for USBox tariff according to passed account identification
     * number and its tariff settings
     * @param    object, billing class
     */
    function getUSBoxForVg($vg_id = 0)
    {
        if((integer)$vg_id == 0) return false;
        /**
         * Available filters
         * vgid: account id
         * common: -1 all, 0 - once, 1 - all periodic
         */
        $_filter = array(
            "vgid" => (integer)$vg_id,
            "unavail" => 0,
            "common" => -1
        );
        $_tmp = array();
        if( false != ($result = $this->lanbilling->get("getVgroupServices", array("flt" => $_filter))) ) {
            if(!is_array($result)) {
                $result = array($result);
            }
            array_walk($result, create_function('$item, $key, $_tmp', '
                if ($item->available) {
                    $_tmp[0][] = array(
                        "available" => $item->available,
                        "serviceid" => $item->servid,
                        "common" => $item->common,
                        "vgid" => $item->vgid,
                        "tarid" => $item->tarid,
                        "catidx" => $item->catidx,
                        "dateon" => $item->vgrfirston,
                        "timefrom" => $item->timefrom,
                        "timeto" => $item->timeto,
                        "catdescr" => $item->catdescr,
                        "above" => $item->above,
                        "mul" => $item->mul,
                        "personid" => $item->personid,
                        "used" => $item->assigned,
                        "symbol" => $item->symbol,
                        "flagused" => $item->assigned
                    );
                }
            '), array( &$_tmp ));
        }
        if(sizeof($_tmp) > 0) { return $_tmp; } else { return false; }
    } // end getUSBoxForVg

    /**
     * Турбо-интернет
     */
    public function actionTurbo()
    {
        if (!Yii::app()->user->isGuest) {
            $this->render('turbo');
        } else {
            $this->redirect(array("site/login"));
        }
    }
	
	
	/********************************/
		
	
	/*
	* Главная страница пункта меню "Дополнительные услуги"
	* На странице отображаются доступные пользователю услуги
	*
	*/

	public function actionIndex() {
		$agreements = $this->lanbilling->clientInfo->agreements;
		
		// Запрос на остановку услуги с выводом сообщения
		if(Yii::app()->request->getParam('stopservice', '')>0) {
	
			if(false != $this->lanbilling->get("delUsboxService", array('id'=>Yii::app()->request->getParam('stopservice', '')))) {
				Yii::app()->user->setFlash('success', 'Действие услуги успешно остановлено');
			} else {
				Yii::app()->user->setFlash('error', 'Неизвестная ошибка при редактировании услуги');
			}
		}
		
		
		// Запрос на назначение услуги
		if(Yii::app()->request->getParam('setservice', '')>0) {
			
			//Запрашиваем услугу для проверки валидности данных

			if(  date("Y-m-d",strtotime( Yii::app()->request->getParam('dtfrom', ''))) == date('Y-m-d')  ) {
				$timefrom = date("YmdHis");
			} else {
				$timefrom = date("YmdHis",strtotime( Yii::app()->request->getParam('dtfrom', '') ));
			}
			
			$timeto = (Yii::app()->request->getParam('dtto', '') != '') ? Yii::app()->request->getParam('dtto', '') : $timefrom ;
				
			$struct = array(
				'isInsert' => 1,
				'val' => array(
					"vgid" => Yii::app()->request->getParam('vgid', ''),
					"tarid" => Yii::app()->request->getParam('tarid', ''),
					"catidx" => Yii::app()->request->getParam('catidx', ''),
					"mul" => 1,
					"timefrom" => date("YmdHis",strtotime($timefrom)),
					"timeto" => date("YmdHis",strtotime($timeto))
				)
			);

			if(false != $this->lanbilling->get("insupdClientUsboxService", $struct)) {
				Yii::app()->user->setFlash('success',  yii::t('services', 'Услуга успешно добавлена') );
			} else {
				Yii::app()->user->setFlash('error', yii::t('service', 'Неизвестная ошибка при назначении услуги') );
			}
		}
		
		
		$data = array();
		
		// Проходимся по списку договоров
		foreach($agreements as $agrm) {
			
			$_filter = array(
				'agrmid' => $agrm->agrmid,
				'tariftype' => 5 // не юзаем все что не относится к usbox
			);
			
			$data = array();
			
			// Получаем список учетных записей для каждого из договоров
	        if( false != ($vgids = $this->lanbilling->get("getClientVgroups", array("flt" => $_filter))) ) {
	            if(!is_array($vgids)) {
	                $vgids = array($vgids);
	            }
				
				// Проходимся по списку УЗ, отсеивая все записи, которые не принадлежат USBOX
				foreach($vgids as $vgid) {		

					// Отсеяли. Теперь получаем список услуг, доступных для назначения на УЗ
					$flt = array(
						'vgid' => $vgid->vgroup->vgid,
						'servid' => 0, // все услуги с servid=0
			            "unavail" => 0
					);
					
			        if( false != ($services = $this->lanbilling->get("getVgroupServices", array("flt" => $flt)))) {

			            if(!is_array($services)) {
			                $services = array($services);
			            }

						foreach($services as $service) {
							$data[] = array(
								'name' => '<a href="./index.php?r=services/selectservice&servid='.$service->servid.'&catidx='.$service->catidx.'&tarid='.$service->tarid.'&vgid='.$vgid->vgroup->vgid.'&agrmid='.$agrm->agrmid.'&cm='.$service->common.'">'. $service->catdescr .'</a>',
								'descr' => '',
								'cost' => sprintf("%.02f", $service->above)
							);								
						}
					}
				}
			}
			
			if(!empty($data)) {
				$html .= $this->grid(array(
					'title' => yii::t('main', 'Agreement') . ': ' . $agrm->number,
					'columns' => array(
						'name' => 'Service name',
						'descr' => 'Description',
						'cost' => 'Cost'
					),
					'data' => $data
				))->render();				
			}		
			
		}
	    $this->output($html);
	}
	
	
	/*
	* Страница, отображаемая при клике на услугу
	* На странице отображается информация по выбранной услуге
	*
	*/
	
	public function actionSelectService() {
		
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('services', 'Other services').': '.yii::t('services','Choose service');
        $this->breadcrumbs = array(
            Yii::t('services', 'Other services') => array('/services/index'),
			yii::t('services','Choose service'),
        );
		
		// Получаем список договоров
		$agreements = $this->lanbilling->clientInfo->agreements;
		
		// Забираем нужный договор
		foreach($agreements as $agrm) {
			if($agrm->agrmid == Yii::app()->request->getParam('agrmid', '')) {
				$agrmnum = $agrm->number;
			}
		}
		
		// Создаем фильтр для получения нужной УЗ
		$filter = array(
			'vgid' => Yii::app()->request->getParam('vgid', '')
		);
		
		// Получаем нужную УЗ
		$vgroups = $this->lanbilling->get("getClientVgroups", array("flt" => $filter));
		if(!empty($vgroups) && !is_array($vgroups)) $vgroups = array($vgroups);
		
		// Получаем название тарифа
		if(count($vgroups)>0) {
			$tariff = Yii::t('services', 'Tariff'). ': ' . $vgroups[0]->vgroup->tarifdescr;
		}
		
		// Далее запрашиваем список услуг на УЗ
		$srv_filter = array(
			"catidx" => Yii::app()->request->getParam('catidx', ''), 
			"tarid" => Yii::app()->request->getParam('tarid', ''), 
			"unavail" => 0
		);
		if(Yii::app()->request->getParam('cm', '') == 0) {
			$srv_filter['servid'] = 0;
		}

		$services = $this->lanbilling->get("getVgroupServices", array("flt" => $srv_filter));
		if(!empty($services) && !is_array($services)) $services = array($services);

		$data = array();

		if(count($services)>0) {
			// Перебираем список услуг в надежде найти нужную нам
			foreach($services as $service) {

				// Нашли! Генерируем данные в зависимости от состояния услуги
				if($service->servid == 0) {
					$action = '<a href="./index.php?r=services/selectdate&catidx='.$service->catidx.'&tarid='.$service->tarid.'&agrmid='.$agrm->agrmid.'&vgid='.$service->vgid.'">'.Yii::t('services', 'Activate').'</a>';
				} else {
					$action = '<a href="./index.php?r=services/index&stopservice='.$service->servid.'&agrm='.$agrm->agrmid.'&vgid='.$service->vgid.'">'.Yii::t('services', 'Deactivate').'</a>';
				}
			
				// ... и формируем массив с данными
				$data[] = array(
					'name' => $service->catdescr,
					'action' => $action,
					'startdate' => ($service->timefrom == $service->timeto) ? '' : $service->timefrom,
					'enddate' =>($service->timefrom == $service->timeto) ? '' : $service->timeto,
					'state' => ($service->servid>0) ? Yii::t('services', 'Service is activated') : Yii::t('services', 'Service is deactivated')
				);
			
			}
		}
		
		
			$html = '<h1>'.yii::t('services', 'Activate service').'</h1>';
			$html .= $this->grid(array(
				'title' => Yii::t('services', 'Agreement'). ': ' . $agrmnum . ' <br> ' . $tariff,
				'columns' => array(
					'name' => 'Service name',
					'action' => 'Action',
					'startdate' => 'Start date',
					'enddate' => 'End date',
					'state' => 'Service state'
				),
				'data' => $data
			))->render();

		
		// Отображаем список ранее подключенных услуг для РАЗОВЫХ услуг
		if(Yii::app()->request->getParam('cm', '') == 0) {
			
			$filter = array(
				"servid" => -1,
				"catidx" => Yii::app()->request->getParam('catidx', ''), 
				"tarid" => Yii::app()->request->getParam('tarid', ''), 
				"unavail" => 0
			);
			$result = $this->lanbilling->get("getVgroupServices", array("flt" => $filter));
			if(!empty($result) && !is_array($result)) $result = array($result);

			$data = array();
			
			if(count($result) > 0) {
				// Перебираем список услуг в надежде найти нужную нам
				foreach($result as $res) {
					$data[] = array(
						'name' => $res->catdescr,
						'startdate' => $res->timefrom
					);
				}

				$html .= $this->grid(array(
					'title' => Yii::t('services', 'Information about current service assigning'),
					'columns' => array(
						'name' => 'Service name',
						'startdate' => 'Start date',
					),
					'data' => $data
				))->render();
			}
			
			
		}
		
		
	    $this->output($html);
	}
	
	
	/*
	* Страница, отображаемая при клике на кнопку "Активировать"
	* На странице выводятся даты включения/отключения услуги
	*
	*/
	
	public function actionSelectDate() {
		
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('services', 'Other services').': '.yii::t('services','Choose service');
        $this->breadcrumbs = array(
            Yii::t('services', 'Other services') => array('/services/index'),
			yii::t('services','Choose service'),
			yii::t('services','Choose date')
        );
		
		$catidx = Yii::app()->request->getParam('catidx', '');
		$tarid = Yii::app()->request->getParam('tarid', '');
		
		$services = $this->lanbilling->get("getVgroupServices", array("flt" => array("catidx"=>$catidx, 'tarid'=>$tarid, "unavail" => 0)));
		if(!empty($services) && !is_array($services)) $services = array($services);
		
		$html = '<h1>'.yii::t('services', 'Choose start date').'</h1>';
		$html .= yii::t('services', 'Choosen service'). ': <b>' . $services[0]->catdescr . '</b>';
		
		$form = array(
			array(
				'type' => 'hidden',
				'name' => 'r',
				'value' => 'services/confirm'
			),
			array(
				'type' => 'hidden',
				'name' => 'catidx',
				'value' => Yii::app()->request->getParam('catidx', '')
			),
			array(
				'type' => 'hidden',
				'name' => 'tarid',
				'value' => Yii::app()->request->getParam('tarid', '')
			)
			
		);
		
		
		if($services[0]->common == 0) {
			$form[] = array(
				'type' => 'date',
				'name' => 'dtfrom',
				'value' => date('Y-m-d'),
				'label' => yii::t('services', 'Service start date')
			);
		} else {
			$form[] = array(
				'type' => 'servicePeriod',
				'label' => yii::t('services', 'Service active period'),
				'dtfrom' => date('Y-m-d'),
				'dtto' => ''
			);
		}
		
		
		$form[] = array(
			'type' => 'submit',
			'value' => yii::t('services', 'Save'),
		);
		
		$html .= $this->form($form)->method('post')->action($this->createUrl('services/confirm'))->render(); 		
			
		$html .= '<a href="./index.php?r=services/index">'.yii::t('services', 'Return to service list').'</a>';
		$this->output($html);
	}
	
	
	/*
	* Страница, отображаемая после установки дат действия услуги
	* Выводим форму подтверждения
	*
	*/
	
	public function actionConfirm() {
		
        $this->pageTitle = Yii::app()->name . ' - ' . yii::t('services', 'Other services').': '.yii::t('services','Choose service');' / '.yii::t('services','Choose date');
        $this->breadcrumbs = array(
            Yii::t('services', 'Other services') => array('/services/index'),
			yii::t('services','Choose service'),
			yii::t('services','Choose date')
        );
		
		$catidx = Yii::app()->request->getParam('catidx', '');
		$tarid = Yii::app()->request->getParam('tarid', '');
		
		$services = $this->lanbilling->get("getVgroupServices", array("flt" => array("catidx"=>$catidx, 'tarid'=>$tarid, "unavail" => 0)));
		if(!empty($services) && !is_array($services)) $services = array($services);
		
		$html = '<h1>'.yii::t('services', 'Service start date').'</h1>';
		$html .= yii::t('services', 'Choosen service') . ': <b>' . $services[0]->catdescr . '</b><BR>';
		
		
		
		
		$form = array(
			array(
				'type' => 'hidden',
				'name' => 'setservice',
				'value' => '1'
			),
			array(
				'type' => 'hidden',
				'name' => 'catidx',
				'value' => $catidx
			),
			array(
				'type' => 'hidden',
				'name' => 'tarid',
				'value' => $tarid
			),
			array(
				'type' => 'hidden',
				'name' => 'vgid',
				'value' => $services[0]->vgid
			)
		);
		
		if($services[0]->common == 0) {
			$html .= yii::t('services', 'Service will start on') . ': <b>' . Yii::app()->request->getParam('dtfrom', '') . '</b><BR>';
			$form[] = array(
				'type' => 'hidden',
				'name' => 'dtfrom',
				'value' => Yii::app()->request->getParam('dtfrom', '')
			);
		} else {
			$html .= yii::t('services', 'Service active period') . ': <b> с ' . Yii::app()->request->getParam('dtfrom', '') . ' по ' . Yii::app()->request->getParam('dtto', '') . '</b><BR>';
			$form[] = array(
				'type' => 'hidden',
				'name' => 'dtfrom',
				'value' => Yii::app()->request->getParam('dtfrom', '')
			);
			$form[] = array(
				'type' => 'hidden',
				'name' => 'dtto',
				'value' => Yii::app()->request->getParam('dtto', '')
			);
		}
		
		
		$form[] = array(
			'type' => 'submit',
			'value' => yii::t('services', 'Confirm'),
		);
		
		$html .= $this->form($form)->method('post')->action($this->createUrl('services/index'))->render(); 

			

		$html .= '<a href="./index.php?r=services/index">'.yii::t('services', 'Return to service list').'</a>';
		
		$this->output($html);
	}


	
}
