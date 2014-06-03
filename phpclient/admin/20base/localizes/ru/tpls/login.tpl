<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>LANBilling base</title>
<!–[if lt IE 6]–><script defer type="text/javascript" src="./js/pngfix.js" mce_src="./js/pngfix.js"></script><!–[endif]–>	
<link rel="stylesheet" type="text/css" href="resources/extjs-3/resources/css/ext-all-notheme.css">
<link rel="stylesheet" type="text/css" href="resources/extjs-3/resources/css/xtheme-gray.css">
<style>
	html, body {margin: 0; padding: 0;}
	html {height:100%;}
	body {min-height: 100%; height: auto !important; height: 100%;font-size: 13px; font-family: Arial, Helvetica, Tahoma, sans-serif; min-width:1024px;}
	.login-plate {width:390px;height:160px;margin:0 auto;background:url(images/logon/login-plate.png) no-repeat scroll 0px 0px transparent;}
	.login-label {padding:25px 0 10px 80px;text-align:left;font-weight:bold;}
	.login-form { text-align:left;width:230px;background:transparent;}
	.x-panel-body {background-color:transparent !important;}
	.x-form-item {margin-bottom:10px; width: 230px;}
	.button-item {width:108px;height:27px;background:url(images/logon/enter.gif) no-repeat scroll 0px 0px transparent;color:white;text-transform:uppercase;font-weight:bold;padding:5px 0 0 15px;text-align:left;margin-top:10px;cursor:pointer;}
	.footer {margin:0 auto;width:800px;font-size:10px;font-weight:normal;border-top: 2px solid #555555;padding-top:10px;}
	.footer div {float:left;}
	.footer-logo {background:url(images/logon/logo_grey.png) no-repeat scroll 0px 0px transparent;width:140px;height:33px;float:left;}
	.footer-copy {margin:8px 120px; text-align:center;}
</style>
<script type="text/javascript" src="resources/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="resources/extjs-3/ext-all.js"></script>
<script language="javascript">
Ext.BLANK_IMAGE_URL='resources/extjs-3/resources/images/default/s.gif';
Ext.onReady(function(){
	Ext.get('user_login').focus();
})
</script>
</head>
<body>
<form action="config.php" onKeyPress="if(event.keyCode==13) document.forms.indexForm.submit();" method="POST" name="indexForm">
<table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" >
	<tr><td align="center"><div class="login-plate"><div class="login-label"><%@ Login to system %></div><div class="login-form" id="login-form">
		<div><input type="text" name="login" id="user_login" autocomplete="on" class="x-form-item x-form-text" title="Login"/></div>
		<div><input type="password" name="password" autocomplete="on" class="x-form-item x-form-text" title="Password"/></div>
	</div></div>
	<div id="submit" class="button-item" onClick="javascript: document.forms.indexForm.submit();"><%@ Enter %></div></td></tr>
	<tr><td height="60">
	<div class="footer">
		<div class="footer-logo"><img src="resources/extjs-3/resources/images/default/s.gif"></div>
		<div style="float:right;">Телефон: +7 (495) 795-06-77<br>Электронная почта: itdep@lanbilling.ru</div>
		<div class="footer-copy">&copy; ООО "Сетевые Решения" 2001-{CURRENTYEAR}.</div>
	</div>
	</td></tr>
</table>
</form>
</body>
</html>