<?php
class BillingmediationController extends Controller {
    public function actionList() {
        $agents = new Agents;
        $this->success( $agents->getPhoneFilter($this->param("agent_id")) ); 
    }
    public function actionSetfilter() {
        $agents = new Agents;
        $this->success( $agents->setPhoneFilter( $this->param("flt"), $this->param("agent_id") ) );
    }
} ?>
