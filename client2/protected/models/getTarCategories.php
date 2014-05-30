<?php class getTarCategories extends LBModel {
	public $id;
	protected function getParams($type = 'default') {
		return array('id' => $this->id);
	}
} ?>
