<?php class Vgroups {
    private $data;
    private $full;
    private $blockrasp;
    public function __construct($data) {
        $this->data = $data->vgroup;
        $this->full = $data;
        if (isset($data->blockrasp)) $this->blockrasp = $data->blockrasp;
    }
    public function getServicesColumnData() {
        if ($this->data->tariftype == 5) {
            $services = $this->getAssignedServices();
            return $services ? $services : array(yii::t('account','NoServices'));
        } else return array(yii::t('account', 'NotAvailable'));
    }
    public function getStateColumnData() {
        $data = array(
            "state" => $this->getState()
        );
        if ($this->data->blocked == Block_Helper::SWITCHED_OFF_BY_USER AND yii::app()->params['vgroup_change_status']) {
            $data['link'] = yii::app()->controller->createUrl('block/managing');
        }
        if (yii::app()->request->getParam('action') AND yii::app()->request->getParam('vgid') == $this->data->vgid AND $this->changeState()) $data["message"] = $this->getStateChangingSuccessMessage();
        else {
            if (!$this->stateChangingIsAvailableForVgroup()) $data["message"] = yii::t("account", "LockUnlockQueue");
            else {
                if ($this->stateChangingIsAvailableForClient()) $data["change_status"] = $this->getChangeStatusLink();
                if (!$this->isBlocked() AND $this->canChangeTariff()) $data["change_tariff"] = $this->getChangeTariffLink();
            }
        }
        return $data;
    }
    private function getTariffCategories() {
		return yii::app()->controller->lanbilling->getRows("getTarCategories", array(
            "id" => $this->data->tarifid
        ), true);
    }
    private function tariffIsUnlimited() {
		foreach ($this->getTariffCategories() as $category) {
			if ($category->above) return false;
		}
		return true;
    }
    private function shouldShowConsumed() {
        return yii::app()->params['show_consumed'] AND $this->data->tariftype < 5 AND (!yii::app()->params['hide_consumed_if_unlimited'] OR !$this->tariffIsUnlimited());
    }
    private function showConsumed() {
        if (!$this->shouldShowConsumed()) return null;
        if ($this->data->tariftype < 2) $this->showConsumedTraffic();
        else $this->showConsumedTime();
    }
    private function showConsumedTime() {
        return abs(round($this->data->serviceusedin/60)) . $this->data->servicevolume . " " . yii::t('account', 'MIN');
    }
    private function showConsumedTraffic() {
        return abs(round($this->data->serviceusedin/1024/1024)) . "/" . $this->data->servicevolume . " " . yii::t('account', 'MB');
    }
    private function changeState() {
        if ( !$this->stateChangingIsAvailableForClient() OR !$this->stateChangingIsAvailableForVgroup() ) return false;
        if (yii::app()->request->getParam('action') == "block") return $this->blockVgroup();
        elseif(yii::app()->request->getParam('action') == "unblock") return $this->unblockVgroup();
    }
    private function unblockVgroup() {
        if (!$this->isBlocked()) return false;
        return $this->changeStateRequest("off");
    }
    private function blockVgroup() {
        if ($this->isBlocked()) return false;
        return $this->changeStateRequest("on");
    }
    private function changeStateRequest($state) {
        return yii::app()->controller->lanbilling->get("blkClientVgroup", array(
            "id" => $this->data->vgid,
            "blk" => 2,
            "state" => $state
        ));
    }
    private function getStateChangingSuccessMessage() {
        if (yii::app()->request->getParam('action') == "block") return yii::t('account', 'LockQueue');
        elseif (yii::app()->request->getParam('action') == "unblock") return yii::t('account', 'UnlockQueue');
    }
    private function getChangeStatusLink() {
        $params = array(
            "vgid" => $this->data->vgid, 
            "agrmid" => $this->data->agrmid,
            "page" => yii::app()->request->getParam('page', 1)
        );
        if ($this->isBlocked()) {
            $params["action"] = "unblock";
            $text = "Activate";
        }
        else {
            $params["action"] = "block";
            $text = "Lock";
        }
        return array(
            "href" => yii::app()->controller->createUrl("account/vgroups", $params),
            "text" => yii::t("account", $text)
        );
    }
    private function stateChangingIsAvailableForClient() {
        return false;
        return yii::app()->params["vgroup_change_status"];
    }
    private function stateChangingIsAvailableForVgroup() {
        return $this->data->blkreq == 0 AND (!isset($this->blockrasp) OR !$this->blockrasp) AND ($this->data->blocked == 2 OR $this->data->blocked == 0);
    }
    private function isBlocked() {
        return $this->data->blocked != 0;
    }
    private function getTariffThatIsRequestedToChange() {
        if (!isset($this->data->tarrasp) OR !$this->data->tarrasp) return null;
        $schedule = $this->data->tarrasp;
        if (!is_array($schedule)) return $this->getTariffRequestedToChangeMessage($schedule);
        usort($schedule, array($this,'sortTariffChangingSchedule'));
        return $this->getTariffRequestedToChangeMessage($schedule[0]);
    }
    public function sortTariffChangingSchedule($a, $b) {
        if ((int)strtotime($a->changetime) < (int)strtotime($b->changetime)) { return -1; }
        elseif ((int)strtotime($a->changetime) > (int)strtotime($b->changetime)) { return 1; }
        else return 0;
    }
    private function getState() {
        return yii::t('account', 'State') . ": " . yii::t('account', 'State' . $this->data->blocked);
    }
    private function getTariffRequestedToChangeMessage($tariff) {
        return array(
            "message" => Yii::t('account', 'TariffChangeRequested'),
            "tariff" => ($tariff->tarnewname) ? $this->data->tarifdescr : $tariff->tarnewname,
            "date" => Yii::t('account', 'From') . yii::app()->controller->formatDate(strtotime($tariff->changetime))
        );
    }
    private function getAssignedServices() {
        $services = array();
        $result = yii::app()->controller->lanbilling->getRows("getVgroupServices", array("flt" => array(
            'vgid' => $this->data->vgid,
            'common' => -1, 
            'unavail' => -1, 
            'needcalc' => 1, 
            'defaultonly' => 1 
        )));
        foreach ($result as $service) $services[] = $service->catdescr;
        return $services;
    }
    public function getLoginColumnData($grid) {
        $data = array(
            "login" => $this->getMenuLink(),
            "actions" => $this->getActions($grid),
            "vgid" => $this->data->vgid,
        );
        return $data;
    }
    private function getActions($grid) {
        $data = array();
        if ($this->getTariffsHistoryLink($grid)) {
            $data[] = $this->getTariffsHistoryLink($grid);
        }
        $data[] = $this->getRentHistoryLink();
        if ($this->canChangePassword()) $data[] = $this->getChangePasswordLink();
        if ($this->canChangeTariff()) $data[] = $this->getChangeTariffLink();
        return $data;
    }
    private function canChangeTariff() {
        return isset( $this->data->tarstaff ) AND $this->data->tarstaff AND yii::app()->params["vgroup_schedule"];
    }
    private function getChangeTariffLink() {
        return array(
            "href" => yii::app()->createUrl( "Services/ChoiceTariff", array(
                "vgid"  => $vGroup->vgroup->vgid,
                "login" => $vGroup->vgroup->login,
                "clear" => 1
            )),
            "text" => Yii::t('account', 'ChangeTarif')
        );
    }
    private function getMenuLink() {
        return ((trim($this->data->login)) ? $this->data->login : yii::t('account', 'Settings'));
    }
    private function getTariffsHistoryLink($grid) {
        $url = $grid->tariffHistoryUrl($this->full);
        if (!$url) {
            return null;
        }
        return array(
            "href" => $url,
            "text" => Yii::t('account', 'TarifHistory')
        );
    }
    private function canChangePassword() {
        return yii::app()->params["vgroup_password_edit"];
    }
    private function getChangePasswordLink() {
        return array(
            "href" => yii::app()->controller->createUrl("/account/password", array(
                "vgid" => $this->data->vgid,
                "vglogin" => $this->data->login
            )),
            "text" => Yii::t('account', 'ChangePassword')
        );
    }
    private function getRentStatisticsType() {
        return  ($this->data->tariftype == 5) ? 'service' : 'rent';
    }
    private function getRentHistoryLink() {
        return array(
            "href" => yii::app()->controller->createUrl("invoice/charges", array(
                'step' => 1,
                'params' => array(
                    1 => array(
                        'vgid' => $this->data->vgid
                    )
                )
            )),
            "text" => Yii::t('account', 'RentHistory')
        );
    }
}?>
