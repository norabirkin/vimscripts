<?php

class AgentsTree {
    public function get($platform_id) {
        if (!$platform_id) {
            return array();
        }
        $result = array();
        $ids = array();
        $data = array(
            1 => array(
                'text' => 'Ethernet / PCAP',
                'leaf' => true,
                'children' => array()
            ),
            2 => array(
                'text' => 'Ethernet / ULOG',
                'leaf' => true,
                'children' => array()
            ),
            3 => array(
                'text' => 'Ethernet / TEE',
                'leaf' => true,
                'children' => array()
            ),
            4 => array(
                'text' => 'Netflow',
                'leaf' => true,
                'children' => array()
            ),
            5 => array(
                'text' => 'Sflow',
                'leaf' => true,
                'children' => array()
            ),
            6 => array(
                'text' => 'RADIUS',
                'leaf' => true,
                'children' => array()
            ),
            7 => array(
                'text' => 'PCDR / PABX',
                'leaf' => true,
                'children' => array()
            ),
            12 => array(
                'text' => 'VoIP',
                'leaf' => true,
                'children' => array()
            ),
            13 => array(
                'text' => 'UsBox',
                'leaf' => true,
                'children' => array()
            ),
            14 => array(
                'text' => 'Snmp',
                'leaf' => true,
                'children' => array()
            )
        );
        $staff = yii::app()->japi->call('getPlatformsStaff', array(
            'platform_id' => $platform_id
        ));
        $agents = yii::app()->japi->call('getAgentsExt');
        yii::app()->japi->send();
        foreach ($staff->getResult() as $item) {
            $ids[] = $item['agent_id'];
        }
        foreach ($agents->getResult() as $item) {
            $item = $item['agent'];
            $type = $item['type'];
            $id = $item['agent_id'];
            if (!$data[$type]) {
                continue;
            }
            $data[$type]['leaf'] = false;
            $data[$type]['children'][] = array(
                'text' => $item['descr'],
                'agent_id' => $id,
                'platform_id' => $platform_id,
                'attached' => (int) in_array($id, $ids),
                'leaf' => true
            );
        }
        foreach ($data as $item) {
            if (!$item['leaf']) {
                $result[] = $item;
            }
        }
        return array_values($result);
    }
}

?>
