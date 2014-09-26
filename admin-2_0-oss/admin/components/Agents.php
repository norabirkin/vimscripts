<?php
class Agents {
    private $types = array(
        1 => array("name" => "Ethernet / PCAP", "group" => 1),
        2 => array("name" => "Ethernet / ULOG", "group" => 1),
        3 => array("name" => "Ethernet / TEE", "group" => 1),
        4 => array("name" => "Netflow", "group" => 1),
        5 => array("name" => "Sflow", "group" => 1),
        6 => array("name" => "RADIUS", "group" => 2),
        7 => array("name" => "PCDR / PABX", "group" => 3),
        //8 => array("name" => "PABX / RS-232", "group" => 3),
        //9 => array("name" => "PABX / FIFO", "group" => 3),
        //10 => array("name" => "PABX / TCP client", "group" => 3),
        //11 => array("name" => "PABX / TCP server", "group" => 3),
        12 => array("name" => "VoIP", "group" => 4),
        13 => array("name" => "UsBox", "group" => 5),
        14 => array("name" => "Snmp", "group" => 6)
    );

    private function param( $paramName ) {
        return yii::app()->controller->param( $paramName );
    }

    public function setPhoneFilter( $filter, $agent_id ) {
        $filter = CJSON::decode( $filter, true );
        $filterstr = "";
        foreach ($filter as $item) {
            $itemstr = "(" . $item["parameter"] . " " . $item["condition"] . " " . $item["value"] . ")";
            if ($item["logic"]) {
                $itemstr .= " " . $item["logic"] . " ";
            }
            $filterstr .= $itemstr;
        }
        return yii::app()->japi->callAndSend( "setPhoneFilter", array(
            "agent_id" => (int) $agent_id,
            "phone_filter" => $filterstr
        ));
    }

    public function getPhoneFilter( $agent_id ) {
        $filterstr = yii::app()->japi->callAndSend("getPhoneFilter", array(
            "agent_id" => (int) $agent_id
        ));
        if (!$filterstr) {
            return array();
        }
        $filterstr = $filterstr[ "phone_filter" ];
        $count = preg_match_all("/\( *([a-z_]+) *([!=><~]{1,2}) *([^<>\"\'\(]+ *)\) *(&&|\\|\\|)*/", $filterstr, $matches);
        $parameters = $matches[1];
        $conditions = $matches[2];
        $values = $matches[3];
        $logic = $matches[4];
        $result = array();
        for ($i = 0; $i < $count; $i ++) {
            $result[$i] = array(
                "parameter" => $parameters[$i],
                "condition" => $conditions[$i],
                "value" => $values[$i],
                "logic" => $logic[$i]
            );
        }
        return $result;
    }

    private function saveOptions($params) {
        $id = $params["id"];
        $options = $params["options"];
        foreach ($options as $name => $value) {
            yii::app()->japi->call("setAgentOption", array(
                "agent_id" => (int) $id,
                "name" => $name,
                "descr" => $name,
                "value" => (string) $this->optionValue($name, $value)
            ));
        }
    }
    public function saveAgent() {
        $params = array(
            "agent_id" => (int) $this->param("id"),
            "type" => (int) $this->param("type"),
            "descr" => $this->param("descr"),
            "flush" => (int) $this->param("flush"),
            "keepdetail" => (int) $this->param("keepdetail"),
            "na_ip" => $this->param("na_ip"),
            "na_pass" => $this->param("na_pass"),
            "na_username" => $this->param("na_username"),
            "na_db" => $this->param("na_db"),
            "service_name" => $this->param("service_name"),
            "nfhost" => $this->param("nfhost") ? $this->param("nfhost") : null,
            "nfport" => (int) $this->param("nfport"),
            "local_as_num" => (int) $this->param("local_as_num"),
            "ignorelocal" => (int) $this->param("ignorelocal"),
            "raccport" => (int) $this->param("raccport"),
            "rauthport" => (int) $this->param("rauthport"),
            "eapcertpassword" => $this->param("eapcertpassword"),
            "session_lifetime" => (int) $this->param("session_lifetime"),
            "max_radius_timeout" => (int) $this->param("max_radius_timeout"),
            "raddrpool" => (int) $this->param("raddrpool"),
            "save_stat_addr" => (int) $this->param("save_stat_addr"),
            "remulate_on_naid" => (int) $this->param("remulate_on_naid"),
            "rad_stop_expired" => (int) $this->param("rad_stop_expired"),
            "restart_shape" => (int) $this->param("restart_shape"),
            "tel_direction_mode" => (int) $this->param("tel_direction_mode"),
            "failed_calls" => (int) $this->param("failed_calls"),
            "oper_cat" => (int) $this->param("oper_cat"),
            //"tel_src" => $this->param("tel_src"),
            //"com_speed" => (int) $this->param("com_speed"),
            //"com_parity" => (int) $this->param("com_parity"),
            //"com_data_bits" => (int) $this->param("com_data_bits"),
            //"com_stop_bits" => (int) $this->param("com_stop_bits"),
            "voip_card_user" => $this->param("voip_card_user")
        );
        if ($this->param("ignore_nets")) {
            $params["ignore_nets"] = CJSON::decode($this->param("ignore_nets"));
        }
        if ($this->param("interfaces")) {
            $params["interfaces"] = CJSON::decode($this->param("interfaces"));
        }
        $result = yii::app()->japi->call( "setAgent", $params );
        $options = $this->param("options");
        if ( $options ) {
            $options = CJSON::decode($options);
            $id = (int) $this->param("id");
            if (!$id) {
                yii::app()->japi->send(true);
                $id = (int) $result->getResult();
            }
            $this->saveOptions(array( "id" => $id, "options" => $options ));
        }
        yii::app()->japi->send(true);
        return (int) $result->getResult();
    }

