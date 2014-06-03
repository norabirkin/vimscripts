<?php

header("Content-Disposition: attachment; filename=report.1c;");
header("Content-Type: application/x-force-download;");
header("Content-Transfer-Encoding: text;");

        include('confparser.inc');

        $descriptor=mysql_connect($serveraddress,$mysqluser,$mysqlpassword);
        mysql_select_db($mysqldatabase, $descriptor);
        $query = "SELECT 1cimport from share";
        $result = mysql_query($query);
        
        if($row=mysql_fetch_row($result))
        {
          readfile($row[0]);
        }
        
?>