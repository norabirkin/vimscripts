<?php
/**
 * Support data model
 */
class User extends CFormModel {

	public $client;
	public $addresses;
	public $agreements;
	public $account;
	public $vgroups;

	public function init()
	{
		if (!$this->client) $this->Client();
	}

	/**
	 * Get client Vgroups
	 * @param $agrmId int Return vgroups for this agreement
	 */
	function getVgroupsList( $agrmId = false )
	{
		if ($agrmId > 0) {
			$_filter = array(
				'flt' => array(
					"agrmid" => $agrmId
				)
			);
		} else $_filter = array();

		$accVg = array();
		if ( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", $_filter)) )
		{
			if(!empty($result)) {
				if(!is_array($result)) {
					$result = array($result);
				}
				return $this->objectToArray($result);
			}
		}
	} // end getVgroupsList()



	public function getAccount()
	{
		return $this->account;
	}

	public function getAgreements()
	{
		return $this->agreements;
	}

	public function getAddresses()
	{
		return $this->addresses;
	}

	/**
	 * Get client full information
	 *
	 */
	public function Client($flush = false)
	{
		if( false == ($this->client = Yii::app()->controller->lanbilling->get("getClientAccount", array("id" => Yii::app()->user->getId()), $flush))) {
			Yii::app()->controller->lanbilling->Logout();
		}
		$this->addresses = $this->client->addresses;
		$this->agreements = $this->client->agreements;
		//$this->addons = $this->client->addons;

		if(isset($this->addresses)) {
			if(!is_array($this->addresses)) {
				$this->addresses = array($this->addresses);
			}
		}
		if(isset($this->agreements)) {
			if(!is_array($this->agreements)) {
				$this->agreements = array($this->agreements);
			}
		}
		if(isset($this->addons)) {
			if(!is_array($this->addons)) {
				$this->addons = array($this->addons);
			}
		}
		//return $this->client;
	} // end getClient()


    /**
    * Convert an object to an array
    *
    * @param   object  $object The object to convert
    * @return  array
    *
    * @todo    Move to the main class
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
