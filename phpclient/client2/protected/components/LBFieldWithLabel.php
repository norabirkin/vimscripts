<?php class LBFieldWithLabel extends LBField {
	private $label;
	protected function setLabel( $label ) {
		$this->label = (string) $label;
	}
	protected function getView() {
		return 'withlabel';
	}
	protected function getData() {
		return array(
			'label' => $this->label,
			'field' => $this->getField()
		);
	}
} ?>
