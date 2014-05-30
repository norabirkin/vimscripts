<?php
/**
 * Actions data model
 */
class Promo extends CFormModel {

	public $actionid;

    public $recordid;
    public $dtfrom;

    public $vgid;
    public $agrmid;
    public $actionDateFrom;

    public $promoType;
    
    public $errorMsg;

    public function rules() {
		return array(
            array('actionid, recordid, vgid, agrmid', 'numerical', 'integerOnly'=>true, 'on' => 'Unsubscribe'),
            array('dtfrom', 'safe', 'on' => 'Unsubscribe')
		);
	}

	public function attributeLabels() {
		return array(
		);
	}

    /**
     * Promo Unsubscribe
     */
    public function Unsubscribe()
    {
        return $this->insupdActionStaff(true);
    }

    private function insupdActionStaff($delete = false) {
        try {
            $dtfrom = $delete ? date('Y-m-d H:i:s', strtotime($this->dtfrom)) : date('Y-m-d H:i:s');
            $struct = array(
                'actionid' => (integer)$this->actionid,
                'uid'      => (integer)Yii::app()->user->getId(),
                'vgid'     => (integer)$this->vgid,
                'agrmid'   => (integer)$this->agrmid,
                'dtfrom'   => $dtfrom
            );
            if ($delete) {
                $struct['dtto'] = date('Y-m-d H:i:s');
                $struct['recordid'] = $this->recordid;
            }
            //Dumper::dump($struct);
            //Dumper::dump($this);
            // recordid, actionid, uid, agrmid, vgid, tarid, archive, dtfrom, dtto
            if( false === ($result = Yii::app()->controller->lanbilling->save("insupdActionStaff", $struct, $delete ? false : true)) ) {
            	throw new Exception (Yii::app()->controller->lanbilling->soapLastError()->detail);
            }
            $this->errorMsg = "";            
        }
    	catch(Exception $error) {
            	$this->errorMsg = $error->getMessage();
            	Yii::log(__METHOD__.'Error while apply action. Detail: '.$error->getMessage(), 'error', 'error');
            	return false;
            }
        return true;
    }

    /**
     * apply promo
     */
    public function ApplyPromo()
    {
        return $this->insupdActionStaff();
    }


    /**
     * Получение списка действующих акций
     */
    public function getPromoStaff() {
		$_filter = array(
            'archive' => 0
        );
		if( false != ($promoArray = Yii::app()->controller->lanbilling->get("getActionsStaff", array("flt" => $_filter), true))){
			if(!is_array($promoArray)) {$promoArray = array($promoArray);}
		}else $promoArray = array();
        /**
         * Преобразуем массив в одномерный
         */
        if (count($promoArray) > 0){
            $promoArray = Arr::obj2arr($promoArray); // объект->массив
            foreach ($promoArray as $promoVal){
                $promoClearArray[] = Arr::flatten($promoVal);
            }
            $promoArray = $promoClearArray;
        }
        //Dumper::dump($promoArray);
		return new CArrayDataProvider(Arr::obj2arr($promoArray), array(
			'id'=>'promoStaff',
            'keyField' => 'recordid',
			'sort'=>array(
				'attributes'=>array(
					'uid','agrmid', 'vgid'
				),
			),
			'pagination'=>false
		));
    }


    /**
     * Получение списка доступных акций
     *
     * @param boolean $group Группировка по акциям
     * @param boolean $clear Вернуть массив или объект CArrayDataProvider
     */
    public function getAvailablePromo( $group = false, $clear = false ) {
		$_filter = array(
            'userid' => Yii::app()->user->getId(),
            'archive' => 0,
        );
		if( false != ($avlPromoArray = Yii::app()->controller->lanbilling->get("getClientActions", array("flt" => $_filter), true))){
			if(!is_array($avlPromoArray)) {$avlPromoArray = array($avlPromoArray);}
		}else $avlPromoArray = array();

        if (count($avlPromoArray) > 0){
            $avlPromoArray = Arr::obj2arr($avlPromoArray); // объект->массив
            $promoClearArray = array();

            $promoClearArrayCount = array();

            //Dumper::dump($avlPromoArray);

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
                }
                else
                    $promoClearArray[] = Arr::flatten($promoVal);
            }
            // Добавляем счетчик числа однотипных акций в каждый элемент массива
            if ($group)
                $promoClearArray = Arr::merge($promoClearArray,$promoClearArrayCount);
        } else {
            $promoClearArray = array();
        }
        //Dumper::dump($promoClearArray);

        // Обнуление ключей массива при группировке по акциям для CGridView
        if ($group)
            $promoClearArray = array_values($promoClearArray);

        if ($clear) return $promoClearArray;

		return new CArrayDataProvider(Arr::obj2arr($promoClearArray), array(
			'id'=>'promoStaff',
            'keyField' => 'recordid',
			'sort'=>array(
				'attributes'=>array(
					'recordid','actionname'
				),
			),
			'pagination'=>false,
		));
    }


    /**
     * promoType 1 - пользователь, 2 - договор, 3 - У.З.
     */
    public function getAvailablePromoByParam()
    {
        $data = $this->getAvailablePromo(false,true);
        if(count($data) > 0)
        {
            $promoList = array();
            foreach ($data as $k => $promo){
                if ($this->recordid == $promo['recordid']){
                    $promoList[] = $promo;
                } else continue;
            }
        } else return array();
        //Dumper::dump($promoList);
      return $promoList;
    }

    public function getClientVgroupsArr()
    {
        $arr = array();
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", array("id" => Yii::app()->user->getId()))) ) {
            if(!empty($result)) {
                if(!is_array($result)) { $result = array($result); }
                return $result;
            }
        }
        return array();
    }


}
