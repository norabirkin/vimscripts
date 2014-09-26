<?php
class AccountsaddonsController extends Controller{

    public function actionList() {
        $addons = yii::app()->japi->callAndSend("getAccountsAddonsSet", array(
            "get_full" => true
        ));
        foreach ($addons as $k => $v) {
            $addons[$k]["name"] = "accounts_addons_vals." . $addons[$k]["name"];
            if ( $addons[$k]["values"] ) {
                $addons[$k]["values"] = CJSON::encode($addons[$k]["values"]);
            } else {
                $addons[$k]["values"] = "";
            }
        }
        $this->success( $addons );
    }
    
} ?>
