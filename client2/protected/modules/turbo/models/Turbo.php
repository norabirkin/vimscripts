<?php
/**
 * Turbo data model
 */
class Turbo extends CFormModel {

    public $staff = false;

    public $vgroupsList;

    public $vgroup;
    public $service;
    public $duration;

    public $cost;

    public $save;


    public function rules() {
        return array(
            array('vgroup', 'required', 'on' => 'selectVG'),
            array('vgroup', 'numerical', 'integerOnly'=>true),
            array('service', 'required', 'on' => 'selectService'),
            array('service', 'numerical', 'integerOnly'=>true),

            array('duration', 'required', 'on' => 'selectDuration'),
            //array('duration', 'numerical', 'integerOnly'=>true, 'min'=>Yii::app()->controller->module->minDuration, 'max' => (Yii::app()->controller->module->maxDuration) ? Yii::app()->controller->module->maxDuration : 9999),
            array(
                'duration',
                'numerical',
                'integerOnly'=>true,
                'min'=>Yii::app()->controller->module->minDuration,
                'max' => Yii::app()->controller->module->maxDuration
            ),

            //array('save', 'required', 'on' => 'summary'),

        );
    }

    public function attributeLabels() {
        return array(
            'vgroup'   => Yii::t('TurboModule.Turbo', 'User account'),
            'service'  => Yii::t('TurboModule.Turbo', 'Services'),
            'duration' => Yii::t('TurboModule.Turbo', 'Length of service'),
            'cost'     => Yii::t('TurboModule.Turbo', 'Cost'),
            'save'     => Yii::t('TurboModule.Turbo', 'save'),
        );
    }

    function init()
    {
        if (!Arr::is_array($this->staff))
            $this->staff = $this->getUSBoxCategories();
    }

    /**
     * Get available vgroups for turbo
     */
    public function getAvlAccounts()
    {
        if (Arr::is_array($this->staff['vgroups']) && count($this->staff['vgroups']) > 0) {
            return CHtml::listData(
                $this->objectToArray($this->staff['vgroups']),
                'vgid',
                'login'
            );
        } else return FALSE;
    }

    /**
     * Get turbo vgroup by vg_id
     *
     * @param $id integer RADIUS vg_id
     * @param $param array Array of params need be returned from RADIUS vgroup
     *
     * @return array
     */
    public function getTurboVGByID( $id, $param = array() )
    {
        if (count(Arr::path($this->staff, 'vgroups', array())) > 0){
            if (in_array($id, array_keys(Arr::path($this->staff, 'vgroups', array())))){
                $vgArr = Arr::path($this->staff, 'vgroups.'.$id, FALSE);
                if (Arr::is_array($param) && count($param) > 0 && Arr::is_array($vgArr)){
                    return Arr::extract($vgArr, $param, FALSE);
                }
                return $vgArr;
            } else return FALSE;
        } else return FALSE;
    }

    /**
     * Get services for UsBOX
     *
     * @param $agrmid integer Agreement ID
     * @param $catidx integer CATIDX of service
     * @param $param array Array of params need be returned from service
     *
     * @return array
     */
    public function getUsBOXServicesByAgrmID( $id, $catidx = 0, array $param = array() )
    {
        if (count(Arr::path($this->staff, 'usbox', array())) > 0){
            foreach (Arr::path($this->staff, 'usbox', array()) as $key => $usboxVgroup) {
                if ($usboxVgroup['agrmid'] == $id){
                    if ( Arr::is_array($param) && count($param) > 0 && $catidx ){
                        return Arr::extract(Arr::path($usboxVgroup, 'items.'.$catidx), $param, FALSE);
                    }
                    return $usboxVgroup;
                }
            }
            return FALSE;
        } else return FALSE;
    }

    /**
     * Get Agreement balance by ID
     *
     * @param $agrmId integer Agreement ID
     * @param $param array Array of params need be returned from agreement array
     */
    public function getAgrmData( $agrmId, $param = array() )
    {
        $arrIt = new RecursiveIteratorIterator(new RecursiveArrayIterator( Yii::app()->controller->lanbilling->clientInfo->agreements ));
        foreach ($arrIt as $sub) {
            $subArray = $arrIt->getSubIterator();
            if ($subArray['agrmid'] === $agrmId) {
                if (Arr::is_array($param) && count($param) > 0){
                    return Arr::extract(iterator_to_array($subArray), $param, FALSE);
                }
                return iterator_to_array($subArray);
            }
        }
        return $outputArray;
    }

