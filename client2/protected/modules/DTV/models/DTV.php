<?php
/**
 * Support data model
 */
class DTV extends CFormModel {
    
    public $account = false;

    public function rules() {
        return array(
            //array('ticketId', 'required', 'on' => 'sbssActions'),
        );
    }

    public function attributeLabels() {
        return array(
        );
    }
	
	static public function detachLink($data) {
		return CHtml::link(Yii::t('DTVModule.smartcards', 'Unsubscribe'),array(
			'/DTV/Equipment/DetachEquipment',
			'equipid' => $data['equipid']
		));
	} 
    
    static public function check_unlimited_timeto($yyyy_mm_dd) {
        $d = preg_split('/[\-: ]/', $yyyy_mm_dd);
        if (!$d) return false;
        if((int)$d[0] > 3000) return true;
        return false;
    }
    
    public function get_personal_tv_chanel_checkbox($data,$row) {
        $checked = $this->get_personal_tv_chanel_assigned($data,$row);
        if (!$data['available']) {
            if ($checked) $hidden = Chtml::hiddenField('catidx[]', $data['catidx']);
            else $hidden = '';
            $checked_html = $checked ? ' checked="checked"' : '';
            return $html = '<input type="checkbox" disabled="disabled"'.$checked_html.' />'.$hidden;
        }        
        else return $html = Chtml::checkBox(
                'catidx[]', 
                $checked, 
                array('value' => $data['catidx'])
       );
    }
    
    public function get_personal_tv_chanel_assigned($data,$row) {
        return ( $data["servid"] > 0 AND ($data["assigned"] == 1 OR $data["assigned"] == 0) AND DTV::not_expired($data["timeto"]) );
    }
    
    public function get_personal_tv_chanel_status($data,$row) {
       if ( DTV::get_personal_tv_chanel_assigned($data,$row) ) return "<em style='color:green;'>".yii::t('DTVModule.smartcards','Assigned')."</em>";
       else return "<em>".yii::t('DTVModule.smartcards','NotAssigned')."</em>";
    }
    
    static public function not_expired($yyyy_mm_dd){
        if (self::check_unlimited_timeto($yyyy_mm_dd)) return true;
        if (strtotime($yyyy_mm_dd) > time()) return true;
        return false;
    }
    
    /**
    * Get smart cards
    * @param  boolean $new Flag to show new messages
    * @return array
    */
    public function getSmartCards()
    {
        $_filter = array();
        if( false != ($result = Yii::app()->controller->lanbilling->get("getSmartCards", array("flt" => $_filter), true))){
            if(!is_array($result)) {$result = array($result);}
        }else $result = array();
        return $this->objectToArray($result);
    }
    
    
    /**
    * Get devices list
    *
    * @param  boolean $new Flag to show new messages
    * @return array
    */
    public function getEquipment($smartcard = false)
    {
        $_filter = array(
            //'getEquipment'
        );
        $_filter = array();
        if( false != ($result = Yii::app()->controller->lanbilling->get("getEquipment", array("flt" => $_filter), true))){
            if(!is_array($result)) {$result = array($result);}
        }else $result = array();
        return $this->objectToArray($result);
    }


    /**
     * Get list of devices for client or smart-card
     *
     * @param  integer $smartCardId Select related devices for Smart-card or all available devices if $smartCardId == 0
     * @return array()
     */
    public function getFreeDevices( $smartCardId=0 )
    {
        $equipment = $this->getEquipment();
        $freeDeviceList = array();
        if (count($equipment)>0){
            foreach ($equipment as $device){
                if ((integer)$smartCardId > 0 && ( $device['equipment']['cardid'] ==  (integer)$smartCardId) )
                    $freeDeviceList[] = $device;
                elseif ($smartCardId == 0 && $device['equipment']['cardid'] == 0)
                    $freeDeviceList[] = $device;
                else continue;
            }
        }
        return $freeDeviceList;
    }

    /**
     * Return the list of tv channels
     * @param   integer, vgid
     * @param   boolean, filter to exclude categories without uuid
     * @param   boolean
     * @param   array, optional filter to pass to the soap
     */
    public function getTVPackages( $smartCardVgId = 0, $allchanels = false, $excludeMobility = true, $flt = array() )
    {
        /**
         * Get packages from config
         */     
        
        $services_model = new Services;
        $services_model->getServiceFunctions();
        $service_functions_uuids = $services_model->stored('service_functions_uuids');
        
        $packages = Yii::app()->controller->module->packages;
        $packagesList = array();
        /**
         * Get packages list for exact Smart-Card
         */
        $_filter = array_merge(array(
            'vgid' => (integer)$smartCardVgId,
            'common' => 1,
            'unavail' => -1
        ), $flt);
        
        $mobility = Yii::app()->controller->lanbilling->getOption("smartcard_usbox_tag");
        if( false != ($result = Yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true))){
            if(!is_array($result)) {$result = array($result);}
            if (count($packages)){ // Check config's packages list exists
                if (count($result)){
                    foreach ($result as $k=>$tarCat){
                        /**
                         * Exclude mobility option
                         */
                        if ($excludeMobility) {
                            if ($tarCat->uuid == $mobility) continue;
                        }
                        /**
                         * Form packages or chanels list
                         */
                        if (!empty($tarCat->uuid) && $allchanels){
                            if (!in_array($tarCat->uuid, $packages))
                                if ($services_model->reg_match_in_array($tarCat->uuid,$service_functions_uuids) === false) $packagesList[] = $tarCat;
                        } elseif (!empty($tarCat->uuid) && in_array($tarCat->uuid, $packages)){
                            if ($services_model->reg_match_in_array($tarCat->uuid,$service_functions_uuids) === false) $packagesList[$tarCat->catidx] = $tarCat;
                        }
                        else
                            continue;
                    }
                }
            }
        }
        
        
        //return $this->objectToArray($packagesList);
        // магия для обнуления ключей массива
        return $this->objectToArray(array_values($packagesList));
    }

    
    /**
     * Checks id there turned on personal TV
     * @param   integer, look for vgid
     * Returns boolean
     */
    public function isPersonalTVOn( $vgid = 0 )
    {
        if(!(integer)$vgid) {
            return false;
        }
        
        $mobility = Yii::app()->controller->lanbilling->getOption("smartcard_usbox_tag");
        
        $_filter = array(
            'vgid' => (integer)$vgid,
            'common' => 1,
            'unavail' => -1,
            'needcalc' => 1,
            'defaultonly' => 1
        );
        
        if( false != ($result = Yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true))){
            if(!is_array($result)) {
                $result = array($result);
            }
            
            $packages = (array)Yii::app()->controller->module->packages;
            
            if(empty($result)){
                return false;
            }
            
            foreach ($result as $k=>$tarCat){
                // Exclude mobility option
                if ($tarCat->uuid == $mobility) {
                    continue;
                }
                
                if (!empty($tarCat->uuid) && in_array($tarCat->uuid, $packages)) {
                    continue;
                }
                
                return true;
            }
        }
        
        return false;
    } // end isPersonalTVOn()
    
    
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

    function getAgrmByVGID( $vgid )
    {
        if ($this->account)
            return $this->account;

        $_filter = array(
        );
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientAccount", array("flt" => $_filter), true))){
            if(!is_array($result)) {
                $result = array($result);
            }
        }
        $this->account = $this->objectToArray($result);
        return $this->account;
    }


}
