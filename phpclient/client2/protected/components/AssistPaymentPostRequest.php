<?php class AssistPaymentPostRequest extends AssistPaymentRequest {
	public function SendRequest() {
		$form = $this->createForm();
		yii::app()->controller->renderPartial('AssistPaymentRequestForm',array(
			'form' => $this->createForm(),
			'js' => $this->GetJScripts()
		));
		die();
	}
	private function GetJScripts() {
		$output = '';
		Yii::app()->clientScript->registerCoreScript('jquery');
		Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/formautosubmit.js'); 
		Yii::app()->clientScript->render($output);
		return $output;
	}
	private function createForm() {
		$html = CHtml::beginForm($this->merchant_url,'post',array('id' => 'autosubmit'));
		foreach ($this->GetRequestData() as $k => $v) {
			$html .= CHtml::hiddenField($k, $v);
		}
		$html .= CHtml::endForm();
		return $html;
	}
} ?>