<?php

class LB_DatePicker_Period extends LBFieldWithLabel {
    private $dtfrom;
    private $dtto;
    private $dttoName = 'dtto';
    private $dtfromName = 'dtfrom';
    private $defaultPeriod;
    protected function setDtfrom($value) {
        $this->dtfrom = (string) $value;
    }
    protected function setDtto($value) {
        $this->dtto = (string) $value;
    }
    public function setDtfromName($value) {
        $this->dtfromName = $value;
    }
    public function setDttoName($value) {
        $this->dttoName = $value;
    }
    protected function setDefaultPeriod($value) {
        $this->defaultPeriod = (string) $value;
    }
    private function getDefaultValue($param) {
        yii::import('application.components.datepicker.LB_DatePicker_DefaultValues');
        LB_DatePicker_DefaultValues::get($param, $this->defaultPeriod);
    }
    private function dtfrom() {
        if (!$this->dtfrom) {
            $this->dtfrom = $this->getDefaultValue('dtfrom');
        }
        return $this->dtfrom;
    }
    private function dtto() {
        if (!$this->dtto) {
            $this->dtto = $this->getDefaultValue('dtto');
        }
        return $this->dtto;
    }
    private function field($name, $value) {
        return yii::app()->controller->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name' => $name,
            'value' => $value,
            'language' => yii::app()->getLanguage(),
            'options' => array(
                'dateFormat' => 'yy-mm-dd'
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;width:90px;',
                'class'=>'input-text',
                'readonly'=>true,
            )
        ), true);
    }
    public function getField() {
        return yii::app()->controller->renderPartial('application.components.datepicker.views.period', array(
            'dtfrom' => $this->field($this->dtfromName, $this->dtfrom()),
            'dtto' => $this->field($this->dttoName, $this->dtto())
        ), true);
    }
    public function is($name) {
        return $name == $this->dttoName OR $name == $this->dtfromName;
    }
    public function modifyName($function, $scope, &$data) {
        $this->dttoName = $scope->$function($this->dttoName, $data);
        $this->dtfromName = $scope->$function($this->dtfromName, $data);
    }
}

?>
