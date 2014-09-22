<?php class L {

static $insatance;
static $functions = array();
public static function addFunction( $function ) {
	$function = (string) $function;
	if (!in_array( $function, self::$functions )) self::$functions[] = $function;
}
private static function getInstance(){
	if (!self::$insatance) self::$insatance = new self;
	return self::$insatance;
}
private function getPath() {
	return dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'log' . DIRECTORY_SEPARATOR . 'dev.log';	
}
private function write( $msg ) {
	$f = fopen( $this->getPath(), 'a' );	
	if( !$f ) throw new Exception('NO FILE');
	$success = fwrite( $f, "\r\n______________________________________________________________\r\n\r\n".$msg );
    if (!$success) {
        throw new Exception('CANT WRITE');
    }
}
public function logfunction( $function, $options, $result ) {
	if (in_array($function, self::$functions)) {
		self::log( $function . ' [REQUEST]' );
		self::log( $options );
		self::log( $function . ' [RESPONSE]' );
		self::log( $result );
	}
}
public function log( $var ) {
	if (is_string($var)) $dump = $var;
	elseif ($var === '') $dump = '[EMPTY STRING]';
	elseif ($var === true) $dump = 'TRUE';
	elseif ($var === false) $dump = 'FALSE';
	elseif ($var === NULL) $dump = 'NULL';
	else {
		ob_start();
		print_r($var);
		$dump = ob_get_contents();
		ob_end_clean();
	}
	$insatance = self::getInstance();
	$insatance->write( $dump );
}

} ?>
