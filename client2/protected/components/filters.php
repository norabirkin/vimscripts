<?php class filters extends CWidget {
	public $data;
	public $store;
	public function run() {
		return $this->render('filters',array('data' => $this->data,'store' => $this->store));
	}
} ?>