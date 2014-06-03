<?php class CheckBalance extends CValidator {
	
	private $model;
	private $Tariff_ThatWasChoosen_ForChange;
	
	protected function validateAttribute($object,$attribute) {
		$this->init( $object, $attribute );
		$this->run();
	}
	
	private function init( $object, $attribute ) {
		$this->model = $object;
		$this->setTariff_ThatWasChoosen_ForChange();
	}
	
	private function run() {
		try {
			if ( !$this->isBalanceEnough_ForPayRent_ThatWasSet_ByNewTariff() ) {
				Yii::app()->session['service_tarname'] = $this->Tariff_ThatWasChoosen_ForChange->descr;
				yii::app()->controller->redirect(array('Services/Payment')); 
			}
		} catch ( Exception $e ) {
			yii::app()->controller->redirect(array('account/index'));
		}
	}
	
	private function isBalanceEnough_ForPayRent_ThatWasSet_ByNewTariff() {
		return $this->getPaymentAmount() <= $this->getBalance();
	}
	
	private function getPaymentAmount() {
		$amount = yii::app()->lanbilling->get("getRentAmount", array(
			"vgid" => $this->model->vgid,
			"tarid" => $this->model->tarid
		));
		return round( $amount );
		//if ( !$this->isPaymentSplit() ) return $this->Tariff_ThatWasChoosen_ForChange->rent;
		//else return $this->getDailyPayment();	
	}
	
	private function getDailyPayment() {
		round( $this->Tariff_ThatWasChoosen_ForChange->rent / $this->getNumberOfDaysInNextMonth() );
	}
	
	private function isPaymentSplit() {
		return $this->Tariff_ThatWasChoosen_ForChange->dailyrent;
	}
	
	private function getNumberOfDaysInNextMonth() {
		$month = date('n');
        $year = date('Y');
        if ($month == 12) {
            $next_month = 1;
            $year = $year+1;
        }	else $next_month = $month + 1;
		return cal_days_in_month(CAL_GREGORIAN, $next_month, $year);
	}
	
	private function setTariff_ThatWasChoosen_ForChange() {
		if ( !$tariff = yii::app()->controller->lanbilling->get('getTarif',array('id' => $this->model->tarid)) ) throw new Exception( 500, "tariff was not found" );
		$this->Tariff_ThatWasChoosen_ForChange = $tariff->tarif;
	}
	
	private function getBalance() {
		$agreement = yii::app()->controller->lanbilling->agreements[$this->model->get_vgdata()->vgroup->agrmid];
		return round( $agreement->balance + $agreement->credit );
	}
	
} ?>
