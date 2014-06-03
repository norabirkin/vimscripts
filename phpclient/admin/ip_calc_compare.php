<?PHP
/**
 * This function aggregates all free ip / networks
 * for the selected network segment
 *
 */
	
class IP_Calc_Compare
{
	
	/**
	 * Contains cycle start point for the list builder
	 * @var	int
	 */
	var $cycle_start = 0;
	
	/**
	 * Contains max cycles for the list builder
	 * @var	int
	 */
	var $cycle_end = 1000;
	
	/**
	 * Set this for Agent ID to turn on specific search
	 * @var	int
	 */
	var $A_ID = null;
	
	/**
	 * Contains the main network value
	 * @var	is_long
	 */
	var $mainNet;
	
	/**
	 * Contains  POST array part
	 * that need to check
	 */
	var $postSegments;
	
	/**
	 * Contains value to devide by mask
	 * @var	is_long
	 */
	var $devideByMask;
	
	/**
	 * Contains mask value of the main network
	 * @var	is_long
	 */
	var $mainNetMask;
	
	/**
	 * Contains the broadcast address of the main network
	 * @var	is_long
	 */
	var $mainNetBroadcast;
	
	/**
	 * Contains opened MySQL connection link to DataBase
	 * @var
	 */
	var $descriptor;
	
	/**
	 * Contains built list of IP addresses
	 * @var	array
	 */
	var $addrListByMask = array();
	
	/**
	 * Contains error trigger
	 * @var	logic
	 */
	var $error = false;
	
	/**
	 * Contains error message
	 * @var	char
	 */
	var $error_mes;
	
