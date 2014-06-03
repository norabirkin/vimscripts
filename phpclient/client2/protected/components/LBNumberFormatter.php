<?php

class LBNumberFormatter extends CNumberFormatter {
    public function getIsInitialized() {
        return true;
    }
	protected function formatNumber($format,$value)
	{
        $locale = localeconv();
		$negative=$value<0;
		$value=abs($value*$format['multiplier']);
		if($format['maxDecimalDigits']>=0)
			$value=round($value,$format['maxDecimalDigits']);
		$value="$value";
		if(($pos=strpos($value,$locale['decimal_point']))!==false)
		{
			$integer=substr($value,0,$pos);
			$decimal=substr($value,$pos+1);
		}
		else
		{
			$integer=$value;
			$decimal='';
		}

		if($format['decimalDigits']>strlen($decimal))
			$decimal=str_pad($decimal,$format['decimalDigits'],'0');
		if(strlen($decimal)>0)
			$decimal=yii::app()->getLocale()->getNumberSymbol('decimal').$decimal;

		$integer=str_pad($integer,$format['integerDigits'],'0',STR_PAD_LEFT);
		if($format['groupSize1']>0 && strlen($integer)>$format['groupSize1'])
		{
			$str1=substr($integer,0,-$format['groupSize1']);
			$str2=substr($integer,-$format['groupSize1']);
			$size=$format['groupSize2']>0?$format['groupSize2']:$format['groupSize1'];
			$str1=str_pad($str1,(int)((strlen($str1)+$size-1)/$size)*$size,' ',STR_PAD_LEFT);
			$integer=ltrim(implode(yii::app()->getLocale()->getNumberSymbol('group'),str_split($str1,$size))).yii::app()->getLocale()->getNumberSymbol('group').$str2;
		}

		if($negative)
			$number=$format['negativePrefix'].$integer.$decimal.$format['negativeSuffix'];
		else
			$number=$format['positivePrefix'].$integer.$decimal.$format['positiveSuffix'];

		return strtr($number,array('%'=>yii::app()->getLocale()->getNumberSymbol('percentSign'),'‰'=>yii::app()->getLocale()->getNumberSymbol('perMille')));
	}
}

?>
