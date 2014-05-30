<?php
class Dumper extends CVarDumper {
    /**
     * Displays a variable.
     * This method achieves the similar functionality as var_dump and print_r
     * but is more robust when handling complex objects such as Yii controllers.
     * @param mixed variable to be dumped
     * @param integer maximum depth that the dumper should go into the variable. Defaults to 10.
     * @param boolean whether the result should be syntax-highlighted
     */
    public static function dump($var,$depth=10,$highlight=true){
        echo self::dumpAsString($var,$depth,$highlight);
    }
	public static function log($var,$category = 'dev.log') {
		$category_parts = explode('.', $category);
        if (
            yii::app()->params['logUid'] AND
            yii::app()->lanbilling->client AND
            yii::app()->params['logUid'] != yii::app()->lanbilling->client
        ) {
            return;
        }
		$skip = array(
			/*'getClientAccount.request',
			'getClientAccount.response',
			'getAccounts.request',
			'getAccounts.response',
			'getOptions.request',
			'getOptions.response'*/
		);
		if (in_array($category,$skip)) return;
		if (is_string($var)) $dump = $var;
		elseif ($var === true) $dump = 'TRUE';
		elseif ($var === false) $dump = 'FALSE';
		elseif ($var === NULL) $dump = 'NULL';
		else {
			ob_start();
			print_r($var);
			$dump = ob_get_contents();
			ob_end_clean();
		}
		if ($category_parts[0] == 'error') {
			yii::log($dump,'error',$category);
		} elseif ($category_parts[0] == 'file') {
			yii::log($dump,'error',$category);
		} else {
			yii::log($dump,'info','all.'.str_replace('.','-',$category));
			yii::log($dump,'info',$category);
		}
	}
}
