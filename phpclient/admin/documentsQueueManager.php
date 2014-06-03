<?php class documentsGenerationQueueManager {

	private $lanbilling;
	private $localize;
	private $limit;
	private $start;
	private $managers = array();
	private $documentTemplates = array();
	const STATUS_DONE = 0;
	const STATUS_LOADING = 1;
	const STATUS_CANCELED = 3;
	const STATUS_ERROR = 4;
	const REPORTS = 2;
	const ORDERS = 0;
	
	function __construct($config) {
		$this->lanbilling = $config['lanbilling'];
		
		//require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'fake' . DIRECTORY_SEPARATOR . 'DocumentsQueueLBFake.php' );
		//$this->lanbilling = new DocumentsQueueLBFake;
		
		$this->localize = $config['localize'];
	}
	
	private function getErrorString() {
		$error = $this->lanbilling->soapLastError(); 
		if (!$error) return "";
		$msg = " (" . $error->type;
		if ($error->detail) $msg .= " - " . $error->detail . ")";
		else $msg .= ")";
		return addcslashes($msg, '"');
	}
	
	public function addDocumentGenerationTask($params) {
		if ($ret = $this->lanbilling->get('addDocumentGenTask', $params))	echo "({ success: true })";
		else echo "({ success: false, errors: { reason: 'Adding document generation task is failed" . $this->getErrorString() . "' } })";
	}
	
	public function cancelGenerationTask() {
		if ($this->lanbilling->get('cancelGenTask', array('record-id' => $_POST['cancelGenerationTask']))) echo "({ success: true })";
		else echo "({ success: false, errors: { reason: 'Generation canceling is failed" . $this->getErrorString() . "' } })";
	}
	
	public function deleteGenerationTask() {
		if ($this->lanbilling->get('delGenTask', array('record-id' => $_POST['deleteGenerationTask']))) echo "({ success: true })";
		else echo "({ success: false, errors: { reason: 'Generation deleting is failed" . $this->getErrorString() . "' } })";
	}
	
	public function getQueue() {		
		$queue = $this->makeArrayAnyway($this->lanbilling->get('getStatusGenTask'));
		$queueData = $this->buildQueueData($queue);
		
		echo '({"results": ' . JEncode($queueData, $lanbilling) . '})';
	}
	
	private function makeArrayAnyway($value) {
		if (!$value) $value = array();
		if (!is_array($value)) $value = array($value);
		return $value;
	}
	
	private function sortByCreateDate($a, $b) {
		if ($a['creationunixtime'] > $b['creationunixtime']) return 1;
		elseif ($a['creationunixtime'] < $b['creationunixtime']) return -1;
		elseif ($a['creationunixtime'] == $b['creationunixtime']) return 0;
	}

	private function sortQueue($data) {
		usort($data, array($this, 'sortByCreateDate'));
		$data = array_reverse($data);
		return $data;
	}
	
	private function getTypeOfDocumentsThatShouldBeShownOnCurrentPage() {
		if (!isset($_REQUEST['OnFly'])) throw new Exception('no document type parameter');
		return $_REQUEST['OnFly'];
	}
	
	private function getDocumentType($item) {
		$documentTemplateNamesStoredInFrontend = $this->getDocumentTemplateNames( false );
		if (!$documentTemplateNamesStoredInFrontend[$item['tplid']]['orderorreport']) throw new Exception('document type ' . $item['docid'] . ' was not found');
		return $documentTemplateNamesStoredInFrontend[$item['tplid']]['orderorreport'];
	}
	
	private function shouldItemBeShown($item) {
		try {
			$typeOfDocumentsThatShouldBeShownOnCurrentPage = $this->getTypeOfDocumentsThatShouldBeShownOnCurrentPage();
			if ($typeOfDocumentsThatShouldBeShownOnCurrentPage == self::ORDERS && $this->getDocumentType($item) == 'order') return true;
			if ($typeOfDocumentsThatShouldBeShownOnCurrentPage == self::REPORTS && $this->getDocumentType($item) == 'report') return true;
			return false;
		} catch (Exception $e) {
			return true;
		}
	}
	
	private function getFormattedDate($date) {		
		if (!$date) return '';
		$date = explode(' ', $date);
		$date = $date[0];
		$date = explode('-', $date);
		$year = $date[0];
		$month = (int) $date[1];
		$message .= $this->getMonthName($month) . ' ';
		$message .= $year;
		return $message;
	}
	
	private function getMonthName( $month, $decline = false ) {
		$months = array(1 => "January", 2 => "February", 3 => "March", 4 => "April", 5 => "May", 6 => "June", 7 => "July", 8 => "August", 9 => "September", 10 => "October", 11 => "November", 12 => "December");
		$monthKey = $months[$month] . ($decline ? '-a' : '');
		return $this->localize->get($monthKey);
	}
	
	private function buildQueueData($queue) {
		$data = array();
		
		foreach ($queue as $k => $v) $queue[$k] =  $this->processQueueRow($queue[$k]);
		//$queue = $this->sortQueue($queue);

		foreach ( $queue as $item ) {
			if ($this->shouldItemBeShown($item)) $data[] = $item;
		}
		
		return $data;
	}
	
	private function processQueueRow($item) {
		return array(
			'creationunixtime' => strtotime($item->createdate),
			'recordid' => $item->recordid,
			'tplid' => $item->docid,
			'orderid' => $item->lastorderid,
			'done' => $this->isDone($item->status),
			'period' => $this->getPeriod($item->period),
			'periodraw' => substr($item->period, 0, 7),
			'createdate' => $item->createdate,
			'enddate' => $item->enddate,
			'percent' => $this->getPercentOfExecutedOperations($item),
			'buttonavailable' => $this->userHasPermissionToCancelOrDeleteTask($item->personid),
			'buttontype' => $this->getButtonType($item),
			'canceled' => $this->isCanceled($item->status),
			'error' => $this->isGenerationFailed($item->status),
			'manager' => $item->personfullname,
			'message' => $item->message
		);
	}
	
	private function getPeriod($period) {
		return $this->getFormattedDate(substr($period, 0, 7));
	}
	
	private function getButtonType($item) {
		if ($item->status == self::STATUS_LOADING) $type = 'cancel';
		elseif ($item->status == self::STATUS_DONE) $type = 'delete';
		elseif ($item->status == self::STATUS_ERROR) $type = 'delete';
		elseif ($item->status == self::STATUS_CANCELED) $type = 'delete';
		return $type;
	}
	
	private function userHasPermissionToCancelOrDeleteTask($person_id) {
		if ($person_id !== $this->lanbilling->manager AND $this->lanbilling->manager !== 0) return 0;
		else return 1;
	}
	
	public function getDocumentTemplateNames($flushCookieCache = true) {		
		if (!$flushCookieCache AND isset($_SESSION['documentTemplateNames'])) {
			return $_SESSION['documentTemplateNames'];
		}
		$ordersTemplates = $this->makeArrayAnyway($this->lanbilling->get('getDocuments'));
		$reportsTemplates = $this->makeArrayAnyway($this->lanbilling->get('getDocuments', array('flt' => array("onfly" => 2))));
		foreach( $this->makeArrayAnyway($this->lanbilling->get('getDocuments', array('flt' => array("onfly" => 7)))) as $documentTemplate ) {
			$reportsTemplates[] = $documentTemplate;
		}
		if ($ordersTemplates OR $reportsTemplates)	{
			$documentTemplateNames = array();
			foreach ($ordersTemplates as $item) {
				$documentTemplateNames[$item->docid] = array('name' => $item->name, 'orderorreport' => 'order');
			}
			foreach ($reportsTemplates as $item) {
				$documentTemplateNames[$item->docid] = array('name' => $item->name, 'orderorreport' => 'report');
			}
			if (!$flushCookieCache) return $documentTemplateNames;
			$_SESSION['documentTemplateNames'] = $documentTemplateNames;
			echo "({ success: true, results: " . JEncode($documentTemplateNames, $this->lanbilling) . " })";
		}
		else echo "({ success: false, errors: { reason: 'Getting document template names is failed" . $this->getErrorString() . "' } })";
	}
	
	private function getPercentOfExecutedOperations($item) {
		if ($item->status == self::STATUS_DONE) $percent = 100000;
		elseif ($item->status == self::STATUS_LOADING ) $percent = $item->percent;
		else $percent = 0;
		return (int) $percent;
	}
	
	private function isCanceled($status) {
		if ($status == self::STATUS_CANCELED) return 1;
		else return 0;
	}
	
	private function isDone($status) {
		if ($status == self::STATUS_DONE) return 1;
		else return 0;
	}
	
	private function isGenerationFailed($status) {
		if ($status == self::STATUS_ERROR) return 1;
		else return 0;
	}
	
	private function getManagerName($id) {
		if (!isset($this->managers[$id])) {
			if (!$manager = $this->lanbilling->get("getManager", array("id" => (integer) $id))) $this->managers[$id] = '';
			else $this->managers[$id] = $manager->manager->fio;
		}
		return $this->managers[$id]	;
	}
	
} ?>
