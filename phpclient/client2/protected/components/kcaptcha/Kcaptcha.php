<?php
/**
 * KCAPTCHA PROJECT VERSION 2.0
 * Automatic test to tell computers and humans apart
 * Copyright by Kruglov Sergei, 2006, 2007, 2008, 2011
 * www.captcha.ru, www.kruglov.ru
 * 
 * System requirements: PHP 4.0.6+ w/ GD
 * 
 * KCAPTCHA is a free software. You can freely use it for developing own site or software.
 * If you use this software as a part of own sofware, you must leave copyright notices intact or add KCAPTCHA copyright notices to own.
 * As a default configuration, KCAPTCHA has a small credits text at bottom of CAPTCHA image.
 * You can remove it, but I would be pleased if you left it. ;)
 * 
 * This file was modified by LANBilling team to merge external functions and setting
 * in one place
 */

class Kcaptcha {
	/**
	 * Symbols to use
	 * do not change without changing font files!
	 * @var		string
	 */
	private $alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
	
	/**
	 * Symbols used to draw CAPTCHA
	 * 		digits: 0123456789
	 * 		alphabet without similar symbols (o=0, 1=l, i=j, t=f): 23456789abcdegikpqsvxyz
	 * @var		string
	 */
	private $allowed_symbols = "23456789abcdegikpqsvxyz";
	
	/**
	 * Folder with fonts
	 * @var		string
	 */
	private $fontsdir = 'fonts';
	
	/**
	 * Fonts array
	 * @var		array
	 */
	private $fonts = array();
	
	/**
	 * String length
	 * @var		integer
	 */
	private $str_length = 6;
	
	/**
	 * Image width
	 * @var 	integer 
	 */
	private $width = 160;
	
	/**
	 * Image height
	 */
	private $height = 80;
	
	/**
	 * Symbol's vertical fluctuation amplitude
	 * @var		integer
	 */
	private $fluctuation_amplitude = 8;

	/**
	 * Wite noise
	 * set 0 to disable
	 * @var		float
	 */
	private $white_noise_density = 0.1667;
	
	/**
	 * Black noise
	 * set 0 to disable
	 * @var		float
	 */
	private $black_noise_density = 0.0333;

	/**
	 * Increase safety by prevention of spaces between symbols
	 * @var		boolean
	 */ 
	private $no_spaces = true;

	/**
	 * Show credits
	 * Set to false to remove credits line. Credits adds 12 pixels to image height
	 * @var		boolean
	 */
	private $show_credits = false;
	
	/**
	 * If empty, HTTP_HOST will be shown
	 * @var		string
	 */
	private $credits = '';
	
	/**
	 * Use random colors
	 * @var		boolean
	 */
	private $random_colors = true;
	
	/**
	 * Foreground image color
	 * @var		array
	 */
	private $foreground_color = array(0, 0, 0);
	
	/**
	 * Background image color
	 * @var		array
	 */
	private $background_color = array(220, 230, 255);

	/**
	 * JPEG quality of CAPTCHA image (bigger is better quality, but larger file size)
	 * @var		integer
	 */
	private $jpeg_quality = 90;
	
	/**
	 * Random string STATIC
	 * 
	 */
	private $keystring = '';
	
	/**
	 * 
	 */
	private $content_type = '';
	
