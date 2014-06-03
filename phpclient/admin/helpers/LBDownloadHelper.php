<?php

class LBDownloadHelper {

    public static $mimeTypesArr =  array(
        'bmp'=>'image/bmp',
        'doc'=>'application/msword',
        'exe'=>'application/octet-stream',
        'gif'=>'image/gif',
        'gtar'=>'application/x-gtar',
        'gz'=>'application/x-gzip',
        'htm'=>'text/html',
        'html'=>'text/html',
        'jpe'=>'image/jpeg',
        'jpeg'=>'image/jpeg',
        'jpg'=>'image/jpeg',
        'pdf'=>'application/pdf',
        'png'=>'image/png',
        'pps'=>'application/mspowerpoint',
        'rtf'=>'text/rtf',
        'swf'=>'application/x-shockwave-flash',
        'tar'=>'application/x-tar',
        'tcl'=>'application/x-tcl',
        'txt'=>'text/plain',
        'wav'=>'audio/x-wav',
        'xls'=>'application/vnd.ms-excel',
        'xml'=>'application/xml',
        'zip'=>'application/zip'
    );

    /**
	 *
	 * Download a file with resume and speed options
	 *
	 * @param string $filename path to file including filename
	 * @param string $inFileName name of the downloading file
	 * @param integer $speed maximum download speed
	 * @param boolean $doStream if stream or not
	 */
	public static function download( $filepath, $inFileName = false, $maxSpeed = 100, $doStream = false ){

		$seek_start 	=  0;
		$seek_end 		= -1;
		$data_section 	=  false;
		$buffsize 		=  2048; // you can set by multiple of 1024

		if(!file_exists($filepath) && is_file($filepath))
			return false;

		$mimeType = self::getMimeType( $filepath );


		$filename = ($inFileName === false) ? basename( $filepath ) : $inFileName;

		if($mimeType == null) $mimeType = "application/octet-stream";

		$extension = self::getExtension( $filepath );

		// resuming?
		if(isset($_SERVER['HTTP_RANGE']))
		{
			$seek_range = substr($_SERVER['HTTP_RANGE'], strlen('bytes='));

			$range = explode('-', $seek_range);

			// to avoid problems
			if($range[0] > 0)
				$seek_start = intval($range[0]);
			if($range[1] > 0)
				$seek_end = intval($range[1]);

			$data_section = true;
		}
		// do some cleaning before start
		ob_end_clean();
		$old_status = ignore_user_abort(true);
		set_time_limit(0);

		$size = filesize( $filepath );

		if($seek_start > ($size -1)) $seek_start = 0;

		// open the file and move pointer
		// to started chunk
		$res = fopen( $filepath , 'rb');
		if($seek_start) fseek($res, $seek_start);
		if($seek_end < $seek_start) $seek_end = $size -1;

		header('Content-Type: '.$mimeType);
		$contentDisposition = 'attachment';
		if (strstr($_SERVER['HTTP_USER_AGENT'], "MSIE")) {
	        $fileName= preg_replace('/\./', '%2e', $filename, substr_count($filename, '.') - 1);
	    }
	    header('Content-Disposition: '.$contentDisposition.'; filename="'.$filename.'"');
	    header('Last-Modified: ' . date('D, d M Y H:i:s \G\M\T', filemtime( $filepath )));

	    // flushing a data section?
	    if( $data_section )
	    {
	    	header("HTTP/1.0 206 Partial Content");
            header("Status: 206 Partial Content");
            header('Accept-Ranges: bytes');
            header("Content-Range: bytes $seek_start-$seek_end/$size");
            header("Content-Length: " . ($seek_end - $seek_start + 1));

	    }else // nope, just
	    	header('Content-Length: '.$size);

	    $size = $seek_end - $seek_start + 1;

	    while(!( connection_aborted() || connection_status() == 1) && !feof($res))
	    {
	    	print(fread($res, $buffsize*$maxSpeed));

	    	flush();
	    	@ob_flush();
	    	sleep(1);
	    }
	    // close file
	    fclose($res);
	    // restore defaults
	    ignore_user_abort($old_status);
	    set_time_limit(ini_get('max_execution_time'));

	}

	public static function getMimeType($file,$magicFile=null,$checkExtension=true)
	{
		if(function_exists('finfo_open'))
		{
			$options=defined('FILEINFO_MIME_TYPE') ? FILEINFO_MIME_TYPE : FILEINFO_MIME;
			$info=$magicFile===null ? finfo_open($options) : finfo_open($options,$magicFile);

			if($info && ($result=finfo_file($info,$file))!==false)
				return $result;
		}

		if(function_exists('mime_content_type') && ($result=mime_content_type($file))!==false)
			return $result;

		return $checkExtension ? self::getMimeTypeByExtension($file) : null;
	}

	public static function getMimeTypeByExtension($file,$magicFile=null)
	{
		static $extensions;
		if($extensions===null)
			$extensions=$magicFile===null ? self::$mimeTypesArr : $magicFile;
		if(($pos=strrpos($file,'.'))!==false)
		{
			$ext=strtolower(substr($file,$pos+1));
			if(isset($extensions[$ext]))
				return $extensions[$ext];
		}
		return null;
	}

	public static function getExtensionByMimeType($mimeType)
	{
        $fileMime = strtolower($mimeType);
		if(($mimesArr = array_flip(self::$mimeTypesArr))!==false)
		{
			if(isset($mimesArr[$fileMime]))
				return $mimesArr[$fileMime];
		}
		return null;
	}


	public static function getExtension($path)
	{
		if(($pos=strrpos($path,'.'))!==false)
			return substr($path,$pos+1);
		else
			return '';
	}

	public static function getFileExtension($path)
	{
		return pathinfo($path, PATHINFO_EXTENSION);
	}


}