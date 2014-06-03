<?php
/********************************************************************
        filename:         localize.php
        modified:        February 01 2005 19:54:08.
        author:                LANBilling

        version:    LANBilling 1.8
*********************************************************************/

// define ("LOCALE_", "eng");
define ("LOCALE_", "ru");

if(defined("LOCALE_"))
  define ("LOCALE_PATH", "localizes/".LOCALE_."/");
else
  define ("LOCALE_PATH", "localizes/ru/");

// Path to the web templates
define ("TPLS_PATH", LOCALE_PATH."tpls");
// Path to the billing system
define ("BILL_SYS_PATH","/usr/local/billing");

//require_once(LOCALE_PATH."localize.php");
//File include to config.php
?>