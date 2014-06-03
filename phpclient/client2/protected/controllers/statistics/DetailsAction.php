<?php class DetailsAction extends CAction {
	protected $model;
	
	public function get_model($vgid,$type,$agrmid) {
		$model = Statistics::type($type);
        if (Statistics::$types[$type]['scope'] == 'vgroups') {
        	yii::import('application.models.Statistics.helpers.StatisticsVgroups');
        	$helper = new StatisticsVgroups;
			$vgroup = $helper->get_vgroup_details($type,$vgid);
        	$model->vgid = $vgid;
       	 	$model->login = $vgroup->login;
		} else {
			$model->agrmid = $agrmid;
			$model->login = yii::app()->controller->lanbilling->agreements[$agrmid]->number;
		}
        $dtfrom = yii::app()->SessionStore->get('dtfrom', 'stat_');
        $dtto = yii::app()->SessionStore->get('dtto', 'stat_');
		if (!$dtfrom && !$dtto) $model->defaultDate();
		else {
			$model->date['dtfrom'] = $dtfrom;
            $model->date['dtto'] = $dtto;
		}
        return $model;
    }
	public function addTotal( $event ){
		if( method_exists($this->model, 'getTotalRow') ) $event->params['data'][] = $this->formatTotalRow( $this->model->getTotalRow($event->params['data']) );
	}
	public function formatTotalRow( $row ) {
		foreach ( $row as $k => $v ) {
			if($v) $row[$k] = yii::t("statistics", "Total") . ": " . $v;
		}
		return $row;
	}
	public function getTotalData($data) {
		if( method_exists($this->model, 'getTotalRow') ) $total = $this->model->getTotalRow($data);
		else return array();
		$result = array();
		$columns = $this->model->getColumns();
		foreach( $total as $k => $v ) {
			if($v) $result[] = array( "name" => $columns[$k], "value" => $v );
		}
		return $result;
	}
	public function run($type, $vgid = 0, $agrmid = 0, $download = 0) {
		$model = $this->model = $this->get_model($vgid,$type,$agrmid);
        if (!$model) throw new CHttpException(404, Yii::t('statistics', 'NoVGroup'));
        yii::app()->controller->breadcrumbs=array(
            Yii::t('statistics','Statistics') => array('/statistics'),
            yii::t('statistics',Statistics::$types[$type]['class']) => array('/statistics/'.Statistics::$types[$type]['scope'],'type' => $type),
            Yii::t('statistics','StatisticDetailsForVGroup',array('{vglogin}' => $model->login))
        );
		yii::app()->controller->pageTitle = yii::app()->name . ' - ' . yii::t('statistics',Statistics::$types[$type]['class']) . ' | ' .  Yii::t('statistics','StatisticDetailsForVGroup',array('{vglogin}' => $model->login));
        $data = $model->getStatistics();
	yii::app()->grid->attachEventHandler("onCsvExport", array( $this, "addTotal" ));
        $grid = yii::app()->grid->get_grid($data,$model->getColumns(),true,'statistics',$download);
        if ($download) return;
        yii::import('application.models.Statistics.helpers.StatisticsDatePicker');
        $helper = new StatisticsDatePicker;
        $params = array(
        	'type' => $type,
            'model' => $model,
            'group_filter' => $model->getGroupFilter(),
            'date' => $model->date,
            'grid' => $grid,
            'title' => yii::t('statistics',Statistics::$types[$type]['class']),
	    'total' => $this->getTotalData($data),
            'dtfrom' => $helper->get_date_picker('dtfrom',$model),
            'dtto' => $helper->get_date_picker('dtto',$model)
        );
        if(!isset($_GET['ajax'])) yii::app()->controller->render('detail',$params);
        else  yii::app()->controller->renderPartial('detail',$params);
	}

} ?>
