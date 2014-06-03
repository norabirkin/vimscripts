<?php //
// Request processor class.
//
class RsAg_Processor
{
    /**
     * Valid response codes.
     */
    const OK = "OK";
    const USER_UNKNOWN_UUID = "USER_UNKNOWN_UUID";
    const USER_UNKNOWN_TXID = "USER_UNKNOWN_TXID";
    const USER_NO_MONEY = "USER_NO_MONEY";
    const USER_ERROR = "USER_ERROR";  
    const USER_DUPLICATE_TXID = "USER_DUPLICATE_TXID";
    
    /**
     * Tariff ID.
     *
     * @var int
     */
    private $_tariffId = NULL;
    
    /**
     * LANBilling API.
     *
     * @var object
     */
    private $_lanbilling = NULL;
	
	private $usbox_agent_id = NULL;
	
	private $only_agent_ids = array();
	
	private $min_balance_allowed = 0;
    
    /**
     * Return information about set of users specified by 
     * list of user IDs.
     * 
     * @param object[] $uuids;
     * @return RsAg_UserInfoResponse[]
     */
	
	function __construct($params) {
		$this->setLanbillingClass($params['lanbilling']);
		$this->setTariffID($params['lanbilling_tarif_id']);
		$this->setUsboxAgentID($params['usbox_agent_id']);
		$this->setOnlyAgentIDs($params['only_agent_ids']);
		$this->setMinBalanceAllowed($params['min_balance_allowed']);
	}
	
    private function setLanbillingClass(LANBilling $lanbilling) {
    	$this->_lanbilling = $lanbilling;
    }
	
	private function setTariffID($tariffID) {
		if (!$this->validateID($tariffID)) throw new Exception('Invalid tariff ID');
		$this->_tariffId = (int) $tariffID;
	}
	
	private function setUsboxAgentID($usbox_agent_id) {
		if (!$this->validateID($usbox_agent_id)) return;
		$this->usbox_agent_id = $usbox_agent_id;
	}
	
	private function setOnlyAgentIDs($only_agent_ids) {
		if (!$only_agent_ids) return;
		if (!is_array($only_agent_ids)) return;
		foreach ($only_agent_ids as $agent_id) if (!$this->validateID($agent_id)) return;
		$this->only_agent_ids = $only_agent_ids;
	}
	
	private function setMinBalanceAllowed($min_balance_allowed) {
		if (!is_numeric($min_balance_allowed)) return;
		$this->minBalanceAllowed = $min_balance_allowed;
	}
	
	private function validateID($id) {
    	if(!is_numeric($id) OR ((int) $id <= 0)) return false;
		else return true;
    }
	
	 /**
     * Terminates admin session.
     *
     * @return void
     */
    public function logout()
    {
        if ($this->_lanbilling) $this->_lanbilling->Logout();
    }
	
	/**
     * Return information about set of users specified by 
     * list of user IDs.
     * 
     * @param object[] $uuids;
     * @return RsAg_UserInfoResponse[]
     */
    public function getUserInfo($uuids)
    {
        if (!count($uuids)) {
            throw new Exception('Empty UUID list passed');
        }
        $result = array();
        foreach ($uuids as $req) {
            $this->_log("getUserInfo", $req);
            $item = new stdclass();
            $item->uuid = $req->uuid;
            $row = $this->_getAccountInfo($req->uuid);
			
            // Store the result.
            if ($row) {
                $item->error = self::OK;
                $item->periodStartDay = 1; // LANBilling has only this kind of discount period
                $item->timeShift = intval(date("Z") / 3600);
                $item->amount = $row['balance'];
                $item->tariffId = join(" ", $row['tariff_ids']);
            } else {
                $item->error = self::USER_UNKNOWN_UUID;
            }
            $result[] = $item;
        }
        return $result;
    }
    
    /**
     * Checks if we could charge specified users.
     *
     * @param RsAg_ChargeRequest[] $requests
     * @return RsAg_TxidResponse[]
     */
    public function canCharge($requests)
    {
        if (!count($requests)) {
            throw new Exception('Empty list passed');
        }
        $result = array();
        foreach ($requests as $req) {
        	$activeMutex = $this->aquireMutex($req->uuid);
            $this->_log("canCharge", $req);
            $item = new stdclass();
            $item->txid = $req->txid;
            // Store the result.
            $row = $this->_getAccountInfo($req->uuid);
            if (!$row) {
                $item->error = self::USER_UNKNOWN_UUID;
            } else if ($this->_isNotEnoughMoney($row, $req->amount)) {
                $item->error = self::USER_NO_MONEY;
            } else {
                $item->error = self::OK;
            }
            $result[] = $item;
            $this->releaseMutex($activeMutex);
        }
        return $result;
    }
    

