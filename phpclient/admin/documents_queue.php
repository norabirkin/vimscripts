<?php

require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'documentsQueueManager.php' );
$documentsQueue = new documentsGenerationQueueManager(array('lanbilling' => $lanbilling, 'localize' => $lanbilling->localize));

if (isset($_POST['cancelGenerationTask'])) {
	$documentsQueue->cancelGenerationTask();
}
elseif (isset($_POST['deleteGenerationTask'])) {
	$documentsQueue->deleteGenerationTask();
}
elseif (isset($_REQUEST['getDocumentTemplateNames'])) {
	$documentsQueue->getDocumentTemplateNames();
}
else {
	$queue = $documentsQueue->getQueue();
}

?>