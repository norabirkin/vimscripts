<?php class LBDateField extends LBFieldWithLabel {
	private $minDate;
	private $name;
	private $value;
	protected function setMinDate( $date ) {
		$this->minDate = $date;
	}
	public function setName( $name ) {
		$this->name = $name;
	}
	public function getName() {
		return $this->name;
	}
    public function is($name) {
        return $this->name == $name;
    }
	protected function setValue( $value ) {
		$this->value = $value;
	}
	protected function getField() {
		$options = array('dateFormat' => 'yy-mm-dd');
		if( $this->minDate ) $options["minDate"] = $this->minDate;
		$picker = yii::app()->controller->widget('zii.widgets.jui.CJuiDatePicker', array(
        		'language' => yii::app()->getLanguage(),
            		'name' => $this->name,
            		'value'=> $this->value,
			'options' => $options,
            		'htmlOptions'=>array(
                		'style'=>'height:20px;width:90px;',
                		'class'=>'input-text',
                		'readonly'=>true
            		)
        	),true);
		return yii::app()->controller->renderPartial('application.views.forms.fields.date', array('picker' => $picker), true);
	}
    public function modifyName($function, $scope, &$data) {
        $this->name = $scope->$function($this->name, $data);
    }
} ?>
