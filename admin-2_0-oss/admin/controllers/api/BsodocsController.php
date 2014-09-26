<?php
class BsodocsController extends Controller{

    private function getPaymentsData( $payments ) {
        if (!$payments) {
            return "";
        }
        $p_data = array();
        foreach ($payments as $k => $v) {
            $p_data[] = array(
                "amount" => $v["amount"],
                "agrm" => $v["agrm_num"],
                "uname" => $v["acc_name"],
                "paydate" => $v["pay_date"]
            );
        }
        return CJSON::encode($p_data);
    }

    public function actionGet() {
        $list = new OSSList( array("useSort" => false) );
        $docs = $list->getList("getBsoDocs", array(
            "set_id" => (int) $this->param("id"),
            "doc_number" => (string) $this->param("code")
        ));
        $result = $docs['result']->getResult();
        foreach ($result as $k => $v) {
            $result[$k]["p_data"] = $this->getPaymentsData( $v["payments"] );
        }
        $this->success( $result, $docs['total']->getResult() );
    }
    
} ?>
