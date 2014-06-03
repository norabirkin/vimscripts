<?php class AdditionalConfrmStep extends WizardStep {
	public function getDescription() {
		$text = yii::app()->controller->getWizard()->getParam("act") ? "ConfirmAssign" : "ConfirmStop";
		return yii::t('DTVModule.additional', $text);
	}
	public function render() {
		$main = new Additional;
		$vg = $main->getVGData(yii::app()->controller->getWizard()->getParam("vgid"));
		$cat = $main->getCategory( $vg->vgroup->tarifid, yii::app()->controller->getWizard()->getParam("catidx") );
		Dumper::log($cat);
		$url = yii::app()->controller->getWizard()->getStepUrl(1);
		$form = $this->createForm(array(
			"items" => array(
				array(
					"type" => "display",
					"label" => yii::t("DTVModule.additional", "VGLogin"),
					"text" => $vg->vgroup->login
				),
				array(
					"type" => "display",
					"label" => yii::t("DTVModule.additional", "Tariff"),
					"text" => $vg->vgroup->tarifdescr
				),
				array(
					"type" => "display",
					"label" => yii::t("DTVModule.additional", "Service"),
					"text" => $cat->descr
				),
				array(
					"type" => "display",
					"label" => yii::t("DTVModule.additional", "Above"),
					"text" => Yii::app()->NumberFormatter->formatCurrency($cat->above, "RUB"),
				),
				array(
					"type" => "submit",
					"back" => yii::app()->controller->createUrl( $url["route"], $url["params"] )
				)
			)
		));
		return $form->render();
	}	
} ?>
