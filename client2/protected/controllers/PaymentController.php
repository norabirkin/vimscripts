<?php
//error_reporting(7);

class PaymentController extends Controller
{
    public $status = array(
        '-1' => 'Просрочен',
        '0'  => 'Действует',
        '1'  => 'Оплачен'
    );

    public function init() {
        parent::init();
        yii::import('application.components.payment.cards.*');
        yii::import('application.components.payment.moscow.*');
        yii::import('application.components.payment.yandex.*');
        yii::import('application.components.payment.*');
    }
    public function filters()
    {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_payments'
            )
        ));
    }

    /**
     * This action allows users to get all payment options
    */
     
    public function actionTest() {
    	echo '<meta charset="utf-8">';
    	Dumper::dump($_POST);
    }

    public function actionSuccess() {
        Yii::app()->user->setFlash('success', Yii::t('main', 'Successfull payment'));
        $this->redirect(array('payment/index'));
    }

    public function actionFail() {
        Yii::app()->user->setFlash('error', Yii::t('main', 'Failed to pay'));
        $this->redirect(array('payment/index'));
    }
     
    public function actionResult() {
		$success = $this->lanbilling->get("confirmPrePayment", array(
			"recordid" => yii::app()->request->getParam("ordernumber"),
			"receipt" => yii::app()->request->getParam("billnumber")
		));
		if ($success) {
			$error = '';
			$assist = new AssistConfirm;
			$result = $assist->request( yii::app()->request->getParam("billnumber") );
			$params = array();
			if ($result->isError()) {
				$title = yii::t('payment', 'ConfirmError');
				yii::app()->user->setFlash( "error", $result->getErrorType() . ': "' . $result->getErrorDetail() . '"' );
				$error = yii::t("payment", "Error");
			} else {
				$title = yii::t( "payment", "ConfirmSuccess" );
				yii::app()->user->setFlash( "success", $result->getParam("message") );
				$params = array ( 
					$result->getParamDescr("firstname") => $result->getParam("firstname"),
					$result->getParamDescr("lastname") => $result->getParam("lastname")
				);
				if ( $result->getParam("middlename") ) $params[ $result->getParamDescr("middlename") ] = $result->getParam("middlename");
				$params = array_merge( $params, array(
					$result->getParamDescr("email") => $result->getParam("email"),
					$result->getParamDescr("amount") => Yii::app()->NumberFormatter->formatCurrency($result->getParam("amount"), Yii::app()->params["currency"]),
				));
				if ( $result->getParam("comment") ) $params[ $result->getParamDescr("comment") ] = $result->getParam("comment");
				$params = array_merge( $params, array(
					$result->getParamDescr("orderdate") => $result->getParam("orderdate"),
					$result->getParamDescr("cardholder") => $result->getParam("cardholder"),
					$result->getParamDescr("meantypename") => $result->getParam("meantypename"),
					$result->getParamDescr("meannumber") => $result->getParam("meannumber"),
					$result->getParamDescr("issuebank") => $result->getParam("issuebank"),
					$result->getParamDescr("bankcountry") => $result->getParam("bankcountry")
				));
			}
		} else {
			$title = yii::t('payment', 'ConfirmError');
			$error = yii::t("payment", "Error");
			yii::app()->user->setFlash( "error", $error );
		}
		$this->breadcrumbs = array(
            		yii::t('payment','ServicePayment') => array("/payment"),
            		yii::t('payment','PaymentConfirm') => array(
				"payment/assist", 
				"billnumber" => yii::app()->request->getParam("billnumber"),
				"ordernumber" => yii::app()->request->getParam("ordernumber"),
				"payerdenial" => yii::app()->request->getParam("payerdenial")
			),
			$title
        	);
        	$this->pageTitle = yii::app()->name . ' - ' . $title;
		$this->render("assistConfirm", array(
			"title" => $title,
			'data' => $params,
			'form' => $error
		));
    }

    /*public function actionAssist( $billnumber, $ordernumber, $payerdenial ) {
		$title = Yii::t('payment', 'PaymentConfirm');
		$this->breadcrumbs = array(
            		yii::t('payment','ServicePayment') => array("/payment"),
			$title
        	);
        	$this->pageTitle = yii::app()->name . ' - ' . $title;
		$prepayment = $this->lanbilling->get("getPrePayments", array(
			"flt" => array( "recordid" => $ordernumber )
		));
		$amount = $prepayment->amount;
		$agreement = $this->lanbilling->agreements[ $prepayment->agrmid ];
		if ($agreement) $agreement = $agreement->number;
		$form = new LBForm(array(
			"items" => array(
				array(
					"type" => "hidden",
					"name" => "r",
					"value" => "payment/result"
				),
				array(
					"type" => "hidden",
					"value" => $payerdenial,
					"name" => "payerdenial"
				),
				array(
					"type" => "hidden",
					"value" => $ordernumber,
					"name" => "ordernumber"
				),
				array(
					"type" => "hidden",
					"value" => $billnumber,
					"name" => "billnumber"
				),
				array(
					"type" => "display",
					"label" => yii::t('payment', 'Agreement'),
					"text" => $agreement
				),
				array(
					"type" => "display",
					"label" => yii::t('payment', 'PaymentSum'),
					"text" => Yii::app()->NumberFormatter->formatCurrency($amount, Yii::app()->params["currency"])
				),
				array(
					"type" => "submit",
					"text" => yii::t("tariffs_and_services", "Confirm")
				)
			)
		));
		$this->render("assistConfirm", array(
			"title" => $title,
			'form' => $form->render()
		));
    }*/

    public function actions() {
        return array(
            'assistconfirm' => 'application.components.payment.assist.Payment_Assist_Confirm_Action',
            'assist' => 'application.components.payment.assist.Payment_Assist_Action',
            'moscow' => 'application.components.payment.moscow.Payment_Moscow_Action',
            'promised' => 'application.components.payment.promised.Payment_Promised_Action',
            'history' => 'application.components.payment.history.Payment_History_Action',
            'paymaster' => 'application.components.payment.paymaster.Payment_Paymaster_Action',
            'webmoney' => 'application.components.payment.webmoney.Payment_Webmoney_Action',
            'chronopay' => 'application.components.payment.chronopay.Payment_Chronopay_Action',
            'cards' => 'application.components.payment.cards.Payment_Cards_Action',
            'yandex' => 'application.components.payment.yandex.Payment_Yandex_Action'
        );
    }

    public function actionPay() {
        $this->output($this->getPage()->menu());
    }

    public function actionIndex() {
        $this->output($this->getPage()->menu());
    }

    /*public function actionIndex() {
    	
		if (yii::app()->request->getParam('paytype','') == 'as') {
			try {
				AssistPaymentRequest::run();
			} catch (Exception $e) {
				Yii::app()->user->setFlash('error',Yii::t('payment',$e->getMessage()));
			}
		}
		
		$this->breadcrumbs = array(
            yii::t('payment','ServicePayment')
        );
        $error = false;
        if (empty($this->lanbilling->agreements)){
            $error = true;
        }
        $this->pageTitle = yii::app()->name . ' - ' . Yii::t('payment', 'ServicePayment');
        $sum = $agr = 0;
        $code = '';
        $serial = '';
		
		
		

            $action = Yii::app()->request->getParam("action", "");
            if (!empty($action)) {

                switch ($action) {

                    // perform activation cards 
                    case "card":

                        if (!yii::app()->params['payment_cards']) $this->redirect(array('account/index'));
                        
                        $code   = preg_replace("~\s~", "", Yii::app()->request->getParam("card_code", "") );
                        $serial = preg_replace("~\s~", "", Yii::app()->request->getParam("card_serial", "") );

                        $agrm = Yii::app()->request->getParam("card_agrm", 0);

                        if ($code && $serial && $agrm) {

                            $_struct = array(
                                "agrm"   => $agrm,
                                "key"    => $code,
                                "serial" => $serial
                            );
                            if( false != ($result = $this->lanbilling->get("actClientCard", $_struct, true))) {
                                $this->lanbilling->flushCache(array("getClientAccount"));
                                Yii::app()->user->setFlash('success',Yii::t('payment','PaymentCardAccepted'));
                                $this->redirect(array('payment/index'));
                            } else {
                                Yii::app()->user->setFlash('error',Yii::t('payment','PaymentCardNotAccepted'));
                            }
                        }

                        if ($agrm) {
                            $agrm = $this->lanbilling->agreements[$agrm];
                        }
                    break;


                    // perform promised payment
                    case "promised":
                        
                        if (!yii::app()->params['payment_promised']) $this->redirect(array('account/index'));
                        
                        foreach (Yii::app()->request->getParam("promised_sum", array()) as $key => $s) {
                            if ($s) {
                                $sum = $s;
                                $agrm = Yii::app()->request->getParam("promised_agrm", array());
                                $agrm = $agrm[$key];
                            }
                        }
                        
                        if ($sum && $agrm) {
                             $promised_settings = $this->lanbilling->get("getClientPPSettings", array("agrm" => $agrm), true);
                             if ($promised_settings->promiserent) {
                                 $vgroups = $this->lanbilling->get("getClientVgroups", array(),true);
                                 if (!is_array($vgroups)) $vgroups = array($vgroups);
                                 foreach ($vgroups as $g) {
                                    $rents[$g->vgroup->agrmid][] = $g->vgroup->servicerent;
                                }
                                if (isset($rents[$agrm])) {
                                    $max_rent = max($rents[$agrm]);
                                    if ($max_rent > 0) $rent_check = ($sum <= $max_rent);
                                    else $rent_check = true;
                                } else $rent_check = true;
                             } else $rent_check = true;
							 
							 $rent_check = true;
                             
                             if ($rent_check) $resP = $this->lanbilling->get("ClientPromisePayment",  array("agrm" => $agrm, "summ" => $sum), true);
                             else $resP = false;
                            
                            if ($resP) {
                                Yii::app()->user->setFlash('success',Yii::t('payment', 'PaymentPromisedSent'));
                                $this->lanbilling->flushCache(array("getClientAccount", "getClientPromisePayments"));
                                $this->redirect(array('payment/index'));
                            } else {
                                 if ($sum < $promised_settings->promisemin) {
                                    Yii::app()->user->setFlash('error',Yii::t('payment', 'Sum must be more than') . " " . $promised_settings->promisemin);
                                    $this->redirect(array('payment/index'));
                                 }
                                 elseif ($sum > $promised_settings->promisemax) {
                                    Yii::app()->user->setFlash('error',Yii::t('payment', 'Sum must be less than') . " " . $promised_settings->promisemax);
                                    $this->redirect(array('payment/index'));
                                 }
                                Yii::app()->user->setFlash('error',Yii::t('payment', 'PaymentPromisedNotSent'));
                        } else {
                            //$this->message = Yii::t('app', 'Ошибка при проведении отложенного платежа');
                            Yii::app()->user->setFlash('error',Yii::t('app','Ошибка при проведении отложенного платежа'));
                        }

                    break;
                }
            }

            // get all promised payments 
            $this->lanbilling->promised = $this->lanbilling->get("getClientPromisePayments",array(),true);
            $this->lanbilling->promised = is_array($this->lanbilling->promised) ? $this->lanbilling->promised : array($this->lanbilling->promised);       
            // get settings for promised payments 
            $this->lanbilling->settings = array();
            $promiserent = 0;
            
            $rents = NULL;
            
            foreach ($this->lanbilling->agreements as $agreement) {
                if ($agreement->number) {
                    @$this->lanbilling->psettings[$agreement->agrmid] = $this->lanbilling->get("getClientPPSettings", array("agrm" => $agreement->agrmid), true);
                    @$this->lanbilling->psettings[$agreement->agrmid]->symbol = $agreement->symbol;
                    @$this->lanbilling->psettings[$agreement->agrmid]->number = $agreement->number;
                    $payments = array();
                    foreach ($this->lanbilling->promised as $promised) {
                        if (isset($promised->agrmid)){
                            if ($promised->agrmid == $agreement->agrmid) {
                                $payments[] = $promised;
                            }
                        }
                    }
                    $this->lanbilling->psettings[$agreement->agrmid]->payments = $payments;
                    $promiserent = @$this->lanbilling->psettings[$agreement->agrmid]->promiserent;
                    if ($promiserent) {
                        if ($rents === NULL) {
                            $rents = array();
                            $vgroups = $this->lanbilling->get("getClientVgroups", array(),true);
                            if (!is_array($vgroups)) $vgroups = array($vgroups);
                            foreach ($vgroups as $g) {
                                $rents[$g->vgroup->agrmid][] = $g->vgroup->servicerent;
                            }
                        }
                    }
                }
            }
            
            
            $this->render('payment', array(
            		'PromisedPayment' => yii::app()->PromisedPayment->RenderBlock(),
            		'WebmoneyPayment' => yii::app()->WebmoneyPayment->RenderBlock(),
            		'PaymasterPayment' => yii::app()->PaymasterPayment->RenderBlock(),
            		'AssistPayment' => yii::app()->AssistPayment->RenderBlock(),
                    'AGRM' => empty($agrm) ? NULL : $agrm,
                    'action' => $action,
                    'sum' => $sum,
                    'code' => htmlentities( $code ),
                    'serial' => htmlentities( $serial ),
                    'error' => $error,
                    'rents' => $rents
                )
            );
    }*/
}
