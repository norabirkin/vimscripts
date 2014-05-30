<?php class getActionsStaff extends LBModel { 
	public function rules() {
        return array();
    }
	protected function getParams($type = 'default') {
		return array('flt' => array('archive' => 0));
	}
	private function isNotOutOfDate($item) {
		if ($item['dtto'] == "0000-00-00") return true;
		$timeto = strtotime($item['dtto']);
		$currentTime = strtotime(date('Y-m-d 00:00:00', time()));
		if ($currentTime <= $timeto) return true;
		return false;
	}
	protected function actionsList($data) {
		if (count($data) > 0){
            $data = Arr::obj2arr($data); // объект->массив
            foreach ($data as $item){
                $processed[] = Arr::flatten($item);
            }
            $data = $processed;
        }
		$result = array();
		$i = 0;
		foreach ($data as $k => $v) {
			if ($this->isNotOutOfDate($v)) {
				$result[$i] = $v;
				$result[$i]['description'] = $this->getObjectText($v);
				$result[$i]['dtfrom'] = yii::app()->controller->formatDate(strtotime($data[$k]['dtfrom']));
				$result[$i]['dtto'] = ($data[$k]["dtto"] == "0000-00-00") ? "<em style=\'color:green;\'>".Yii::t("promo","Active")."</em>" : yii::app()->controller->formatDate(strtotime($data[$k]['dtto']));
				$result[$i]['actions'] = $this->getDropLink($v);
				$i ++;
			}
		}
		return $result;
	}
	protected function getDropLink($data){
        $url = array("/promo/unsubscribe");
        return CHtml::link(
            Yii::t("promo","Unsubscribe"),
            $url,
            array(
                "submit"=>$url,
                'params' => array(
                    "recordid" => $data["recordid"],
                    "promo" => $data["actionname"],
                    "dtfrom" => $data["dtfrom"],
                    "actionid" => $data["actionid"],
                    "agrmid" => $data["agrmid"],
                    "vgid" => $data["vgid"]
                ),
                'confirm' => Yii::t('promo','ConfirmUnsubscribe',array('{action}' => $data["actionname"]))
            )
        );
    }
	protected function getObjectText($data){
        if ($data['vgid'] > 0){
            return Yii::t('promo','BindedToVGroup', array('{agreement}'=>'<strong>'.$data['agrmnum'].'</strong>','{vgroup}'=>'<strong>'.$data['vglogin'].'</strong>'));
        }elseif($data['agrmid'] > 0 && $data['vgid'] <= 0){
            return Yii::t('promo','BindedToAgreement', array('{agreement}'=>'<strong>'.$data['agrmnum'].'</strong>'));
        }elseif($data['agrmid'] <= 0 && $data['vgid'] <= 0){
            return Yii::t('promo','BindedToUser', array('{username}'=>'<strong>'.$data['username'].'</strong>'));
        }
    }
} ?>
