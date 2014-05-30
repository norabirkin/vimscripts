<?php class getClientServFuncs extends LBModel {
	protected function getParams($type = 'default') {
		return array('flt' => array('unavail' => 1));
	}
	protected function selectRensoft($item) {
		return $item->savedfile == 'iframe_rentsoft';
	} 
} ?>