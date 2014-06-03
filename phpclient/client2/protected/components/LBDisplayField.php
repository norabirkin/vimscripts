<?php class LBDisplayField extends LBFieldWithLabel {
	private $text;
	protected function setText( $text ) {
		$this->text = (string) $text;
	}
	protected function getField() {
		return yii::app()->controller->renderPartial('application.views.forms.fields.display', array( 'text' => $this->text ), true);
	}
} ?>
