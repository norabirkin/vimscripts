<?php abstract class LBField {
	public function __construct( $conf ) {
		foreach( $conf as $k => $v ) {
			$method = 'set' . ucfirst($k);
			if( method_exists($this, $method) ) $this->$method( $v );
		}
	}
	public function isHidden() {
		return false;
	}
	abstract protected function getView();
	abstract protected function getData();
	public function render() {
		return yii::app()->controller->renderPartial('application.views.forms.fields.' . $this->getView(), $this->getData(), true);
	}
    public function is($name) {
        return false;
    }
    public function modifyName($function, $scope, &$data) {
    }
} ?>
