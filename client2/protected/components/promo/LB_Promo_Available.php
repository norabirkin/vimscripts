<?php

/**
 * Класс получающий данные для раздела <Акции>/<Доступные акции>
 */
class LB_Promo_Available {
    /**
     * Запрос доступных акций
     */
    public function data($group) {
        return $this->process(yii::app()->lanbilling->getRows('getClientActions', array(
            'flt' => array(
                'archive' => 0
            )
        )), $group);
    }
    /**
     * Обработка массива доступных акций, полученного от сервера
     */
    private function process($avlPromoArray, $group) {
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
            $promoClearArray[$k]['title'] = $this->getTitle($v);
            $promoClearArray[$k]['applylink'] = $this->getApplyLink($v);
            $promoClearArray[$k]['description'] = $this->getDescription($v);
            $promoClearArray[$k]['days'] = $this->getDaysCount($v);
            $promoClearArray[$k]['period'] = $this->getPeriod($v);
        }
        return Arr::obj2arr($promoClearArray);
    }
    /**
     * Формирование ссылки для подключение акции
     */
    private function getApplyLink($data){
        if ($data['actionsCount'] == 1)
        {
            $url = array("/promo/applyPromo");
            return CHtml::link(
                Yii::t("promo","apply promo"),
                $url,
                array(
                    "submit"=>$url,
                    'params' => array(
                        "recordid" => $data["recordid"],
                        "uid" => $data["uid"],
                        "agrmid" => $data["agrmid"],
                        "vgid" => $data["vgid"],
                        "promoType" => 0,
                    	"promoName" => $data["name"]
                    ),
                    'confirm' => Yii::t('promo','ConfirmSubscribe',array('{action}' => $data["name"]))
                )
            );
        }
        else
        {
            $url = array("/promo/applyPromo");
            if ($data['uid'] > 0){
                $urlTxt = Yii::t("promo","choose user");
                $act = 1;
            }
            if ($data['agrmid'] > 0){
                $urlTxt = Yii::t("promo","choose agreement");
                $act = 2;
            }
            if ($data['vgid'] > 0){
                $urlTxt = Yii::t("promo","choose account");
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
    
    private function getTitle($data){
    	if($data['link'] == '') {
    		return $data['name'];
    	}
    	return '<a style="text-decoration: none;" href="' . $data['link'] . '">' . $data['name'] . '</a>';
    }
    
    private function getDescription($data) {
    	$descr = $data['descr'] == "" ? "<em>".Yii::t("promo","Description is empty")."</em>" : $data['descr'];
    	$descr .= ($data['link'] ? '</br>'.CHtml::link(Yii::t("promo","More info about promotion"),$data['link'],array('class' => 'no_border')) : '');
    	return $descr;
    }
    
    private function getDaysCount($data) {
    	return '<strong>' .Yii::t("promo","DayCount").": "  . '</strong>' . $data['daycount'];
    }
    
    private function getPeriod($data) {
    	$dtfromstartvalue = ($data['dtfromstart'] == "0000-00-00") ? "<em>".Yii::t("promo","NotSet")."</em>" : yii::app()->controller->formatDate(strtotime($data['dtfromstart']));
	    $dtfromstart = '<strong>' . Yii::t("promo","Active period") . '</strong>: ' . Yii::t("promo","From") ." " . $dtfromstartvalue;
	    $dtfromend = ($data['dtfromend'] == "0000-00-00") ? "" : ' ' . Yii::t("promo","till") . " " . yii::app()->controller->formatDate(strtotime($data['dtfromend']));
	    $period = $dtfromstart . $dtfromend;
	    return $period;
    }
}

?>
