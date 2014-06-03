<?php class LBTextField extends LBFieldWithLabel {
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
	protected function getField() {
		return yii::app()->controller->renderPartial('application.views.forms.fields.text', array(
			'name' => $this->name,
			'value' => $this->value	
		), true);
	}
	public function getName() {
		return $this->name;
	}
    public function modifyName($function, $scope, &$data) {
        $this->name = $scope->$function($this->name, $data);
    }
} ?>
