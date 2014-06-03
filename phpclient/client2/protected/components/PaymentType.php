<?php class PaymentType extends CApplicationComponent {
	protected $TypeName = '';
	protected $Title = '';
	protected $Description = '';
	protected $PaymentTypeConfigParam = '';
	protected $paymentTypeCode = '';
	protected $selectedAgreementNumber = '';
	protected function GetSelectedAgreementNumber() {
		if (!$this->selectedAgreementNumber) {
			$sumAndAgrmid = PromisedPaymentLogic::GetSumAndAgrmidFromRequest();
			$agrmid = $sumAndAgrmid['agrmid'];
			$this->selectedAgreementNumber = yii::app()->controller->lanbilling->agreements[$agrmid]->number;
		}
		return $this->selectedAgreementNumber;
	}
	protected function GetAgrmid() {
		$sumAndAgrmid = PromisedPaymentLogic::GetSumAndAgrmidFromRequest();
		return $sumAndAgrmid['agrmid'];
	}
	protected function IsTypeSelected() {
		return yii::app()->request->getParam('action',NULL) === $this->TypeName;
	}
	protected function Render($Template,$Paramerers) {
		return yii::app()->controller->renderPartial($Template,$Paramerers,true);
	}
	public function RenderBlock() {
		if (!yii::app()->params[$this->PaymentTypeConfigParam]) return '';
		return $this->Render('PaymentBlock',array(
			'SelectedClassOrEmptyString' => $this->IsTypeSelected() ? ' selected' : '',
			'Title' => Yii::t('payment', $this->Title),
			'Description' =>  Yii::t('payment', $this->Description),
			'paymentTypeCode' => $this->paymentTypeCode,
			'Content' => $this->RenderContent()
		));
	}
	protected function RenderTextAreaElement($name, $item) {
		$formElement = $this->Render('FormElement' , array(
			'inputElementName' => $name,
			'inputElementLabel' => yii::t('payment',$item['label']),
			'inputElement' => CHtml::textArea($name, '', array ('class' => 'payment-text-area', 'id' => $name )),
			'inputElementDescription' => yii::t('payment',$item['description'])
		));
		return $formElement;
	}
	protected function RenderTextInputElement($name, $item) {
		$formElement = $this->Render('FormElement' , array(
			'inputElementName' => $name,
			'inputElementLabel' => yii::t('payment',$item['label']),
			'inputElement' => CHtml::textField($name, '',array('class' => 'input-text', 'id' => $name)),
			'inputElementDescription' => yii::t('payment',$item['description'])
		));
		return $formElement;
	}
	protected function RenderRow($row) {
		return $this->Render('FormRow',array('row' => $row));
	}
	protected function RenderSubmitButton($name, $item) {
		return CHtml::submitButton(yii::t('payment',$item['label']));
	}
	protected function RenderFormRows() {
		$html = '';
		foreach($this->GetFormRowsData() as $name => $item) {
			$itemHtml = '';
			if ($item['type'] == 'text') $itemHtml = $this->RenderTextInputElement($name, $item);
			elseif ($item['type'] == 'textarea') $itemHtml = $this->RenderTextAreaElement($name, $item);
			elseif ($item['type'] == 'submitButton') $itemHtml = $this->RenderSubmitButton($name, $item);
			$html .= $this->RenderRow($itemHtml);
		}
		return $html;
	}
	protected function GetHiddenInputsData() {
		return array();
	}
	protected function PrintHiddenInputs() {
		$html = '';
		foreach($this->GetHiddenInputsData() as $name => $value) $html .=  CHtml::hiddenField($name, $value, array('class' => $name));
		return $html;
	}
	protected function RenderForm() {
		return $this->RenderFormRows() . $this->PrintHiddenInputs();
	}
	protected function RenderContent() {
		return '';
	}
} ?>