	/**
	 * Skip first addres if this is network address
	 * @var	bool
	 */
	var $skipNetworkAddress = false;
	
	
	/**
	 * In point function to start
	 * @var net	main network, which need to devide,
	 *			default value ip2long(10.0.0.0)
	 * @var mask	main network mask
	 *			default value ip2long(255.255.255.0)
	 * @var dev_mask	mask devisor for the main network
	 *			default value ip2long(255.255.255.255)
	 * @var dev_is	@var dev_mask was given in such formats
	 *			1 - bit length
	 *			2 - full int long
	 *			3 - decimal, need to convert
	 * @var c_a	use segments for current cable agent
	 *			null - use all segments
	 *			int() - use current
	 */
	function IP_Calc_Com(&$descriptor, $net = 167772160, $mask = 4294967040, $dev_mask = 4294967295, $dev_is = 1)
	{
	
		// Store variables
		$this->descriptor = $descriptor;
		$this->mainNet = $net;
		$this->mainNetMask = $mask;
		$this->mainNetBroadcast = $this->getBroadcast($this->mainNet, $this->mainNetMask);
		
		// Initialize mask divisor
		switch($dev_is)
		{
		case 1: $this->devideByMask = $this->bitsTo($dev_mask, 1); break;
		case 2: $this->devideByMask = $dev_mask; break;
		case 3: $this->devideByMask = ip2long($dev_mask); break;
		}
		
		// Cycle iterations
		$this->listBuild();
		
		// Start MySQL check transaction
		$this->dbCompare();
		
		// Re-index array
		$this->addrListByMask = array_values($this->addrListByMask);
	} // end IP_Calc_Compar()
	
	
	/**
	* Cycle process to iterate ip_net/mask
	*
	*/
	function listBuild()
	{
		
		$this->addrListByMask[] = $this->createIPValue($this->mainNet, $this->devideByMask, 0);
	
		do
		{
		$index_key = count($this->addrListByMask) - 1;
		
		$this->addrListByMask[] = $this->createIPValue($this->addrListByMask[$index_key], $this->devideByMask);
		
		if($this->addrListByMask[$index_key + 1] >= $this->mainNetBroadcast)
		{
			unset($this->addrListByMask[$index_key + 1]);
			break;
		}
		
		$this->cycle_start++;
		} while($this->cycle_start < $this->cycle_end);
		
	} // end listBuild()
	
	
	/**
	* Returns the next value for the network in step by given mask
	* @var net_is	is_long
	* @var mask_is	is_long
	*
	* @var returned	is_long
	*/
	function createIPValue($net_is, $mask_is, $iter = 1)
	{
		$true_net = ($net_is*1 & $mask_is*1);
		$broadcast = $this->getBroadcast($net_is, $mask_is);
		
		return (($broadcast + $iter)*1 & $mask_is*1);
	}
	
	
	/**
	* Calculates network broadcast address on called event
	* If main variables was not set
	* @var net_is     is_long
	* @var mask_is    is_long
	*/
	function getBroadcast($net_is = 167772160, $mask_is = 4294967040)
	{
		return ($net_is*1 & $mask_is*1) | ((~$mask_is*1) & 4294967295);
	} // end getBoadcast()
	
	
	/**
	* Converts mask bits to another format
	* @var bit	mask length
	* @var back	format to return
	*			1 - int long
	*			2 - decimal
	*/
	function bitsTo($bit = 32, $back = 1)
	{
		switch($back)
		{
		case 1: return ((4294967295) << (32-$bit)); break;
		case 2: return (long2ip((4294967295) << (32-$bit))); break;
		}
	} // end bitsTo()
	
	
	/**
	 * Try to convert mask to another interpritation. Returns false id there is unknown mask format
	 * @param	string-decimal / long, be shure You are given the right format
	 * 		There are known decimal interpritation 255.255.255.255, long Int interpritation
	 */
	function MaskToBits( $mask = "255.255.255.255" )
	{
		switch( true )
		{
			case (preg_match("/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/", trim($mask))):
				$mask = ip2long($mask);
			break;
			
			case (is_long($mask)): break;
			
			default: return false;
		}
		
		$totbits = 0;
		for( $i = 0; $i < 32; $i++ ) 
			$totbits += ($mask >> $i) & 1;
		
		return $totbits;
	} // end MaskTo()
	
	
	/**
	* Gets the whole address list of the global network set
	* Unsets all true values
	*/
	function dbCompare()
	{
		// Select all data from DB
		$sql_compare_query = sprintf("SELECT staff.segment, staff.mask FROM staff, vgroups WHERE (staff.segment & %lu) = %lu", $this->mainNet, $this->mainNet);
		
		if(is_numeric($this->A_ID) && $this->A_ID > 0) $sql_compare_query .= sprintf(" AND vgroups.id = %d AND staff.vg_id = vgroups.vg_id", $this->A_ID);
		
		$compare_query = mysql_query($sql_compare_query, $this->descriptor);
		
		// Check if query error
		if($compare_query == false)
		{
		$this->error = true;
		$this->error_mes = mysql_error();
		return false;
		}
		
		if(is_array($this->postSegments) && !empty($this->postSegments))
		{
			foreach($this->postSegments as $arr_key => $arr_value)
			{
				foreach($this->addrListByMask as $record_id => $record_value)
				{
				list($ip, $mask) = split("/", $arr_value);
				$mask_cover = (min(sprintf("%u", $this->devideByMask), $this->bitsTo($mask, 1)))*1;
				
				if( sprintf("%u", ($record_value*1 & $mask_cover*1))  == sprintf("%u", (ip2long($ip)*1 & $mask_cover*1)) )
					unset($this->addrListByMask[$record_id]);
				}
			}
			unset($mask_cover);
		}
		
		// Check returned result > 0
		if(mysql_num_rows($compare_query) == 0) return 1;
		
		while($compare = mysql_fetch_row($compare_query))
		{
			foreach($this->addrListByMask as $record_id => $record_value)
			{
				$mask_cover = (min(sprintf("%u", $this->devideByMask), $compare[1]))*1;
				
				// If there have been already asigned 
				if( sprintf("%u", ($record_value*1 & $mask_cover*1))  == sprintf("%u", ($compare[0]*1 & $mask_cover*1)) )
					unset($this->addrListByMask[$record_id]);
				
				// If there is a flag to skip first network address
				// For example 192.168.1.0/24 than shoul skip 192.168.1.0/32
				if($this->skipNetworkAddress && $record_value == $this->mainNet)
					unset($this->addrListByMask[$record_id]);
			}
		}
		
	} // end dbCompare()
	
}
?>