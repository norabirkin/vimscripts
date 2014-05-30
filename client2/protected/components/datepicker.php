<?php class datepicker {
	private $model;
	private $attribute;
	private $name;
	private $value;
	private $mindate;
	static public function get($config) {
		$me = new self($config);
		return $me->run();
	}
	function __construct($config) {
		$this->model = $config['model'];
		$this->attribute = $attribute = $config['attribute'];
		if ($config['value']) $this->value = $config['value'];
		else $this->value = ($this->model->$attribute) ? $this->model->$attribute : '';
		if ($config['name']) $this->name = $config['name'];
		else $this->name = $this->attribute;
		if ($config['minDate']) $this->mindate = $config['minDate'];
	}
	private function run() {
		$attribute = $this->attribute;
		$model = $this->model;
		$options = array('dateFormat' => 'yy-mm-dd');
		if ($this->mindate) $options['minDate'] = $this->mindate;
		return yii::app()->controller->widget('zii.widgets.jui.CJuiDatePicker', array(
        	'language' => yii::app()->getLanguage(),
            'model'=> $model,
            'name' => $this->name,
            'id'=> $attribute,
            'options' => $options,
            'value'=> $this->value,
            'htmlOptions'=>array(
                'style'=>'height:20px;width:90px;',
                'class'=>'input-text',
                'readonly'=>true,
            ),
        ),true);
	}
} ?>
