<?php
class RecalculationController extends Controller{
    private $agents;
    
    public function actionList() {
        $result = $this ->getAgents(true);
        $this->success( $result );
    }

    public function actionAgentsList() {
        $result = $this ->getAgents(false);
        $this->success( $result );
    }

    private function getAgents($isRecalcInProcess){
        if (!$isRecalcInProcess) {
            $this->requestAgents();
        }
        $agentsState = yii::app()->japi->call('getRecalcState');
        yii::app()->japi->send(true);
        $agentsState = $agentsState->getResult();
        if (!$isRecalcInProcess) {
            $this->getAgentsDetails();
        }
        $result = array(); 
        foreach ($agentsState as $item) {
            if ( $isRecalcInProcess == ($item["recalc_rent"] != 0 || $item["recalc_stat"] != 0)) {
                if (!$isRecalcInProcess) {
                    $item = $this->addAgentType($item);
                }
                $result[] = $item;
            }
        }
        return $result;
    }

    private function getAgentsDetails() {
        $agents = array();
        foreach ($this->agents->getResult() as $agent) {
            $agents[$agent['agent']['agent_id']] = $agent;
        }
        $this->agents = $agents;
    }

    private function addAgentType($agent) {
        $agent['agent_type'] = $this->agents[$agent['agent_id']]['agent']['type'];
        return $agent;
    }

    private function requestAgents() {
        $this->agents = yii::app()->japi->call('getAgentsExt');
    }
    
    public function actionStart() {
        $params = array(
            "agent_id"      => (int)$this->param("agent_id"),
            'recalc_date'   => (string)$this->param("recalc_date"),
            'recalc_group'  => (int)$this->param("recalc_group"),
            'recalc_rent'   => (int)$this->param("recalc_rent"),
            'recalc_stat'   => (int)$this->param("recalc_stat") + (int)$this->param("stat_tariff") + (int)$this->param("stat_owner")
        );
        $this->success( yii::app()->japi->callAndSend('startRecalc', $params));
    }
} ?>
