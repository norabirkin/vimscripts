<?php class BlockVGGrid extends BaseGrid {
	protected $messagesCategory = 'tariffs_and_services';
	protected $vgroups;
	protected $title;
	public function __construct( $conf ) {
		foreach( $conf as $k => $v ) {
			$method = 'set' . ucfirst( $k );
			if( method_exists( $this, $method ) ) $this->$method( $v );
		}
	}
	private function setVgroups($vgroups) {
		$this->vgroups = (array) $vgroups;
	}
	public function addVgroup( $vgroup ) {
		$this->vgroups[] = $vgroup;
	}
	public function setTitle( $title ) {
		$this->title = (string) $title;
	}
	private function getNextStepUrl( $vgid, $action ) {
		$url = yii::app()->controller->getWizard()->getNextStepUrl( array(
			'vgid' => $vgid,
			'action' => $action
		));
		return array_merge( array( $url["route"] ), $url["params"] );
	}
	private function getActionLink( $conf ) {
		return CHtml::link(yii::t('tariffs_and_services', $conf['text']), $this->getNextStepUrl( $conf["vgid"], $conf["action"] ));
	}
	private function getAction( $vgroup ) {
		if(isset($vgroup->blockrasp) AND $vgroup->blockrasp ) {
			return $this->getActionLink(array(
				"vgid" => $vgroup->vgroup->vgid,  
				"action" => 2,
				"text" => yii::app()->block->getCancelChangeStateText( $vgroup )
			));
		}
		if($vgroup->vgroup->blocked == 0) {	
				return $this->getActionLink(array( 
				"vgid" => $vgroup->vgroup->vgid,  
				"action" => 0,
				"text" => 'Block'
			));
		} 
		if( $vgroup->vgroup->blocked == 2 ) {
			return $this->getActionLink(array( 
				"vgid" => $vgroup->vgroup->vgid,  
				"action" => 1,
				"text" => 'Unblock'
			));
		}
		return null;
	}
	private function getStatus( $vgroup ) {
		if (isset($vgroup->blockrasp) AND $vgroup->blockrasp) $planed = "Planed";
		else $planed = "";
		return Yii::t('account', 'State' . $planed . $vgroup->vgroup->blocked);
	}
	protected function AddData() {
		foreach ($this->vgroups as $vgroup) {
			if(yii::app()->block->isVGroupAvailableForStateChanging($vgroup)) $this->AddRow(array(
				'VGroup' => $vgroup->vgroup->login,
				'Tariff' => $vgroup->vgroup->tarifdescr,
				'Agent' => $vgroup->vgroup->agentdescr,
				'Status' => $this->getStatus( $vgroup ),
				'Actions' => $this->getAction( $vgroup )
			));
		}
	}
} ?>