    private function hasType( $agent, $type ) {
        if (is_scalar($type)) {
            return (int) $agent["agent"]["type"] == $type;
        }
        if (is_array($type)) {
            return (int) in_array($agent["agent"]["type"], $type);
        }
    }
    public function getTypes() {
        $types = array();
        foreach ($this->types as $id => $type) {
            $types[] = array(
                "id" => $id,
                "name" => $type["name"]
            );
        }
        return $types;
    }
    public function getRadiulEmulateAgents() {
        $response = yii::app()->japi->callAndSend('getAgentsExt');
        $result = array(
            array(
                "id" => 0,
                "name" => yii::t( "messages", "None" )
            )
        );
        foreach ($response as $item) {
            if ($item["agent"]["type"] < 6) {
                $result[] = array(
                    "id" => $item["agent"]["agent_id"],
                    "name" => "ID " . $item["agent"]["agent_id"] . ". " . $item["agent"]["descr"]
                );
            }
        }
        return $result;
    }
    private function optionValue($name, $value) {
        if ($name == 'instantly_amount') {
            return (int) !((int) $value);
        } else {
            return $value;
        }
    }
    public function getOptions() {
        $response = yii::app()->japi->callAndSend( "getAgentOptions", array(
            "agent_id" => (int) $this->param("id")
        ));
        $result = array();
        foreach ($response as $item) {
            $result[ $item["name"] ] = $this->optionValue($item["name"], $item["value"]);
        }
        return $result;
    }
    public function getList() {
        $types = yii::app()->controller->param('types');
        $types = $types ? explode(',', $types) : null;
        $response = yii::app()->japi->callAndSend( "getAgentsExt" );
        $result = array();
        foreach ($response as $item) {
            if (
                (
                    !$types OR
                    in_array(
                        $item['agent']['type'],
                        $types
                    )
                ) AND
                (
                    !yii::app()->controller->param('statistics') OR
                    $item["agent"]["type"] < 14
                ) AND
                (
                    !yii::app()->controller->param('no_remulate_on_naid')OR
                    !$item["agent"]["remulate_on_naid"]
                )
            ) {
                $result[] = array(
                    "sessions" => $item["sessions"],
                    "dropbtn" => (int) ($item["vgroups"] == 0),
                    "id" => $item["agent"]["agent_id"],
                    "type" => $item["agent"]["type"],
                    "flush" => $item["agent"]["flush"],
                    "keepdetail" => $item["agent"]["keepdetail"],
                    "na_pass" => $item["agent"]["na_pass"],
                    "na_username" => $item["agent"]["na_username"],
                    "na_db" => $item["agent"]["na_db"],
                    "service_name" => $item["agent"]["service_name"],
                    "descr" => $item["agent"]["descr"],
                    "na_ip" => $item["agent"]["na_ip"],
                    "active" => (int) $item["active"],
                    "vgroups" => $item["vgroups"],
                    "lastcontact" => $item["agent"]["lastcontact"],
                    "nfhost" => $item["agent"]["nfhost"],
                    "nfport" => (int) $item["agent"]["nfport"],
                    "local_as_num" => $item["agent"]["local_as_num"],
                    "ignorelocal" => $item["agent"]["ignorelocal"],
                    "raccport" => $item["agent"]["raccport"],
                    "rauthport" => $item["agent"]["rauthport"],
                    "eapcertpassword" => $item["agent"]["eapcertpassword"],
                    "session_lifetime" => $item["agent"]["session_lifetime"],
                    "max_radius_timeout" => $item["agent"]["max_radius_timeout"],
                    "raddrpool" => $item["agent"]["raddrpool"],
                    "save_stat_addr" => $item["agent"]["save_stat_addr"],
                    "remulate_on_naid" => $item["agent"]["remulate_on_naid"],
                    "rad_stop_expired" => $item["agent"]["rad_stop_expired"],
                    "restart_shape" => $item["agent"]["restart_shape"],
                    "tel_direction_mode" => $item["agent"]["tel_direction_mode"],
                    "failed_calls" => $item["agent"]["failed_calls"],
                    "oper_cat" => $item["agent"]["oper_cat"],
                    "tel_src" => $item["agent"]["tel_src"],
                    "com_speed" => $item["agent"]["com_speed"],
                    "com_parity" => $item["agent"]["com_parity"],
                    "com_data_bits" => $item["agent"]["comdatabits"],
                    "com_stop_bits" => $item["agent"]["comstopbits"],
                    "voip_card_user" => $item["agent"]["voip_card_user"]
                );
            }
        }
        yii::app()->controller->success( $result );
    }
} ?>
