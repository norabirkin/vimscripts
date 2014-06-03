<?php

	class System extends LANBilling {
		
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
	     * @return string String in JSON formate or false in case of error.
	     */
		
	    public function handling()
	    {

	    	   if (isset($_POST['action'])) {
	    	   		$action=trim($_POST['action']);
	    	   		if (!method_exists($this, $action)) return false;
	    	   		call_user_func($this, $action);
	    	   }
	    	   else return false;

	    }
				
			
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
	            return '({ success: false, errors: { reason: "'.$error->detail.'" } })';
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
	            return '({ success: false, errors: { reason: "Unknown action!" } })';
	        } else {
	            return '({ results: "" })';
	        }
	    }
		    
	    
	}
	

?>