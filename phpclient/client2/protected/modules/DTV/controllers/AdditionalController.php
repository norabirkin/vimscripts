<?php class AdditionalController extends Controller {
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_television'
            )
        ));
    }
	public function setWizard( Wizard $wizard ) {
		$this->wizard = $wizard;
	}
	public function getWizard() {
		return $this->wizard;
	}
	public function actionIndex() {
		$widget = yii::app()->controller->createWidget('Wizard', array(
			'step' => yii::app()->request->getParam( 'step', 1 ),
			'title' => Yii::t('tariffs_and_services', 'AdditionalServices'),
			'route' => 'Additional/index',
			'steps' => array(
				new AddtionalVgroupsStep,
				new AdditionalSevricesStep,
				new AdditionalConfrmStep
			)
		));
		$widget->setFinalStep( new AdditionalFinalStep );
		$this->setWizard($widget);
		$this->render("application.views.services.block", array(
			"content" => $widget->run()
		));
	}
} ?>
