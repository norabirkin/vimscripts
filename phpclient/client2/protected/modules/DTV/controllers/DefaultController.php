<?php

class DefaultController extends Controller
{
	public function actionIndex()
	{
		$this->breadcrumbs = array(
			yii::t('menu','Television'),
			yii::t('menu','TVConnection')
		);
		$this->render('iframe_form',array(
			'url' => yii::app()->params['DTV_connection_form']
		));
	}
}