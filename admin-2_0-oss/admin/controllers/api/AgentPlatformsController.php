<?php

class AgentPlatformsController extends Controller {
    public function actionList() {
        $result = array();
        $agent = yii::app()->japi->call('getAgent', array(
            'agent_id' => (int) $this->param('agent_id')
        ));
        $platforms = yii::app()->japi->call('getPlatforms');
        $staff = yii::app()->japi->call('getPlatformsStaff');
        yii::app()->japi->send(true);
        $agent = $agent->getResult();
        $type = $agent['agent']['type'];
        foreach ($platforms->getResult() as $item) {
            $result[$item['platform_id']] = array(
                'platform_id' => $item['platform_id'],
                'name' => $item['name'],
                'descr' => $item['descr'],
                'agent_id' => (int) $this->param('agent_id'),
                'attached' => 0
            );
        }
        foreach ($staff->getResult() as $item) {
            if ($item['agent_id'] == ((int) $this->param('agent_id'))) {
                $result[$item['platform_id']]['attached'] = 1;
            } else {
                if ($item['agent_type'] == $type) {
                    unset($result[$item['platform_id']]);
                }
            }
        }
        $this->success(array_values($result));
    }
}

?>