    /**
     * Charges specified users.
     *
     * @param RsAg_ChargeRequest[] $requests
     * @return RsAg_TxidResponse[]
     */
    public function charge($requests)
    {
        if (!count($requests)) {
            throw new Exception('Empty UUID list passed');
        }
        $result = array();
        foreach ($requests as $req) {
        	$activeMutex = $this->aquireMutex($req->uuid);
            $this->_log("charge", $req);
            $item = new stdclass();
            $item->txid = $req->txid;
            // Firch, check if we have already processed this txid.
            $row = $this->_getAccountInfo($req->uuid);
            if (!$row) {
                $item->error = self::USER_UNKNOWN_UUID;
            } else if (isset($row['txids'][$req->txid])) {
                // We have already processed this transaction.
                $item->error = self::USER_DUPLICATE_TXID;
            } else if ($this->_isNotEnoughMoney($row, $req->amount)) {
                $item->error = self::USER_NO_MONEY;
            } else {
                // We have enough money, charge.
                $item->error = self::OK;
                $this->_doCharge($row, $req);
            }
            $result[] = $item;
            $this->releaseMutex($activeMutex);
        }
        return $result;
    }
    
    /**
     * Uncharges specified users.
     *
     * @param RsAg_UnchargeRequest[] $requests
     * @return RsAg_TxidResponse[]
     */
    public function uncharge($requests)
    {
        if (!count($requests)) {
            throw new Exception('Empty UUID list passed');
        }
        $result = array();
        foreach ($requests as $req) {
            $this->_log("uncharge", $req);
            $item = new stdclass();
            $item->txid = $req->txid;
            // Firch, check if we have already processed this txid.
            $row = $this->_getAccountInfo($req->uuid);
            if (!$row) {
                // Unknown user.
                $item->error = self::USER_UNKNOWN_UUID;
            } else if (!isset($row['txids'][$req->txid])) {
                // Unknown txid.
                $item->error = self::USER_UNKNOWN_TXID;
            } else {
                // Uncharge.
                $item->error = self::OK;
                $this->_doUncharge($row['txids'][$req->txid]);
            }
            $result[] = $item;
        }
        return $result;
    }    
    
    /**
     * Notifies agent that a service changed its status for a specified user.
     *
     * @param RsAg_NotifyStatusChangeRequest[] $requests
     * @return RsAg_TxidResponse[]
     */
    public function notifyStatusChange($requests)
    {
        if (!count($requests)) {
            throw new Exception('Empty UUID list passed');
        }
        $result = array();
        foreach ($requests as $req) {
        	$activeMutex = $this->aquireMutex($req->uuid);
            $this->_log("notifyStatusChange", $req);
            $item = new stdclass();
            $item->txid = $req->txid;
            $row = $this->_getAccountInfo($req->uuid);
            if (!$row) {
                $item->error = self::USER_UNKNOWN_UUID;
            } else {
                // Does nothing: notifyStatusChange is not needed for LanBilling.
                $item->error = self::OK;
            }
            $result[] = $item;
            $this->releaseMutex($activeMutex);
        }
        return $result;     
    }
    
