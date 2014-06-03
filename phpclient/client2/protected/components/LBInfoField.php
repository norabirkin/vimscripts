<?php class LBInfoField extends LBField {
	private $text;
	public function setText( $text ) {
		$this->text = (string) $text;
	}
	public function getView() {
		return "info";
	}
	public function getData() {
		return array( "text" => $this->text );
	}
} ?>
