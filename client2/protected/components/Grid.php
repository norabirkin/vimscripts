<?php class Grid { 
	protected $title;
	protected $data;
	protected $columns;
	protected $localize;
	public function __construct($conf) {
		$this->setTitle( $conf["title"] );
		$this->setLocalize( $conf["localize"] );
		$this->setColumns( $conf["columns"] );
		$this->setData( $conf["data"] );
	}
	public function render() {
		$rows = yii::app()->controller->renderPartial( "application.components.views.grid_rows", array( 
			"rows" => $this->getContent(), 
			"columns" => $this->getHeaders()
		), true);
		$table = yii::app()->controller->renderPartial( "application.components.views.grid_table", array( "rows" => $rows ), true );
		return yii::app()->controller->renderPartial( "application.components.views.grid", array( 
			"grid" => $table, 
			"title" => $this->getTitle()
		), true);
	}
	protected function getTitle() {
		return yii::t( $this->localize, $this->title );
	}
	protected function getContent() {
		return $this->data ? $this->getRows() : $this->getEmptyGridMessageRow();
	}
	protected function getRows() {
		$rows = '';
		$odd = true;
		foreach ( $this->data as $item ) {
			$rows .= yii::app()->controller->renderPartial( "application.components.views.grid_row", array( 
				"columns" => $this->getRowData( $item ),
				"class" => $odd ? "odd" : "even"
			), true );
			$odd = !$odd;
		}
		return $rows;
	}
	protected function getRowData( $item ) {
		$rowData = array();
		foreach( $this->columns as $column ) $rowData[] = $this->getValue( $column, $item );
		return $rowData;
	}
	protected function getValue( $column, $item ) {
		if ( !is_string($column) ) throw new Exception( "invalid column" );
		if (!isset( $item[ $column ] )) throw new Exception( "no column data" );
		$value = $item[ $column ];
		if (!is_scalar( $value )) throw new Exception( "invalid data" );
		return $value;
	}
	protected function getEmptyGridMessageRow() {
		return yii::app()->controller->renderPartial( "application.components.views.grid_empty", array(
			"msg" => yii::t( $this->localize, "grid_empty" ),
			"columnscount" => count( $this->columns )
		), true);
	}
	protected function getHeaders() {
		$headers = array();
		foreach( $this->columns as $column ) $headers[] = yii::t( $this->localize, "col_" . $column );
		return $headers;
	}
	protected function setData( $data ) {
		if (!$data) $data = array();
		if (!is_array($data)) throw new Exception( "invalid data" );
		$this->data = $data;
	}
	protected function setColumns( $columns ) {
		if (!$columns OR !is_array( $columns )) throw new Exception( "no columns" );
		$this->columns = $columns;
	}
	protected function setLocalize( $localize ) {
		if ( !$localize OR !is_string("localize") ) throw new Exception( "no localize" );
		$this->localize = $localize;
	}
	protected function setTitle( $title ) {
		if (!$title) $title = "";
		if (!is_string( $title )) throw new Exception( "invalid title" );
		$this->title = $title;
	}
} ?>