    /**
     * Removes all references to Rentsoft services from UUIDs.
     *
     * @param object[] $uuids;
     * @return void
     */
    public function cleanupForTests($requests)
    {
        if (!count($requests)) {
            throw new Exception('Empty UUID list passed');
        }
        $result = array();
        foreach ($requests as $req) {
            $this->_log("cleanupForTests", $req);
            $item = new stdclass();
            $item->uuid = $req->uuid;
            $row = $this->_getAccountInfo($req->uuid);
       	    if (!$row) {
           		$item->error = self::USER_UNKNOWN_UUID;
           	} else {
           		$vgId = $this->_getOrCreateVgroupId($row);
		    	$services = $this->_lanbilling->get("getUsboxServices", array("flt" => array("vg_id" => $vgId)));
				if (!is_array($services)) $services = $services? array($services) : array();
				foreach ($services as $svc) {
           			$this->_lanbilling->delete("delUsboxService", array("id" => $svc->service->servid), array("getUsboxServices"));
				}
				// Manually change vgroup login to avoid unique index conflict.
				// We could not do that, but then we have to wait for N seconds until
				// UsBox agent will mangle the login asynchronously.
				if (false === $this->_lanbilling->save(
					"insupdVgroup",
					array("vgroup" => array("vgid" => $vgId, "id" => $row['agid'], "login" => 'del-' . uniqid('')), "tarrasp" => array()), 
					false, 
					array('getVgroups')
				)) {
					throw new Exception(print_r($this->_lanbilling->soapLastError(), 1));
				}
           		$this->_lanbilling->delete("delVgroup", array("id" => $vgId), array("getVgroups"));
	            $item->error = self::OK;
            }
            $result[] = $item;
        }
        return $result;     
    }
    
    /**
     * Writes request parameters.
     *
     * @param string $method
     * @param object $req
     * @return void
     */
    private function _log($method, $req)
    {
        $msg = array();
        if (is_array($req) || is_object($req)) {
            foreach ($req as $k => $v) {
                $msg[] = "$k=" . (preg_match('/\s/s', $v)? '"' . $v . '"' : $v);
            }
        } else {
            $msg = array($req);
        }
		
		yii::log(join(" ", $msg),'info','rsag_processor.'.$method);
    }

    /**
     * Helper function: checks that there is enough money.
     *
     * @param object $row   Accounts table row
     * @param numeric $amount
     * @return bool
     */
    private function _isNotEnoughMoney($row, $amount)
    {
        return $row['blocked'] || $row['balance'] - $amount < intval($this->min_balance_allowed);
    }
    
    /**
     * Helper function: performs charge operation for one item.
     *
     * @param array $accountInfo
     * @param object $req
     * @return void
     */
    private function _doCharge($accountInfo, $req)
    {
        // Perform charge via creation of a new single-time usbox_service.
        if (!preg_match('/^\d+-(\d+)-\d+/s', $req->periodEnd, $m)) {
            throw new Exception("Invalid date format at periodEnd: {$req->periodEnd}");
        }
        $struct = array(
            "servid"   => 0,
            "vgid"     => $this->_getOrCreateVgroupId($accountInfo),
            "tarid"    => $this->_tariffId,
            "catidx"   => $this->_getOrCreateCatIdx($accountInfo, $req->serviceName, $req->baseCost, intval($m[1])),
            "mul"      => $req->amount / $req->baseCost, // emulate recalculation
            "comment"  => $req->comment . " (txid=" . $req->txid . ")",
            "timefrom" => date('Y-m-d 00:00:00'),
            "timeto"   => $req->periodEnd,
            "rate"     => 1,
        );
        if (!$this->_lanbilling->save("insupdUsboxService", $struct, true, array("getUsboxServices"))) {
            throw new Exception($this->_lanbilling->soapLastError()->detail);
        }
    }

    /**
     * Helper function: performs uncharge operation for one item.
     *
     * @param array $accountInfo
     * @param object $req
     * @return void
     */
    private function _doUncharge($servid)
    {
        // When we delete UsboxService, it also returns money to account.
        if (!$this->_lanbilling->delete("delUsboxService", array("id" => $servid), array("getUsboxServices"))) {
            throw new Exception($this->_lanbilling->soapLastError()->detail . " - possibly it is not yet processed by usbox, wait 1 min");
        }
    }