	/**
	 * 
	 */
	private $output = false;
	
	
	/**
	 * Main constructer function
	 * Starts automaticaly when object class is created
	 * @param	array, known options
	 * 			[random_colors] => true / false
	 */
	public function __construct( $options = array() )
	{
		// If random colors
		if($this->random_colors) {
			$this->foreground_color = array(mt_rand(0,80), mt_rand(0,80), mt_rand(0,80));
			$this->background_color = array(mt_rand(220,255), mt_rand(220,255), mt_rand(220,255));
		}
		
		$this->setOutput();
	} // end __construct()
	
	
	/**
	 * Build fonts
	 * @returns		void
	 */
	private function getFonts()
	{
		// Clear fonts list
		$this->fonts = array();
		
		$fontsdir_absolute = dirname(__FILE__) . '/' . $this->fontsdir;
		
		if ($handle = opendir($fontsdir_absolute)) {
			while (false !== ($file = readdir($handle))) {
				if (preg_match('/\.png$/i', $file)) {
					$this->fonts[]=$fontsdir_absolute.'/'.$file;
				}
			}
		    closedir($handle);
		}
	} // end getFonts()
	
	
	/**
	 * Generating random keystring
	 * @return		string
	 */
	private function getRandom()
	{
		$_string = '';
		
		while(true) {
			$_string = '';
			for($i=0; $i < $this->str_length; $i++){
				$_string .= $this->allowed_symbols{mt_rand(0, strlen($this->allowed_symbols)-1)};
			}
			if(!preg_match('/cp|cb|ck|c6|c9|rn|rm|mm|co|do|cl|db|qp|qb|dp|ww/', $_string)) {
				break;
			}
		}
		
		return $_string;
	} // end getRandom()
	
	
	/**
	 * Prepare output function
	 */
	private function setOutput()
	{
		foreach(array('imagejpeg', 'imagegif', 'imagepng') as $item) {
			if(function_exists($item)) {
				$this->output = $item;
				
				switch($item) {
					case 'imagejpeg': $this->content_type = 'image/jpeg'; break;
					case 'imagegif': $this->content_type = 'image/gif'; break;
					case 'imagepng': $this->content_type = 'image/x-png'; break;
				}
				
				break;
			}
		}
	} // end setOutput()
	
	
	/**
	 * Create image with random string
	 * @param		boolean, true if need to encode base64
	 * @return		resource image
	 */
	public function get( $encode = true )
	{
		// Load fonts
		$this->getFonts();
		
		$alphabet_length = strlen($this->alphabet);
		
		do {
			// Generate random string
			$this->keystring = $this->getRandom();
			
			$font_file = $this->fonts[mt_rand(0, count($this->fonts)-1)];
			$font = imagecreatefrompng($font_file);
			imagealphablending($font, true);

			$fontfile_width=imagesx($font);
			$fontfile_height=imagesy($font)-1;
			
			$font_metrics=array();
			$symbol=0;
			$reading_symbol=false;

			// loading font
			for($i=0;$i<$fontfile_width && $symbol<$alphabet_length;$i++){
				$transparent = (imagecolorat($font, $i, 0) >> 24) == 127;

				if(!$reading_symbol && !$transparent){
					$font_metrics[$this->alphabet{$symbol}]=array('start'=>$i);
					$reading_symbol=true;
					continue;
				}

				if($reading_symbol && $transparent){
					$font_metrics[$this->alphabet{$symbol}]['end']=$i;
					$reading_symbol=false;
					$symbol++;
					continue;
				}
			}

			$img=imagecreatetruecolor($this->width, $this->height);
			imagealphablending($img, true);
			$white=imagecolorallocate($img, 255, 255, 255);
			$black=imagecolorallocate($img, 0, 0, 0);

			imagefilledrectangle($img, 0, 0, $this->width-1, $this->height-1, $white);

			// draw text
			$x=1;
			$odd=mt_rand(0,1);
			if($odd==0) $odd=-1;
			for($i=0;$i<$this->str_length;$i++){
				$m=$font_metrics[$this->keystring{$i}];

				$y=(($i%2)*$this->fluctuation_amplitude - $this->fluctuation_amplitude/2)*$odd
					+ mt_rand(-round($this->fluctuation_amplitude/3), round($this->fluctuation_amplitude/3))
					+ ($this->height-$fontfile_height)/2;

				if($this->no_spaces){
					$shift=0;
					if($i>0){
						$shift=10000;
						for($sy=3;$sy<$fontfile_height-10;$sy+=1){
							for($sx=$m['start']-1;$sx<$m['end'];$sx+=1){
				        		$rgb=imagecolorat($font, $sx, $sy);
				        		$opacity=$rgb>>24;
								if($opacity<127){
									$left=$sx-$m['start']+$x;
									$py=$sy+$y;
									if($py>$this->height) break;
									for($px=min($left,$this->width-1);$px>$left-200 && $px>=0;$px-=1){
						        		$color=imagecolorat($img, $px, $py) & 0xff;
										if($color+$opacity<170){ // 170 - threshold
											if($shift>$left-$px){
												$shift=$left-$px;
											}
											break;
										}
									}
									break;
								}
							}
						}
						if($shift==10000){
							$shift=mt_rand(4,6);
						}

					}
				}else{
					$shift=1;
				}
				imagecopy($img, $font, $x-$shift, $y, $m['start'], 1, $m['end']-$m['start'], $fontfile_height);
				$x+=$m['end']-$m['start']-$shift;
			}
		} while($x >= $this->width - 10); // end do; while not fit in canvas
		
		// Apply noise
		$white=imagecolorallocate($font, 255, 255, 255);
		$black=imagecolorallocate($font, 0, 0, 0);
		
		for($i=0;$i<(($this->height-30)*$x)*$this->white_noise_density;$i++){
			imagesetpixel($img, mt_rand(0, $x-1), mt_rand(10, $this->height-15), $white);
		}
		
		for($i=0;$i<(($this->height-30)*$x)*$this->black_noise_density;$i++){
			imagesetpixel($img, mt_rand(0, $x-1), mt_rand(10, $this->height-15), $black);
		}
		
		$center=$x/2;

		// credits. To remove, see configuration file
		$img2=imagecreatetruecolor($this->width, $this->height+($this->show_credits?12:0));
		$foreground=imagecolorallocate($img2, $this->foreground_color[0], $this->foreground_color[1], $this->foreground_color[2]);
		$background=imagecolorallocate($img2, $this->background_color[0], $this->background_color[1], $this->background_color[2]);
		imagefilledrectangle($img2, 0, 0, $this->width-1, $this->height-1, $background);		
		imagefilledrectangle($img2, 0, $this->height, $this->width-1, $this->height+12, $foreground);
		$this->credits=empty($this->credits)?$_SERVER['HTTP_HOST']:$this->credits;
		imagestring($img2, 2, $this->width/2-imagefontwidth(2)*strlen($this->credits)/2, $this->height-2, $this->credits, $background);

		// periods
		$rand1=mt_rand(750000,1200000)/10000000;
		$rand2=mt_rand(750000,1200000)/10000000;
		$rand3=mt_rand(750000,1200000)/10000000;
		$rand4=mt_rand(750000,1200000)/10000000;
		// phases
		$rand5=mt_rand(0,31415926)/10000000;
		$rand6=mt_rand(0,31415926)/10000000;
		$rand7=mt_rand(0,31415926)/10000000;
		$rand8=mt_rand(0,31415926)/10000000;
		// amplitudes
		$rand9=mt_rand(330,420)/110;
		$rand10=mt_rand(330,450)/100;

		//wave distortion

		for($x=0;$x<$this->width;$x++){
			for($y=0;$y<$this->height;$y++){
				$sx=$x+(sin($x*$rand1+$rand5)+sin($y*$rand3+$rand6))*$rand9-$this->width/2+$center+1;
				$sy=$y+(sin($x*$rand2+$rand7)+sin($y*$rand4+$rand8))*$rand10;

				if($sx<0 || $sy<0 || $sx>=$this->width-1 || $sy>=$this->height-1){
					continue;
				}else{
					$color=imagecolorat($img, $sx, $sy) & 0xFF;
					$color_x=imagecolorat($img, $sx+1, $sy) & 0xFF;
					$color_y=imagecolorat($img, $sx, $sy+1) & 0xFF;
					$color_xy=imagecolorat($img, $sx+1, $sy+1) & 0xFF;
				}

				if($color==255 && $color_x==255 && $color_y==255 && $color_xy==255){
					continue;
				}else if($color==0 && $color_x==0 && $color_y==0 && $color_xy==0){
					$newred=$this->foreground_color[0];
					$newgreen=$this->foreground_color[1];
					$newblue=$this->foreground_color[2];
				}else{
					$frsx=$sx-floor($sx);
					$frsy=$sy-floor($sy);
					$frsx1=1-$frsx;
					$frsy1=1-$frsy;

					$newcolor=(
						$color*$frsx1*$frsy1+
						$color_x*$frsx*$frsy1+
						$color_y*$frsx1*$frsy+
						$color_xy*$frsx*$frsy);

					if($newcolor>255) $newcolor=255;
					$newcolor=$newcolor/255;
					$newcolor0=1-$newcolor;

					$newred=$newcolor0*$this->foreground_color[0]+$newcolor*$this->background_color[0];
					$newgreen=$newcolor0*$this->foreground_color[1]+$newcolor*$this->background_color[1];
					$newblue=$newcolor0*$this->foreground_color[2]+$newcolor*$this->background_color[2];
				}

				imagesetpixel($img2, $x, $y, imagecolorallocate($img2, $newred, $newgreen, $newblue));
			}
		}
		
		// Prepare output
		// Out data to the temporary file
		$temp = tempnam(sys_get_temp_dir(), 'cpch');
		call_user_func($this->output, $img2, $temp, $this->jpeg_quality);
		$data = ($encode == true) ? chunk_split(base64_encode(file_get_contents($temp))) : file_get_contents($temp);
		unlink($temp);
		
		return $data;
	} // end get()
	
	
	/**
	 * Output data
	 * If encode true - result will bw output base 64 encoded
	 * @param	boolean
	 */
	public function show( $encode = true )
	{
		print $this->get($encode);
	} // end show()
	
	
	/**
	 * Get content type
	 */
	public function getContentType()
	{
		return $this->content_type;
	} // end getContentType()
	
	
	/**
	 * Get image size
	 */
	public function getSize()
	{
		return array(
			"width" => $this->width,
			"height" => $this->height
		);
	} // end getSize()
	
	
	/**
	 * Get current random string
	 * 
	 */
	public function getRandomString(){
		return $this->keystring;
	}
}

?>
