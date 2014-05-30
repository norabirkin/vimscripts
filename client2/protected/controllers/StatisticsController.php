<?php class StatisticsController extends Controller {

    public function filters()
    {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_statistic'
            )
        ));
    }
    
    public function actionIndex()
    {
    	$this->pageTitle = Yii::app()->name.' - '.Yii::t('statistics', 'Statistics');
    	$this->breadcrumbs = array(
        	Yii::t('statistics', 'Statistics'),
    	);
        yii::import('application.models.Statistics.helpers.StatisticsVgroups');
        $helper = new StatisticsVgroups;
        $menu = $helper->getAvailableMenu();
        if(!isset($_GET['ajax'])) $this->render('menu',array('menu' => $menu));
        else  $this->renderPartial('menu',array('menu' => $menu));
    }
	
	public function actionAgreements($type) {
        yii::import('application.models.Documents.Agreements');
    	$agreements = new Agreements;
		$grid = $agreements->getGrid(array(
			'number' => Yii::t('statistics', 'AgreementNumber'),
			'balance' => yii::t('statistics', 'Balance')
		),'statisticsAgreementsList');
        $model = Statistics::type('base');
		$this->pageTitle = Yii::app()->name.' - '. yii::t('statistics',Statistics::$types[$type]['class']). ' | ' . Yii::t('statistics', 'ChooseAgreement');
        $this->breadcrumbs=array(
            Yii::t('statistics','Statistics') => array('/statistics'),
            yii::t('statistics',Statistics::$types[$type]['class'])
        );
        $params = array(
            'title_1' => yii::t('statistics',Statistics::$types[$type]['class']),
            'title_2' => Yii::t('statistics', 'ChooseAgreement'),
            'content' => $grid
        );
        if(!isset($_GET['ajax'])) $this->render('vgroups',$params);
        else  $this->renderPartial('vgroups',$params);
    }
    
    public function actionVgroups($type) {
        yii::import('application.models.Statistics.helpers.StatisticsVgroups');
        $helper = new StatisticsVgroups;
        $model = Statistics::type('base');
		$this->pageTitle = Yii::app()->name.' - '. yii::t('statistics',Statistics::$types[$type]['class']). ' | ' . Yii::t('statistics', 'ChooseVGroup');
        $this->breadcrumbs=array(
            Yii::t('statistics','Statistics') => array('/statistics'),
            yii::t('statistics',Statistics::$types[$type]['class']),
        );
        $vgroups = $helper->vgroup_list($type);
        $columns = array(
            'vgroup' => Yii::t('statistics','VGroup'),	
            'agrmid' => Yii::t('statistics','Agreement'),	
            'tarifdescr' => Yii::t('statistics','CurrentTariff'),	
            'servicerent' => Yii::t('statistics','Rent'),	
            'blocked' => Yii::t('statistics','State')
        );
		
        $grid = yii::app()->grid->get_grid($vgroups,$columns);
        $params = array(
            'title_1' => yii::t('statistics',Statistics::$types[$type]['class']),
            'title_2' => Yii::t('statistics', 'ChooseVGroup'),
            'content' => $grid
        );
        if(!isset($_GET['ajax'])) $this->render('vgroups',$params);
        else  $this->renderPartial('vgroups',$params);
    }

	public function actions() {
		return array(
			'details' => 'application.controllers.statistics.DetailsAction'
		);
	}
    
} ?>