    /**
     * Get the list of the services for USBox tariff according to passed account identification
     * number and its tariff settings
     * @param    object, billing class
     */
    public function getUSBoxCategories( )
    {
        $_tmp = array(
            "usbox" => array(),
            "vgroups" => array(),
            "shape" => array()
        );
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups")) ) {
            if(!is_array($result)) {
                $result = array($result);
            }
            $this->vgroupsList = $result;
            $agrms = array();
            foreach(Yii::app()->controller->lanbilling->clientInfo->agreements as $item) {
                $agrms[$item->agrmid] = $item;
            }
            // Search USBox vgroup item
            array_walk($result, create_function('$item, $key, $_tmp', '
                if($item->vgroup->tariftype == 5) {
                    $_tmp[0]["usbox"][$item->vgroup->vgid] = array(
                        "vgid" => $item->vgroup->vgid,
                        "agrmid" => $item->vgroup->agrmid,
                        "number" => $_tmp[1][$item->vgroup->agrmid]->number,
                        "tarid" => $item->vgroup->tarifid,
                        "login" => $item->vgroup->login,
                        "tarifdescr" => $item->vgroup->tarifdescr,
                        "symbol" => $_tmp[1][$item->vgroup->agrmid]->symbol
                    );
                }
                if($item->vgroup->tariftype < 3 && $item->vgroup->blocked == 0 && $item->vgroup->blkreq == 0) {
                    $_tmp[0]["vgroups"][$item->vgroup->vgid] = array(
                        "vgid" => $item->vgroup->vgid,
                        "agrmid" => $item->vgroup->agrmid,
                        "tarid" => $item->vgroup->tarifid,
                        "login" => $item->vgroup->login,
                        "tarifdescr" => $item->vgroup->tarifdescr
                    );
                    if(!empty($item->turboshape)) {
                        if(!is_array($item->turboshape)){
                            $item->turboshape = array($item->turboshape);
                        }
                        foreach($item->turboshape as $K => $I) {
                            $I->tarid = $item->vgroup->tarifid;
                            $_tmp[0]["shape"][] = (array)$I;
                        }
                    }
                }
            '), array( &$_tmp, $agrms ));
        }


        if(!empty($_tmp["usbox"])) {
            foreach($_tmp["usbox"] as $key => $item) {
                $_tmp['usbox'][$key]['items'] = array();
                $turbo = false;

                if( false != ($result = Yii::app()->controller->lanbilling->get("getTarCategories", array("id" => $_tmp['usbox'][$key]['tarid']))) )
                {
                    if(!is_array($result)) {
                        $result = array($result);
                    }

                    array_walk($result, create_function('$item, $key, $_tmp', '
                        if(!preg_match(Yii::app()->controller->module->categoryPrefix, $item->uuid) || (integer)$item->available < 1) {
                            return;
                        }
                        if(!Yii::app()->controller->module->longActionService && $item->common > 0) {
                            return;
                        }
                        if($_tmp[2] === false) {
                            $_tmp[2] = true;
                        }
                        $_tmp[0][$item->catidx] = (array)$item;
                        $_tmp[0][$item->catidx]["vgid"] = $_tmp[1];
                    '), array( &$_tmp["usbox"][$key]["items"], $key, &$turbo ));
                }

                if(!$turbo) {
                    unset($_tmp["usbox"][$key]);
                }
            }
        }

        return $_tmp;
    } // end getUSBoxCategories()






    /**
     * Save passed service
     * @param    object, billing class
     */
    public function setCurrentTurbo( $serv_vg_id, $tarid, $catidx, $duration, $account_vg)
    {
        $struct = array(
            "servid"    => 0,
            "vgid"      => (integer)$serv_vg_id, // (integer)$_POST['servvgid'],
            "tarid"     => (integer)$tarid,
            "catidx"    => (integer)$catidx,
            "mul"       => ((integer)$duration <= 0) ? 1 : $duration,
            "timefrom"  => Yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s'),
            "comment"   => (integer)$account_vg,
            "rate" => 1
        );
        if( false == ($result = Yii::app()->controller->lanbilling->save("insupdClientUsboxService", $struct, ((integer)$struct['servid'] > 0) ? false : true, array("getVgroupServices")))) {
            return FALSE;
        }
        else {
            return TRUE;
        }
    } // end setCurrentTurbo()




    /**
     * Returns short data
     * @param    array, services
     */
    public function prepareServices( $data = array())
    {
        $_tmp = array();

        array_walk($data, create_function('$item, $key, $_tmp', '
            array_push($_tmp[0], array_intersect_key($item, array(
                "catidx" => "", "descr" => "", "above" => "", "symbol" => "", "tarid" => "", "vgid" => "", "common" => ""
            )));
        '), array( &$_tmp ));

        return $_tmp;
    }


    /**
     * Get current turbo-records for this client
     */
    public function getCurrentTurbo()
    {
        return new CArrayDataProvider($this->objectToArray($this->staff['shape']), array(
            'id'=>'recordid',
            'keyField' => 'recordid',
            'sort'=>array(
                'attributes'=>array(
                    'timefrom','timeto',
                ),
            ),
        ));
    } // end getCurrentTurbo()

    /**
    * Convert an object to an array
    *
    * @param  object  $object The object to convert
    * @return array
    */
    public function objectToArray( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) ) {
            return $object;
        }
        if( is_object( $object ) ) {
            $object = get_object_vars( $object );
        }
        return array_map(array($this, __FUNCTION__), $object);
    }
}
