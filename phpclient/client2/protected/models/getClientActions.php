<?php class getClientActions extends LBModel {
	public $group; 
	public $promoType;
	public $recordid;
	public function rules() {
        return array();
    }
	protected function getParams($type = 'default') {
		return array('flt' => array('archive' => 0));
	}
	protected function vgOrAgeements($data) {
		$data = $this->actionsList($data);
	}
	protected function actionsList($avlPromoArray) {
		$group = $this->group;
		if (count($avlPromoArray) > 0){
            $avlPromoArray = Arr::obj2arr($avlPromoArray); // объект->массив
            $promoClearArray = array();
            $promoClearArrayCount = array();
            // Преобразование в одномерный массив
         	foreach ($avlPromoArray as $key => $promoVal){
                if ($group){
                    $aId = $promoVal['action']['recordid'];
                    $promoClearArray[$aId] = Arr::flatten($promoVal);
                    // Счетчик акций при группировке
                    if (isset($promoClearArrayCount[$aId]['actionsCount']))
                        $promoClearArrayCount[$aId]['actionsCount'] += 1;
                    else
                        $promoClearArrayCount[$aId]['actionsCount'] = 1;
                } else $promoClearArray[] = Arr::flatten($promoVal);
			}
        	// Добавляем счетчик числа однотипных акций в каждый элемент массива
       		if ($group)$promoClearArray = Arr::merge($promoClearArray,$promoClearArrayCount);
 		} else $promoClearArray = array();
        // Обнуление ключей массива при группировке по акциям для CGridView
        if ($group) $promoClearArray = array_values($promoClearArray);
		foreach ($promoClearArray as $k => $v) {
			$link = $v['link'];
			//$link = 'http://ya.ru';
			$link_img = CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
			$promoClearArray[$k]['name'] .= ($link ? '&nbsp;&nbsp;'.CHtml::link($link_img,$link,array('class' => 'no_border')) : '');
			$promoClearArray[$k]['dtfromstart'] = ($v['dtfromstart'] == "0000-00-00") ? "<em>".Yii::t("promo","NotSet")."</em>" : yii::app()->controller->formatDate(strtotime($v['dtfromstart']));
			$promoClearArray[$k]['dtfromend'] = ($v['dtfromend'] == "0000-00-00") ? "<em>".Yii::t("promo","Unlimited")."</em>" : yii::app()->controller->formatDate(strtotime($v['dtfromend']));
			$promoClearArray[$k]['actions'] = $this->getApplyLink($v);
		}
		return Arr::obj2arr($promoClearArray);
	}
	protected function getApplyLink($data){
        if ($data['actionsCount'] == 1)
        {
            $url = array("/promo/applyPromo");
            return CHtml::link(
                Yii::t("promo","ApplyPromo"),
                $url,
                array(
                    "submit"=>$url,
                    'params' => array(
                        "recordid" => $data["recordid"],
                        "uid" => $data["uid"],
                        "agrmid" => $data["agrmid"],
                        "vgid" => $data["vgid"],
                        "promoType" => 0,
                    ),
                    'confirm' => Yii::t('promo','ConfirmSubscribe',array('{action}' => $data["name"]))
                )
            );
        }
        else
        {
            $url = array("/promo/applyPromo");
            if ($data['uid'] > 0){
                $urlTxt = Yii::t("promo","ChooseUser");
                $act = 1;
            }
            if ($data['agrmid'] > 0){
                $urlTxt = Yii::t("promo","ChooserAgreement");
                $act = 2;
            }
            if ($data['vgid'] > 0){
                $urlTxt = Yii::t("promo","ChooseVGroup");
                $act = 3;
            }
            return CHtml::link(
                $urlTxt,
                $url,
                array(
                    'submit' => $url,
                    'params' => array(
                        'recordid' => $data['recordid'],
                        'promoType' => $act
                    ),
                )
            );
        }
    }
} ?>