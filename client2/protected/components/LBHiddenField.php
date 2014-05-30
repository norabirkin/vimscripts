<?php class LBHiddenField extends LBField {
	private $name;
	private $value;
	public function setName( $name ) {
		$this->name = (string) $name;
	}
    public function is($name) {
        return $this->name == $name;
    }
	protected function setValue( $value ) {
		$this->value = $value;
	}
	public function isHidden() {
		return true;
	}
	protected function getView() {
		return 'hidden';
	}
	protected function getData() {
		return array(
			'name' => $this->name,
			'value' => $this->value	
		);
	}
	public function getName() {
		return $this->name;
	}
    public function modifyName($function, $scope, &$data) {
        $this->name = $scope->$function($this->name, $data);
    }
} ?>
