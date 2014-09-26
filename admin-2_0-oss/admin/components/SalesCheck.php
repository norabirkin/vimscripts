<?php
class SalesCheck {

    private $pay_id;
    private $manager;
    private $payment_sum;
    private $payment_type;
    private $agrmid;
    private $ptype;
    private $agreement = array();
    private $options = array();
    private $account;

    private function get() {
        return $this->process(array(
            array(
                $this->ptype, 
                $this->payment_type,
                "",
                0,
                $this->payment_sum,
                $this->manager["externalid"],
                $this->manager["fio"],
                "",
                "",
                "",
                "",
                ""
            ),
            array( 
                $this->options["print_sales_mebius"] ? $this->getTemplatedString() : "",
                1,
                $this->payment_sum,
                $this->getOperCode(),
                "",
                "",
                "",
                "",
                ($this->account["type"] == 2 ? 0 : 2),
                "",
                "",
                "",
                $this->options["print_sales_mebius"] ? "" : $this->getTemplatedString()
            )
        ));
    }

    public function create( $params ) {
        $this->init( $params );
        return $this->get(); 
    }

    private function getFileName() {
        return "pm-" . $this->pay_id . ".xte";
    }

    private function getAddress() {
        if ($this->account["addresses"]) {
            foreach ($this->account["addresses"] as $agrm) {
                if ($agrm["type"] == 2) {
                    $uaddr = $agrm["address"];
                }
            }
        }
        $temp_uaddr = explode(',',$uaddr);
        return implode(', ', array($temp_uaddr[5], $temp_uaddr[6], $temp_uaddr[7]));
    }

    private function getOperCode() {
        $field = $this->account["type"] == 2 ? $this->options["print_sales_ocfiz"] : $this->options["print_sales_ocur"];
        $operator = yii::app()->japi->callAndSend("getAccount", array("uid" => $this->agreement["oper_id"]));
        if ($operator["agreements"]) {
            foreach ($operator["agreements"] as $agreement) {
                if ( $agreement["addons"] ) {
                    foreach ($agreement["addons"] as $addon) {
                        if ($addon["name"] == $field) {
                            return $addon["str_value"];
                        }
                    }
                }
            }
        }
        return 0;
    }

    private function setOptions() {
        $this->options = array();
        $names = array( "print_sales_mebius", "print_sales_template", "print_sales_ocfiz", "print_sales_ocur" );
        foreach (yii::app()->japi->callAndSend("getOptions") as $option) {
            if (in_array($option["name"], $names)) {
                $this->options[$option["name"]] = $option["value"];
            }
        }
    }

    private function init( $params ) {
        foreach ($params as $k => $v) {
            $this->$k = $v;
        }
        $this->manager = $this->getManagerInfo();
        $this->setOptions();
        $this->agreement = yii::app()->japi->callAndSend("getAgreements", array("agrm_id" => $this->agrmid));
        $this->agreement = $this->agreement[0];
        $this->account = yii::app()->japi->callAndSend("getAccount", array("uid" => $this->agreement["uid"]));
    }

    private function getManagerInfo() {
        $manager = UserIdentity::getPermissions();
        return array(
            'fio' => $manager['fio'],
            'externalid' => 123123
        );
    }

    private function getTemplatedString() {
        return str_replace(array("\r\n","\n","\r"), '^', strtr( $this->options["print_sales_template"], array(
            "%fio" => $this->account["name"],
            "%addr" => $this->getAddress(),
            "%ulogin" => $this->account["login"],
            "%balance" => $this->agreement["balance"],
            "%credit" => $this->agreement["credit"],
            "%agrm" => $this->agreement["agrm_num"]
        )));
    }

    private function process( $data ) {
        foreach ($data as $k => $v) {
            $data[$k] = implode(";", $v);
        }
        return $data;
    }

} ?>
