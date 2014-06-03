<?php

/**
 * Класс получающий данные для раздела <Акции>/<Действующие акции>
 */
class LB_Promo_Active { 
    /**
     * Запрос действующих акций
     */
    public function data() {
        return $this->process(yii::app()->lanbilling->getRows('getActionsStaff', array(
            'flt' => array(
                'archive' => 0
            )
        )));
    }
    /**
     * Обработка массива действующих акций, полученного от сервера
     */
    private function process($data) {
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
                $result[$i]['title'] = $this->getObjectTitle($v);
                $result[$i]['description'] = $this->getObjectText($v);
                $result[$i]['turnOffLink'] = $this->getDropLink($v);
                $result[$i]['period'] = $this->getPeriod($v);
                $i ++;
            }
        }
        return $result;
    }
    private function isNotOutOfDate($item) {
        if ($item['dtto'] == "0000-00-00") return true;
        $timeto = strtotime($item['dtto']);
        $currentTime = strtotime(date('Y-m-d 00:00:00', time()));
        if ($currentTime < $timeto) return true;
        return false;
    }
    private function getDropLink($data){
        $url = array("/promo/unsubscribe");
        return CHtml::link(
            Yii::t("promo", 'Unsubscribe'),
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
    private function getObjectText($data){
        if ($data['vgid'] > 0){
            return Yii::t('promo','BindedToVGroup', array('{agreement}'=>'<strong>'.$data['agrmnum'].'</strong>','{vgroup}'=>'<strong>'.$data['vglogin'].'</strong>'));
        }elseif($data['agrmid'] > 0 && $data['vgid'] <= 0){
            return Yii::t('promo','BindedToAgreement', array('{agreement}'=>'<strong>'.$data['agrmnum'].'</strong>'));
        }elseif($data['agrmid'] <= 0 && $data['vgid'] <= 0){
            return Yii::t('promo','BindedToUser', array('{username}'=>'<strong>'.$data['username'].'</strong>'));
        }
    }
    private function getObjectTitle($data){
    	if($data['actionlink'] == '') {
    		return $data['actionname'];
    	}
    	return '<a style="text-decoration: none;" href="' . $data['actionlink'] . '">' . $data['actionname'] . '</a>';
    }
    
    private function getPeriod($data){
    	$dtfrom = yii::app()->controller->formatDate(strtotime($data['dtfrom']));
    	$dtto  = ($data["dtto"] == "0000-00-00") ? "" : " " . Yii::t("promo","till") . " " . yii::app()->controller->formatDate(strtotime($data['dtto']));
    	$period = Yii::t("promo","Active period") . ': ' . Yii::t("promo","From") ." " . $dtfrom . " ". $dtto;
    	return $period;
    }
    
    
} ?>
