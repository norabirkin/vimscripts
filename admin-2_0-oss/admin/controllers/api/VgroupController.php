<?php 
class VgroupController extends Controller{
    
    public function actionList() {
        $params = array(
            'is_template' => (bool) $this->param('is_template'),
            'address' => (string) $this->param('address'),
            'name' => (string) $this->param('name'),
            'agrm_num' => (string) $this->param('agrm_num'),
            'card_key' => (string) $this->param('card_key'),
            'descr' => (string) $this->param('descr'),
            'equip_chipid' => (string) $this->param('equip_chipid'),
            'equip_mac' => (string) $this->param('equip_mac'),
            'equip_serial' => (string) $this->param('equip_serial'),
            'ip' => (string) $this->param('ip'),
            'pay_code' => (string) $this->param('pay_code'),
            'phone' => (string) $this->param('phone'),
        );
        if ($this->param('query')) {
            $params['login'] = $this->param('query');
        }
        if ((string) $this->param('login')) {
            $params['login'] = (string) $this->param('login');
        }
        if ($this->param('in_group')) {
            $params['in_group'] = (integer)$this->param('in_group');
        }
        if ($this->param('not_in_group')) {
            $params['not_in_group'] = (integer)$this->param('not_in_group');
        }

        if ($this->param('search_field') && $this->param($this->param('search_field'))) {
            $params[$this->param('search_field')] = (integer) $this->param($this->param('search_field'));
        } else if ($this->param('search_field') && $this->param('search_field_value')) {
            $params[$this->param('search_field')] = (string) $this->param('search_field_value');
        }

        if ((int) $this->param('uid')) {
            $params['uid'] = (int) $this->param('uid');
        }

        if ((int) $this->param('agent_type')) {
            $params['agent_type'] = (int) $this->param('agent_type');
        }
        
        if ($this->param('agent_types')) {
            switch((int)$this->param('agent_types')) {
                case 0: 
                    $agentTypes = array();
                break;
                case 1: 
                    $agentTypes = array(1,2,3,4,5,6,14);
                break;
                case 2: 
                    $agentTypes = array(7);
                break;
                case 3: 
                    $agentTypes = array(12);
                break;
                case 4: 
                    $agentTypes = array(13);
                break;
            }
            $params['agent_types'] = $agentTypes;
        }

        $accounts = new OSSList( array("useSort" => false) );
        $accounts->get( 'getVgroups', $params );
    }

    public function actionGet() {
        $vgroup = yii::app()->japi->call('getVgroupExt', array(
            'vg_id' => (int) $this->param('id')
        ));
        $permissions = UserIdentity::getPermissions();
        $manager = yii::app()->japi->call('getManagers', array(
            'person_id' => $permissions['person_id']
        ));
        yii::app()->japi->send(true);
        $manager = $manager->getResult();
        $this->success($this->processVgroup($vgroup->getResult(), $manager[0]));
    }
    
    private function processVgroup($vgroup, $manager) {
        if (!$vgroup OR !$manager) {
            return null;
        }
        $vgroup['address'] = $vgroup['addresses'] ? CJSON::encode($vgroup['addresses'][0]) : '';
        $vgroup = FakePassword::get($vgroup, $manager);
        return $vgroup;
    }

    public function actionDeletelist() {
        $this->deleteList('delVgroup', 'vg_id');
    }
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setVgroupExt', array(
            'agent_id' => (int) $this->param('agent_id'),
            'agrm_id' => (int) $this->param('agrm_id'),
            'connected_from' => (int) $this->param('connected_from'),
            'cu_id' => (int) $this->param('cu_id'),
            'descr' => (string) $this->param('descr'),
            'ip_det' => (int) $this->param('ip_det'),
            'login' => (string) $this->param('login'),
            'max_sessions' => (int) $this->param('max_sessions'),
            'parent_vg_id' => (int) $this->param('parent_vg_id'),
            'pass' => (string) $this->param('pass'),
            'port_det' => (int) $this->param('port_det'),
            'shape' => (int) $this->param('shape'),
            'address' => ((string) $this->param('address')) ? CJSON::decode
                ((string) $this->param('address'),
                true
            ) : null,
            'tar_schedules' => ((string) $this->param('tar_schedules')) ? array($this->processTarSchedule(CJSON::decode(
                ((string) $this->param('tar_schedules')),
                true
            ))) : null
        )));
    }

    private function processTarSchedule($tar_schedules) {
        return array(
            'tar_id_new' => (int) $tar_schedules['tar_id_new'],
            'change_time' => (string) $tar_schedules['change_time'],
            'time_to' => (string) $tar_schedules['time_to'],
            'rate' => (float) $tar_schedules['rate']
        );
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setVgroup', array(
            'vg_id' => (int) $this->param('id'),
            'ip_det' => (int) $this->param('ip_det'),
            'port_det' => (int) $this->param('port_det'),
            'connected_from' => (int) $this->param('connected_from'),
            'parent_vg_id' => (int) $this->param('parent_vg_id'),
            'template' => (int) $this->param('template'),
            'pass' => FakePassword::passParam(),
            'descr' => (string) $this->param('descr'),
            'shape' => (int) $this->param('shape'),
            'max_sessions' => (int) $this->param('max_sessions'),
            'agent_id' => (int) $this->param('agent_id'),
            'agrm_id' => (int) $this->param('agrm_id'),
            'login' => (string) $this->param('login'),
            'address' => ((string) $this->param('address')) ? CJSON::decode((string) $this->param('address')) : array()
        )));
    }
    
}
?>
