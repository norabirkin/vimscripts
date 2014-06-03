<?php class ApacheErrorLogRoute extends CLogRoute {
	
	protected function processLogs($logs) {
		foreach( $logs as $log ) error_log( str_replace( "error.", "",  $log[2] ) . " " . str_replace( "\n", "", $log[0] ));
	}

} ?>