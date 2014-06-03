<?php class Agreements {
    private $accountsGrid;
    public function __construct() {
        $this->accountsGrid = new Accounts_Grid;
    }
    public function render() {
        ClientScriptRegistration::addScript( "grid" );
        ClientScriptRegistration::addScript( "agreements" );
        $grid = new Table(array(
            "title" => "Agreements",
            "emptyMessage" => "No agreements found",
            "localization" => "account",
            "rowPrintedHandler" => array( $this, "addVgroupsContainer" ),
            "processor" => array( $this, "addRowClass" ),
            "columns" => array(
                "number" => "Agreement number",
                "operator" => "Operator",
                "balance" => "Balance",
                "services" => "Services"
            ),
            "data" => $this->getData()
        ));
        return $grid->render(); 
    }
    public function getVgroups($agrmid, $page) {
        $flt = array( 
            "agrmid" => $agrmid,
            "userid" => yii::app()->controller->lanbilling->client
        );
        $total = yii::app()->controller->lanbilling->get("Count", array("flt" => $flt, "procname" => "getClientVgroups") );
        $vgroups = yii::app()->controller->lanbilling->getRows("getClientVgroups", array(
            "flt" => array_merge($flt, array(
                "pgnum" => $page,
                "pgsize" => yii::app()->params['paging']['default_limit'],
            ))
        ));
        $data = array();
        yii::import('application.components.agreements.Vgroups');
        foreach ($vgroups as $vgroup) {
            $VG = new Vgroups($vgroup);
            $data[] = $this->accountsGrid->data($VG, $vgroup);
        }
        return array( "rows" => $data, "total" => $total );
    }
    public function getVgroupsHeaders() {
        return $this->accountsGrid->headers();
    }
    public function addRowClass( $row, $table ) {
        $table->setRowClass("agreements-grid-row-" . $row["agrmid"]);
        return $row;
    }
    public function addVgroupsContainer( $row ) {
        return yii::app()->controller->renderPartial( "application.components.agreements.container", array(
            "agrmid" => $row["agrmid"],
            "count" => 4
        ), true);
    }
    private function getData() {
        $data = array();
        foreach (yii::app()->controller->lanbilling->agreements as $agreement) {
            $data[] = array(
                "agrmid" => $agreement->agrmid,
                "number" => "<strong>" . $agreement->number . "</strong>",
                "operator" => yii::app()->controller->lanbilling->Operators[$agreement->operid]['name'],
                "balance" => $this->getPaymentLink( $agreement ),
                "services" => $this->getVgroupsLink( $agreement->agrmid )
            );
        }
        return $data;
    }
    private function getPaymentLink($agreement) {
        return Yii::app()->NumberFormatter->formatCurrency($agreement->balance, Yii::app()->params['currency']) . 
			 ' (<a href="'.yii::app()->controller->createUrl('payment/index',array('id'=>$agreement->agrmid)).'">'.yii::t( "app", "Replenish the balance" ).'</a>)';
    }
    private function getVgroupsLink($agrmid) {
        return '<a style="cursor:pointer;" class="show-vgroups" id="' . $agrmid . '-show-vgroups">' . yii::t( "account", "Services" ) . '</a>';
    }
    public function getPager($params) {
        yii::import('application.components.agreements.VGPager');
        $pager = new VGPager($params);
        return $pager->getData();
    }
} ?>
