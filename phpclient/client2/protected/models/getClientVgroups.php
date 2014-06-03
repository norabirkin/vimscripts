<?php class getClientVgroups extends LBModel {
	public $vgid = 0;
	public $agrmid = 0;
	protected function getParams($type = 'default') {
		if ($this->vgid) {
			return array(
				'flt' => array( 'vgid' => $this->vgid )
			); 
		} elseif($this->agrmid) {
			return array(
				'flt' => array( 'agrmid' => $this->agrmid )
			);
		} else return array();
	}
} ?>