    /**
     * Returns existed of create a new subscription vgroup.
     *
     * @param array $accountInfo
     * @param int $agrmId
     * @return int
     */
    private function _getOrCreateVgroupId($accountInfo)
    {
    	// We have already fetched this vg before.
    	if (isset($accountInfo['vgid'])) {
    		return $accountInfo['vgid'];
    	}
    
        // Check if we already have this vgroup.
        // ATTENTION: this returns only NON-ARCHIVED group. So if a group is archived,
        // we will create a new one below.
        $vg = $this->_lanbilling->get("getVgroups", $q = array("flt" => array(
            "tarid" => (int)$this->_tariffId, 
            "agrmid" => (int)$accountInfo['agrmid'],
        )));
		
        if (is_array($vg)) $vg = current($vg);
		
        if ($vg) {
        	return $vg->vgid;
		}

        // If not, create it.
        $struct = array(
            "vgroup" => array(
                "currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
                "creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",
                "vgid" => null,
                "cuid" => 0,
                "tarid" => $this->_tariffId,
                "uid" => $accountInfo['uid'],
                "agrmid" => $accountInfo['agrmid'],
                "id" => $accountInfo['agid'],
                "shape" => 0,
                "maxsessions" => 0,
                "templ" => null,
                "ipdet" => null,
                "portdet" => null,
                "accondate" => sprintf("%04d%02d%02d%02d%02d00", date("Y"), date("m"), date("d"), date("H"), date("i")),
                "descr" => '',
                "login" => "Услуги по договору " . $accountInfo['agrmnumber'] . " (" . time() . ")",
                "pass" => mt_rand(100000000, 200000000),
                "checkduplicate" => 0
            ),
            "tarrasp" => array(array(
                "recordid" => 1,
                'changetime' => date('Y-m-d 00:00:00'),
                "vgid" => null,
                "groupid" => 0,
                "id" => $accountInfo['agid'],
                "taridnew" => $this->_tariffId,
                "taridold" => 0,
                "requestby" => 9,
            )),
            "blockrasp" => array(array(
                "blkreq" => 0,
                "changetime" => sprintf("%04d%02d%02d%02d%02d00", date("Y"), date("m"), date("d"), date("H"), date("i")),
                "vgid" => 0,
            )),
        );
		
        if (!($ret = $this->_lanbilling->save("insupdVgroup", $struct, true, array("getVgroups")))) {
            throw new Exception($this->_lanbilling->soapLastError()->detail);
        }
        return $this->_lanbilling->saveReturns->ret;
    }
    
    /**
     * Returns existed of create a new subscription tariff category.
     * Category name is formatted as "$serviceName ($baseCost rub/mes)".
     *
     * @param array $accountInfo
     * @param string $serviceName
     * @param int $baseCost
     * @return int
     */
    private function _getOrCreateCatIdx($accountInfo, $serviceName, $baseCost, $month)
    {
        // Build service name. Service name includes its cost and
        // month name for which this service shoul be payed. It 
        // is done to correctly show service's comment at LanBilling
        // admin interface.
        $monthNames = array(1 => "январь", 2 => "февраль", 3 => "март", 4 => "апрель", 5 => "май", 6 => "июнь", 7 => "июль", 8 => "август", 9 => "сентябрь", 10 => "октябрь", 11 => "ноябрь", 12 => "декабрь");
        $monthName = @$monthNames[$month];
        if (!$monthName) throw new Exception("Invalid month number: $month");
        $catName = "$serviceName ($baseCost руб/мес, {$monthName})"; // unique name for this category.
        
        // Check if we already have this category.      
        $cats = $this->_lanbilling->get("getTarCategories", array("id" => $this->_tariffId));
		
        if (!is_array($cats)) $cats = $cats? array($cats) : array();
        foreach ($cats as $cat) {
            if ($cat->descr == $catName) return $cat->catidx;
        }
        
        // If not, create it.
        $options = array('tarcategory' => array(
            'operid' => $accountInfo['operid'],
            'tarid' => $this->_tariffId,
            'catidx' => -1,
            'includes' => 0,
            'common' => 0, // single-time service
            'above' => $this->_lanbilling->float($baseCost),
            'disprior' => 0,
            'descr' => $catName,
            'freeseconds' => 0,
            'minchargedur' => 0,
            'roundseconds' => 0,
            'permabove' => 0,
            'timediscounts' => array(),
            'sizediscounts' => array(),
        ));
		
        if (!($ret = $this->_lanbilling->save("insupdTarCategory", $options, true, array("getTarCategories")))) {
            throw new Exception($this->_lanbilling->soapLastError()->detail);
        }
        return $this->_lanbilling->saveReturns->ret;
    }
    
