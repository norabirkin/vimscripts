<?php
class controlset
{
	function controlset()
	{
	
	}
	function button_iconed_v2($name,$value,$class,$style,$onclick,$disabled,$is_on,$is_active,$id,$is_inactive)
		{
			$imagename = sprintf("%simage",$name);
		
			if($disabled == 1)
			{
			$disabled = "disabled";
			$src_image = $is_inactive;
			}
			else 
			{
			$disabled = "";
			$src_image = $is_active;
			}
			
			printf("<button %s onclick=\"%s\" type=\"submit\" name=\"%s\" style=\"border:0; background:transparent;\"><img style=\"%s\" title=\"%s\" class=\"%s\" %s name = \"%s\" border=0 src=\"%s\" onmouseover=\" this.src='%s'; \" onmouseout=\" this.src='%s'; \" id=\"%s\"></img></button>",$disabled,$onclick,$name,$style,$value,$class,$disabled,$imagename,$src_image,$is_on,$src_image,$id); 
		
		}	
		
function select($name,$values,$onblur,$onfocus,$class,$id,$style,$selected,$disabled,$onchange)
	{
		if ($disabled == 1) $disabled_value = "disabled";
		else $disabled_value = "";
		printf("<SELECT NAME=\"%s\" STYLE=\"%s\" 
		ONBLUR=\"%s\" ONFOCUS=\"%s\" 
		CLASS=\"%s\" ID=\"%s\" ONCHANGE=\"%s\" %s>",
		$name,$style,$onblur,$onfocus,$class,$id,$onchange,$disabled_value);
		foreach($values as $key => $val)
		{
			printf("<OPTION %s VALUE=\"%s\">%s</OPTION>",$this->check_list($key,$selected),$key,$val);
		}
		printf("</SELECT>");
	}

	

	function select_return($name,$values,$onblur,$onfocus,$onchange,$class,$id,$style,$selected)
	{
		$return = sprintf("<SELECT NAME=\"%s\" STYLE=\"%s\" 
		ONBLUR=\"%s\" ONFOCUS=\"%s\" ONCHANGE=\"%s\"
		CLASS=\"%s\" ID=\"%s\">",
		$name,$style,$onblur,$onfocus,$onchange,$class,$id);
		foreach($values as $key => $val)
		{
			$return .= sprintf("<OPTION %s VALUE=\"%s\">%s</OPTION>",$this->check_list($key,$selected),$key,$val);
		}

		$return .= sprintf("</SELECT>");
		return $return;
	}

	function check_list($k,$v)
	{
		if($v == $k)return "selected";
		else return "";
	}
	
	function text($name,$value,$size,$onblur,$onfocus,$class,$id,$style,$maxlength)
	{
		printf("<INPUT TYPE=\"text\" NAME=\"%s\" ONBLUR=\"%s\" ONFOCUS=\"%s\" CLASS=\"%s\" ID=\"%s\" STYLE=\"%s\" SIZE=\"%s\" MAXLENGTH=\"%s\" VALUE=\"%s\">",
				$name,
				$onblur,
				$onfocus,
				$class,
				$id,
				$style,
				$size,
				$maxlength,
				$value);
	}
	
	function text_return($name,$value,$size,$onblur,$onfocus,$class,$id,$style,$maxlength)
	{
		$return = sprintf("<INPUT TYPE=\"text\" NAME=\"%s\" ONBLUR=\"%s\" ONFOCUS=\"%s\" CLASS=\"%s\" ID=\"%s\" STYLE=\"%s\" SIZE=\"%s\" MAXLENGTH=\"%s\" VALUE=\"%s\">",
				$name,
				$onblur,
				$onfocus,
				$class,
				$id,
				$style,
				$size,
				$maxlength,
				$value);
		return $return;
	}
	
	function hidden($name,$value)
	{
		printf("<INPUT TYPE=\"hidden\" NAME=\"%s\" VALUE=\"%s\">",$name,$value);
	}
				
}	

?>