<?php class GridGroupItem extends Grid {
	public function render() {
		$rows = yii::app()->controller->renderPartial( "application.components.views.grid_rows", array( 
			"rows" => $this->getContent(), 
			"columns" => $this->getHeaders()
		), true);
		return yii::app()->controller->renderPartial( "application.components.views.grid_group_item", array( 
			"rows" => $rows, 
			"title" => $this->getTitle(),
			"columnscount" => count( $this->columns )
		), true);
	}
} ?>