    /**
     * Returns account information (balance etc.).
     *
     * @param int $uuid
     * @return array
     */
    private function _getAccountInfo($uuid)
    {
        if (!is_numeric($uuid) || $uuid <= 0) return null;
        
        // Fetch agreement's balance.
        $agreement = $this->_lanbilling->get("getAgreements", array("flt" => array("agrmid" => $uuid)));
        if (!$agreement || $agreement->archive) return null;

        // Fetch vgroups (needed for tariff IDs and internet blocking check).
        $vgs = $this->_lanbilling->get("getVgroups", array("flt" => array("agrmid" => $uuid)));
        if (!is_array($vgs)) $vgs = $vgs? array($vgs) : array();

        // Fetch vgroups to detect tarif IDs.
        $tariffIds = array();
        foreach ($vgs as $vg) {
            $tariffIds[] = $vg->tarid;
        }
        $tariffIds = array_unique($tariffIds);

        // Build the result.        
        $info = array(
            'agrmid'     => $uuid,
            'uid'        => $agreement->uid,
            'agrmnumber' => $agreement->number,
            'blocked'    => $this->_isInternetBlocked($uuid, $vgs),
            'operid'     => $agreement->operid,
            'agid'       => $this->_getUsboxAgentId(),
            'tariff_ids' => $tariffIds,
            'balance'    => null, // filled later
            'txids'      => null, // filled later
            'vgid'       => null, // filled later
        );
        $info['vgid'] = $this->_getOrCreateVgroupId($info);
        
        //
		// Correct balance & fetch txids AFTER we had created vgid.
		// We must depend on vgid only! Agrmid dependence is INVALID,
		// because it is resolved via usbox_charge which may not be
		// processed yet at the time we are here (e.g. while duplicate txid
		// checking).
		//

        // Subtract all not yet processed service prices from the agreement's balance.
        // We need it, because USBox processes single services once per minute only.
        // Also collect existed TXIDs.
        $services = $this->_lanbilling->get("getUsboxServices", array("flt" => array("vgid" => $info['vgid'])));
        if (!is_array($services)) $services = $services? array($services) : array();
        $balance = $agreement->balance;

        $servicesByTxid = array();
        foreach ($services as $service) {
            if ($service->service->needcalc == 1) {
                $balance -= $service->service->mul * $service->catabove;
            }
            if (preg_match('/txid=(\w+)/s', $service->service->comment, $m)) {
                $servicesByTxid[$m[1]] = $service->service->servid;
            }
        }
        $info['balance'] = intval($balance + 0.0001);
        $info['txids'] = $servicesByTxid;
        
        return $info;
    }

    /**
     * Returns ID of the first USBox agent.
     *
     * @return int
     */    
    private function _getUsboxAgentId()
    {
        $agents = $this->_lanbilling->get("getAgents", array());
        if (!is_array($agents)) $agents = $agents? array($agents) : array();
        $neededAgentId = $this->usbox_agent_id;
        foreach ($agents as $agent) {
            if ($agent->data == 13) {
                if ($neededAgentId) {
                    if ($agent->id == $neededAgentId) {
                        return $agent->id;
                    }
                } else {
                    return $agent->id;
                }
            }
        }
        throw new Exception("Cannot find an agent of type 13 (USBox)");
    }
    
    /**
     * Returns true if internet access is blocked for this agreement.
     *
     * @param int $agrmid
     * @param array $vgs
     * @return bool
     */
    private function _isInternetBlocked($agrmid, $vgs)
    {
        $onlyAgentIds = $this->only_agent_ids;//preg_split('/\s+/s', @constant("ONLY_AGENT_IDS"), -1, PREG_SPLIT_NO_EMPTY);
        // Check if we have at least one Internet-enabled vgroup.
        foreach ($vgs as $vg) {
            // Тип агента: 1-Eth/PCAP, 2-Eth/ULOG, 3-Eth/tee, 4-Netflow, 5-SFlow, 6-RADIUS/DialUP, 
            // 7-PCDR, 8-PABX/RS232, 9-PABX/FIFO, 10-PABX/TCPclient, 11-PABX/TCPserver, 12-RADIUS/VoIP, 
            // 13-USBox, 14-SNMP
            if (
                0
                || $onlyAgentIds && in_array($vg->id, $onlyAgentIds) && !$vg->blocked
                || !$onlyAgentIds && $vg->agenttype <= 6 && !$vg->blocked
            ) return false;
        }
        return true;
    }

	public function aquireMutex($id)
    {
    	return Rentsoft::aquireMutex($id);
    }

    public function releaseMutex($mutex)
    {
    	Rentsoft::releaseMutex($mutex);
    }
} ?>
