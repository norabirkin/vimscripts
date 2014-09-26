<?php

class PlatformsController extends Controller {
    public function actionList() {
        $list = new OSSList(array(
            'useSort' => false
        ));
        $list->get('getPlatforms');
    }
    public function actionCreate() {
        $this->set();
    }
    public function actionUpdate() {
        $this->set(true);
    }
    public function actionDeletelist() {
        $this->deleteList('delPlatform', 'platform_id');
    }
    private function set($update = false) {
        $params = array(
            'name' => (string) $this->param('name'),
            'descr' => (string) $this->param('descr')
        );
        if ($update) {
            $params['platform_id'] = (int) $this->param('platform_id');
        }
        $this->success(yii::app()->japi->callAndSend('setPlatform', $params));
    }
    public function actionAgents() {
        $agents = new AgentsTree;
        echo CJSON::encode($agents->get((int) $this->param('platform_id')));
    }
    public function actionStaff() {
        $this->success(
            yii::app()->japi->callAndSend(
                (
                    (int) $this->param('attached') ?
                    'setPlatformStaff' :
                    'delPlatformStaff'
                ),
                array(
                    'agent_id' => (int) $this->param('agent_id'),
                    'platform_id' => (int) $this->param('platform_id')
                )
            )
        );
    }
}

?>
