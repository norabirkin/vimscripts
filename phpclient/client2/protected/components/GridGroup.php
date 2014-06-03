<?php class GridGroup {
	private $grids = array();
	public function addGrid( $conf ) {
		$this->grids[] = new GridGroupItem( $conf );
	}
	public function render() {
		if (!$this->grids) return "";
		$grids = "";
		foreach( $this->grids as $grid ) {
			$grids .= $grid->render();
		}
		return yii::app()->controller->renderPartial( "application.components.views.grid_table", array(
			"rows" => $grids
		), true);
	}
} ?>
