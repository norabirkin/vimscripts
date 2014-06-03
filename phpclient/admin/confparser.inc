<?php
/********************************************************************
	filename: 	confparser.inc
	created:	January 14 2005 13:16:46.
	modified:	April 4 2014 11:50
	author:		LANBilling

	version:    LANBilling 2.0
*********************************************************************/

$ss = getenv ("SERVER_SOFTWARE");
if(ereg("([Ww][Ii][Nn]32)",$ss))
{
	try {
		$shell = new COM("WScript.Shell") or die("Requires Windows Scripting Host");
		$services=$shell->RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\LANBilling\\LBcore\\Services");
		$lbcore = $services[0];
		$conffile=$shell->RegRead("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\".$lbcore."\\Parameters\\CfgFile");
	} catch(Exception $e) {
		$conffile="";
	}
	if(empty($conffile))
		$conffile="C:/Program Files/LANBilling/LBcore/billing.conf";
}
else
{
	$conffile="/etc/billing.conf";
}
if (!$plog=fopen($conffile,"r"))
			{
			echo "Can not open config file ".$conffile.".";
			return (false);
			}
// ���� ������������ ������ �������, ������ ���������� �� �����
$maskindex=1;
while(!feof($plog))  {
if (filesize($conffile)==0)  break; // �������� �� ������� ����� ����� ������������
$confitem=fgets($plog,4096);  // ������ ������ � �����
// ��������� ������ ������������ �� �����
$i=0;
$part = strtok($confitem,"=");
while($part)
 	{
$i++;
$item[$i]=trim($part);
$part = strtok("=");
 	}
	if (strncasecmp($item[1],"#",1) != 0 && strncasecmp($item[1],"\n",1) != 0) //����� ����������� ����� ������ ����� ������ � ����� - ��� �����������
		{
		if(strcmp($item[1],"database")==0)
			{
				/*
				* ����������� ���� � ������������ � ����������� ������� LBcore ������ 2.0.006 � ����
				*/
				$tmp = str_replace("mysql://", "", $item[2]);
				$tmp = str_replace("/", ":", $tmp);
				$tmp = str_replace("@", ":", $tmp);
				$tmp = explode(':', $tmp);
				$serveraddress  =  trim($tmp[2]);
				$mysqluser      =  trim($tmp[0]);
				$mysqlpassword  =  trim($tmp[1]);
				$mysqldatabase  =  trim($tmp[3]);
			}
		}
} // ����� ������ ����� ����� ������������
?>