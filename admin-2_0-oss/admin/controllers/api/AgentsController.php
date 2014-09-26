<?php
class AgentsController extends Controller{
    
    public function actionList() {
        $agents = new Agents;
        if ($this->getRequest()->getParam( 'agent_ids')) {
            $response = yii::app()->japi->callAndSend( "getAgents" );
            $result = array();
            $ids = explode( ",", $this->getRequest()->getParam( 'agent_ids'));
            foreach ($response as $item) {
                if (in_array($item["agent_id"], $ids)) {
                    $result[] = array(
                        "id" => $item["agent_id"],
                        "descr" => $item["name"]
                    );
                }
            }
            yii::app()->controller->success( $result );
        } else {
            $agents->getList();
        }
    }

    public function actionDtv() {
        $success = false;
        $agents = array();
        foreach (yii::app()->japi->callAndSend('getAgentOptions', array(
            'name' => 'use_cas'
        )) as $option) {
            if ((int) $option['value']) {
                $agents[] = yii::app()->japi->call('getAgent', array(
                    'agent_id' => $option['agent_id']
                ));
            }
        }
        if ($agents) {
            yii::app()->japi->send();
        }
        foreach ($agents as $agent) {
            if ($agent->isError()) {
                continue;
            } else {
                $success = true;
            }
        }
        $this->success($success);
    }

    public function actionOptions() {
        $agents = new Agents;
        $this->success( $agents->getOptions() ); 
    }

    public function actionEmul() {
        $agents = new Agents;
        $this->success( $agents->getRadiulEmulateAgents() ); 
    }

    public function actionTypes() {
        $agents = new Agents;
        $this->success( $agents->getTypes() );
    }
    
    public function actionUpdate() {
        $agents = new Agents;
        $this->success( $agents->saveAgent() );
    }

    public function actionCreate() {
        $agents = new Agents;
        $this->success( $agents->saveAgent() );
    }

    public function actionGet() {
        $this->success( yii::app()->japi->callAndSend( 'getAgent', array(
            "agent_id" => (int) $this->getRequest()->getParam( 'id', 0 )
        ))); 
    }
    
    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delAgent', array(
            "agent_id" => (int) $this->getRequest()->getParam('id', 0)
        )));
    }
    
} ?>
