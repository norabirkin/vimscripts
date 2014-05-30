<?php

class Accounts_Agreements extends LBWizardItem  {
    public function __construct() {
        ClientScriptRegistration::addScript('grid');
        ClientScriptRegistration::addScript('Details');
        ClientScriptRegistration::addScript('TarShape');
        ClientScriptRegistration::addScript('accounts');
    }
    private function data() {
        $result = array();
        foreach (yii::app()->lanbilling->agreements as $agrmid => $agreement) {
            $result[] = array(
                'services' => '<a class="show-vgroups" id="show-vgroups'.$this->id(array('agrmid' => $agrmid)).'" style="cursor:pointer;">'.
                    $this->t('Services').
                '</a>',
                'number' => '<strong>'.$agreement->number.'</strong>',
                'operator' => yii::app()->lanbilling->Operators[$agreement->operid]['name'],
                'balance' =>
                    '<a href="'.
                        yii::app()->controller->createUrl('payment/pay').
                    '">'.
                        $this->price($agreement->balance).
                    '</a>',
                'agrmid' => $agrmid
            );
        }
        return $result;
    }
    public function output() {
        return $this->grid(array(
            'title' => $this->t('Agreements'),
            'columns' => array(
                'number' => 'Agreement number',
                'operator' => 'Operator',
                'balance' => 'Balance',
                'services' => 'Services'
            ),
            'processor' => array($this, 'addRowClass'),
            'rowPrintedHandler' => array($this, 'addVgroupsContainer'),
            'data' => $this->data()
        ))->render();
    }
    private function id($row) {
        return '-' . $row['agrmid'];
    }
    public function addRowClass( $row, $table ) {
        $table->setRowClass('agreements-grid-row' . $this->id($row));
        return $row;
    }
    public function addVgroupsContainer( $row ) {
        return yii::app()->controller->renderPartial( 'application.components.accounts.views.container', array(
            'id' => $this->id($row)
        ), true);
    }
} 

?>
