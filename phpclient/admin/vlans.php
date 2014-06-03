<?php

class lbVlans extends LANBilling {

    public $_filter  = FALSE;
    public $_input   = FALSE;
    public $output   = FALSE;
    public $localize = FALSE;

    function __construct($localize = false)
    {
        parent::__construct();
        $this->localize = $localize;
    }

    /**
     * Main action to controll input data and switching requests
     * @category sistem.lbVlans
     * @return string String in JSON formate.
     */
    public function handling()
    {
        switch (trim($_POST['action'])){
            case 'getVlans'  : return $this->getVlans();    break;
            case 'insUpdVlan': return $this->insUpdVlans(); break;
            case 'searchVlan': return $this->searchVlan();  break;
            case 'delVlan'   : return $this->delVlan();     break;

			case 'delVlanFromGroup' : return $this->delVlanFromGroup(); break;
			case 'addVlanToGroup'   : return $this->addVlanToGroup();   break;

            default: return FALSE;
        }
    }


    /**
     * getVlans
     * Get list of existing Vlans
     *
     * @return JSON data
     */
    function getVlans()
    {
        $this->setFilter('procname', 'getVlans');
		if (isset($_POST['forGroup']) && (integer)$_POST['forGroup'] > 0) {
			$this->setFilter('groupid', (integer)$_POST['forGroup']);
		}elseif(isset($_POST['forGroup']) && (integer)$_POST['forGroup'] == 0){
			return $this->makeOutput();
		}

        /**
         * Фильтр поиска по name или outer_vlan
         */
		if (isset($_POST['search']) && !empty($_POST['search'])){
			if (preg_match('~v\d*~is',$_POST['search']))
				$this->setFilter('numfrom', substr(trim($_POST['search']),1));
			else
				$this->setFilter('name', trim($_POST['search']));
		}

        /**
         * Фильтр поиска не занятых vlan для группы устройств
         */
        if (isset($_POST['notgroups'])){
            $this->setFilter('notgroups', 1);
        }

		if (!isset($_POST['alldata'])){
			$this->Paginator();
		}

        //print_r($this->getFilter());

        if( FALSE !== ( $vlans = ($res = $this->get('getVlans', $this->getFilter())) ) ) {
            $countTotal = $this->get("Count", $this->getFilter(true));
			$vlans = (is_array($vlans)) ? $vlans : array($vlans);
            $res= $this->makeOutput($this->objectToArray($vlans), $countTotal);
            return $res;
        } else {
            return $this->makeOutput(FALSE);
        }
    }

    /**
     * insUpdVlans
     *
     * Insert or Update Vlans
     */
    protected function insUpdVlans()
    {
        $insUpdVlan = array(
            'outervlan' => (integer)$_POST['outervlan'],
            'innervlan' => (integer)$_POST['innervlan'],
            'name' => $_POST['name'],
            'type' => $_POST['type']
        );

        if ((integer)$_POST['isInsert'] == 1){
            $isInsert = true;
        }else{
            $isInsert = false;
            $insUpdVlan['recordid'] = $_POST['recordid'];
        }

        /*
		if(( 0 < ($exist = $this->get('getVlanID', array('number'=>$_POST['outervlan']))) ) && $isInsert){
            return $this->returnError('Vlan '.$_POST['outervlan'].' already exists!');
        } else {*/
            if( FALSE !== ($result = $this->save('insupdVlan', $insUpdVlan, $isInsert)) ){
                return $this->returnOk();
            } else {
                return $this->returnError();
            }
        //}
    }

    protected function searchVlan()
    {
        $this->returnOk();
    }

    protected function delVlan($vlan_id = false)
    {
        $vlan_id = ($vlan_id !== false) ? $vlan_id : (integer)$_POST['vlan_id'];
        if( false == ($res = $this->delete("delVlan", array('id'=>$vlan_id), array('getVlans'))) ) {
            return $this->returnError('Сan\'t delete vlan!');
        }
        else {
            return $this->returnOk();
        }
    }


	/**
	 *	Working with inventory groups
	 */
	protected function delVlanFromGroup()
    {
		$delGrVlan = array(
			'groupid' => $_POST['group_id'],
			'vals' => (object)$this->objectToArray(json_decode($_POST['vlan']))
		);

		if( false == ($res = $this->delete("delGroupVlans", array('delvlans'=>(object)$delGrVlan), array('getGroupVlans'))) ) {
            return $this->returnError('Сan\'t delete vlan!');
        }
        else {
            return $this->returnOk();
        }
    }
	protected function addVlanToGroup()
    {
        $insGrVlan = array(
			'groupid' => $_POST['group_id'],
			'vals' => $this->objectToArray(json_decode($_POST['vlan']))
		);
		if( FALSE !== ($result = $this->save('addGroupVlans', $insGrVlan, true)) ){
			return $this->returnOk();
		} else {
			return $this->returnError();
		}
    }

    /***********************************  SYSTEM  ***********************************/

    /**
     * Set paginator options to filter
     * @return void
     */
    protected function Paginator()
    {
        $this->setFilter("pgnum", $this->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1));
		$this->setFilter("pgsize", ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : ""));
    }

    public function returnOk()
    {
        return '({ success: true })';
    }
    public function returnError( $reason = false, $detail = false )
    {
        if (!$reason && !$detail){
            $error = $this->soapLastError();
            return '({ success: false, error: { reason: "'.$error->detail.'" } })';
        }

        if ($reason !== false){
            $rdOut = ', error: { reason: "'.$reason.'" }';
        }
        return '({ success: false '.$rdOut.'})';
    }


    /**
     * Set filter for SOAP actions
     *
     * @param string $key
     * @param string $value
     *
     * @example $this->setFilter('param1', 'value1');
     */
    public function setFilter( $key, $value )
    {
        if ($key == 'procname')
            $this->_filter['procname'] = $value;
        else
            $this->_filter['flt'][$key] = $value;
    }
    /**
     * Returns array of filter data, setted by setFilter function
     * @return array $_filter
     */
    public function getFilter($procname = false)
    {
        if (!empty($this->_filter))
            return ($procname == true) ? $this->_filter : array('flt' => $this->_filter['flt']);
        else
            return array();
    }
    /**
     * Make output data in right format for interface
     * @param mixed $output
     */
    protected function makeOutput( $output, $total = false)
    {
		if(is_array($output) && count($output) > 0) {
            return '({'.(($total !== false) ? '"total":'.$total . ', ' : '').'"results": ' . JEncode($output, $this) . '})';
        }
        elseif (is_string($output)) {
            return '({'.$output.' })';
        }
        elseif (FALSE === $output){
            return '({ success: false, error: { reason: "Unknown action!" } })';
        } else {
            return '({ results: "" })';
        }
    }


}




/**
 * Processing queryes from interface
 */

if(isset($_POST['async_call']))
{
    try  {
        $vlans = new lbVlans($localize);
        echo $vlans->handling();
    }  catch (Exception $e) {
    }
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("vlans.tpl", true, true);
	$tpl->touchBlock('__global__');
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$localize->compile($tpl->get(), true);
}
