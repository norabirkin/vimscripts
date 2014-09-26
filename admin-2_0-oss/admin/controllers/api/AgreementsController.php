<?php
class AgreementsController extends Controller{
    
    public function actionList() {
        $params = array( "uid" => (int) $this->param("uid", 0) );
        $list = new OSSList( array("useSort" => false) );
        if ($this->param('property') AND $this->param('value')) {
            $params[$this->param('property')] = $this->param('value');
        }
        if ($this->param('query')) {
            $params["agrm_num"] = $this->param('query');
        }
        if ((string) $this->param('exclude_agrms')) {
            $params['exclude_agrms'] = array();
            foreach (explode(',', (string) $this->param('exclude_agrms')) as $item) {
                $params['exclude_agrms'][] = (int) $item;
            }
        }
        if ((int)$this->param('is_closed') > 0) {
            $params['is_closed'] = $this->param('is_closed') == 10 ? false : true;
        }
        $list->get( "getAgreements", $params );
    }

    public function actionAutoNumber() {
        $this->success(yii::app()->japi->callAndSend("getAutoAgreementNumber", array(
            "templ" => (string) $this->param('templ')
        )));
    }
    
    public function actionGet() {
        $this->success( yii::app()->japi->callAndSend( 'getAgreements', array(
            "agrm_id" => (int) $this->param( 'id', 0 )
        ))); 
    }
    
    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delAgreement', array(
            "agrm_id" => (int) $this->param('id', 0)
        )));
    }

    public function actionClose() {
        $this->success(yii::app()->japi->callAndSend( 'closeAgreement', array(
            'agrm_id' => (int) $this->param("agrm_id"),
            'close_date' => $this->param("close_date") . " 00:00:00"
        )));
    }

    public function actionSave() {
        $params = array(
            "agrm_id"             => (int) $this->param("agrm_id"),
            "payment_method"      => (int) $this->param("payment_method"),
            "uid"                 => (int) $this->param("uid"),
            "agrm_num"            => (string) $this->param("agrm_num"),
            "balance_status"            => (int) $this->param("balance_status"),
            "owner_id"            => (int) $this->param("owner_id"),
            "close_date"            => (string) $this->param("close_date"),
            "create_date"            => (string) $this->param("create_date"),
            "pay_code"            => (string) $this->param("pay_code"),
            "block_amount"            => (float) $this->param("block_amount"),
            "credit"            => (float) $this->param("credit"),
            "cur_id"            => (int) $this->param("cur_id"),
            "is_auto"            => (boolean) $this->param("is_auto"),
            "oper_id"            => (int) $this->param("oper_id"),
            "b_check"                 => (string) $this->param("b_check"),
            "b_limit"            => (float) $this->param("b_limit"),
            "b_notify"            => (int) $this->param("b_notify"),
            "balance_limit_exceeded"            => (string) $this->param("balance_limit_exceeded"),
            "balance_strict_limit"            => (float) $this->param("balance_strict_limit"),
            "block_days"            => (int) $this->param("block_days"),
            "block_months"            => (int) $this->param("block_months"),
            "block_orders"            => (int) $this->param("block_orders"),
            "friend_agrm_id"            => (int) $this->param("friend_agrm_id"),
            "month_block_day"            => (int) $this->param("month_block_day"),
            "order_payday"            => (int) $this->param("order_payday"),
            "parent_agrm_id"            => (int) $this->param("parent_agrm_id"),
            "priority"            => (int) $this->param("priority")
        );
        $this->success( yii::app()->japi->callAndSend('setAgreement', $params));
    }

    
    public function actionCloseAndDelete() {
        
        $close = yii::app()->japi->callAndSend( 'closeAgreement', array(
            'agrm_id' => (int) $this->param('agrm_id'),
            'close_date' => date('Y-m-d')
        ));
        
        $this->success( yii::app()->japi->callAndSend( 'delAgreement', array(
            "agrm_id" => (int) $this->param('agrm_id')
        )));
    }
    
    
    public function actionFindPromissedPayment() {
        $result = yii::app()->japi->callAndSend( 'getPromisePayments', array(
            'agrm_id' => (int) $this->param('agrm_id'),
            'payed' => 3
        ));
        if (!is_array($result)) {
            $result = array($result);
        }
        $this->success($result);
    }
    
} ?>
