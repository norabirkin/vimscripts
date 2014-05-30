<?php class LANBillingAdmin extends LANBilling {
	function __construct($rootPath) {
		$this->rootPath = $rootPath . DIRECTORY_SEPARATOR;
		parent::__construct();
	}
} ?>