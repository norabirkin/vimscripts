<?php 


class filterItem extends CWidget{
	protected $model;
	function init($model) {
		$this->model = $model;
		$this->getValue();
	}
}

class filterRow extends CWidget{
	private $label;
	private $items;
	private $model;
	function init($label,$model) {
		$this->label = $label;
		$this->model = $model;
	}
	public function addPeriod($dtfrom = 'dtfrom',$dtto = 'dtto') {
		$period = new filterPeriod;
		$period->init($dtfrom,$dtto,$this->model);
		$this->items[] = $period;
	}
	public function apply($params){
		foreach ($this->items as $item) $params = $item->apply($params);
		return $params;
	}
	public function addInput($name, $type, $label = '') {
		$this->items[] = new filterInput($name, $type, $label, $this->model);
	}
	public function output() {
		return $this->render('filter_row',array(
			'label' => $this->label,
			'items' => $this->items
		),true);
	}
}

class gridFilter extends CWidget {
	private $data;
	private $model;
	private $store;
	public function createRow($label = '') {
		$row = new filterRow;
		$row->init($label,$this->model);
		return $row;
	}
	public function addRow($row) {
		$this->data[] = $row;
	}
	function init($model,$store) {
		$this->model = $model;
		$this->store = $store;
	}
	function apply($params) {
		foreach ($this->data as $row) {
			$params = $row->apply($params);
		}
		return $params;
	}
	function output() {
		$html = '';
		foreach ($this->data as $row) {
			$html .= '<div class="form-line">'.$row->output().'</div>';
		}
		return $this->render('filter',array(
			'data' => $this->data,
			'store' => $this->store
		),true);
		return $html;
	}
} 

?>