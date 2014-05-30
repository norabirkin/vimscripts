<?php class LBSubmitButton extends LBField {
	private $back;
	private $text;
	protected function setBack( $back ) {
		$this->back = (string) $back;
	}
	protected function setText( $text ) {
		$this->text = (string) $text;
	}
	protected function getView() {
		return 'submit';
	}
	private function getText() {
		if(!$this->text) $this->text = yii::t('tariffs_and_services', 'Save');
		return $this->text;
	}
	protected function getData() {
		return array(
			'text' => $this->getText(),
			'back' => $this->back
		);
	}
} ?>
