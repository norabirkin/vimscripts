<?php
class InvoiceController extends Controller {
	public function init() {
		parent::init();
		yii::import('application.components.payment.*');
		yii::import('application.components.invoice.charges.*');
		yii::import('application.components.statistics.*');
	}
	
    /**
     * Invoices menu. Main page.
     */
    public function actionIndex()
    {
    	$this->output($this->getPage()->menu());
    } 
       
    public function actionInfo()
    {
    	$data = $this->getAgreementsWithCharges();
    	$toRender = '';
    	
    	foreach($data as $agrm) {
    		$toRender .= $this->grid(array(
    			'title' => $agrm['number'],
    			'columns' => array(
    				'name' => '',
    				'value' => array(
                        'title' => '',
                        'width' => '33%'
                    )
    			),
    			'data' => $agrm
    		))->render();
    	}
    	$this->output($toRender);
    }
    
    public function actions() {
    	return array(
    		'charges' => 'application.components.invoice.charges.Invoice_Charges_Action'
    	);
    }
    
    private function getPaymentLink($agreement) {
        return Yii::app()->NumberFormatter->formatCurrency($agreement->balance, Yii::app()->params['currency']) . 
			 ' (<a href="'.yii::app()->controller->createUrl('payment/index',array('id'=>$agreement->agrmid)).'">'.yii::t( "main", "Replenish the balance" ).'</a>)';
    }
    
    private function getChargesOnAgreements($dtfrom, $dtto){
    	$_charges = array();
    	$rawChargesData = yii::app()->lanbilling->get('getClientStat', array(
    		'flt' => array (
    			'repnum' => 1,
    			'dtfrom' => $dtfrom,
    			'dtto' => $dtto,
    			'repdetail' => 0,
    			"userid" => Yii::app()->user->getId()
    		),
    		'ord' => array(
    			'name'    => 'period',
    			'ascdesc' => 1
    		)
    	));
    	 
    	$chargesData = yii::app()->lanbilling->dataCombine($rawChargesData->names->val, $rawChargesData->data);
    	foreach ($chargesData as $item )  {
    		$_charges[$item['agrm_id']] += $item['amount'];
    	}
    	return $_charges;
    }
    
    private function getPaymentsOnAgreements($dtfrom, $dtto){
    	$_payments = array();
	    $paymentsData = yii::app()->lanbilling->getRows('getClientPayments', array(
            'flt' => array(
                'userid' => Yii::app()->user->getId(),
                'dtfrom' => $dtfrom,
                'dtto' => $dtto
            )
        ));
	    foreach ($paymentsData as $item )  {
	    	$_payments[$item->pay->agrmid] += $item->pay->amount;
	    }
	    return $_payments;
    }
    
    protected function getFormattedAmount($value){
    	return Yii::app()->NumberFormatter->formatCurrency($value, Yii::app()->params['currency']);
    } 
    
    private function getAgreementsWithCharges(){
    	
	    $dt_currDay_currMonth = date("Y-m-d");
        $dt_nextDay_currMonth = date('Y-m-d H:i:s',strtotime('+1 day'));
	    $dt_firstDay_currMonth = date("Y-m-d", mktime(0, 0, 0, date("m"), 1, date("Y")));
	    $dt_firstDay_prevMonth = date("Y-m-d", mktime(0, 0, 0, date("m")-1, 1, date("Y")));
	    $dt_lastDay_prevMonth = date('Y-m-d', strToTime('1/1 next year -1 day'));
	     
	    $_prevMonthCharges = $this->getChargesOnAgreements($dt_firstDay_prevMonth, $dt_lastDay_prevMonth);
	    $_currMonthCharges = $this->getChargesOnAgreements($dt_firstDay_currMonth, $dt_currDay_currMonth);
	    $_monthPayments = $this->getPaymentsOnAgreements($dt_firstDay_currMonth, $dt_nextDay_currMonth);
	    
	    $data = array();
	    foreach (yii::app()->controller->lanbilling->agreements as $agrm){
	    	$data[] = array(
	    		
    			array (
    				'name' => Yii::t("main","Balance"),
    				'value' => $this->getPaymentLink( $agrm )
    			),
	    		array (
	    			'name' => Yii::t("main","Payments in current month"),
	    			'value' => $this->getFormattedAmount($_monthPayments[$agrm->agrmid])
	    		),
    			array (
    				'name' => CHtml::link(Yii::t("main","Charges in current month"), array(
                        'invoice/charges',
                        'step' => 1,
                        'params' => array(
                            1 => array(
                                'agrmid' => $agrm->agrmid
                            ) 
                        )
                    )),
    				'value' => $this->getFormattedAmount($_currMonthCharges[$agrm->agrmid])
    			),
	    		
	    		'number' =>  $agrm->number,
	    	);
	    }
	    return $data;
    }
    
}
