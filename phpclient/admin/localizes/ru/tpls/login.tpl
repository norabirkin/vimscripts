<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>LANBilling</title>
<!–[if lt IE 6]–><script defer type="text/javascript" src="./js/pngfix.js" mce_src="./js/pngfix.js"></script><!–[endif]–>	
<style>
	html, body {margin: 0; padding: 0;}
	html {height:100%;}
	body {min-height: 100%; height: auto !important; height: 100%;font-size: 13px; font-family: Arial, Helvetica, Tahoma, sans-serif; min-width:1024px;}
	
	a {color: #29aaa2;text-decoration: underline;}
	.selected {color:#29aaa2;text-decoration: none; font-weight:bold;}

	#login_lanbilling{position:relative;width:305px;height:236px;}
	#text_login{position:absolute;top:134px;left:20px;font-size: 16px;}
	#text_password{position:absolute;top:168px;left:20px;font-size: 16px;}
	#text_go{position:absolute;top:202px;left:230px;font-size: 12px;}
	#text_bottom{position:absolute;top:705px;left:60px;font-size: 13px;}
	#input_login{position:absolute;top:134px;left:97px;font-size: 13px;}
	#input_password{position:absolute;top:168px;left:97px;font-size: 13px;}
	#lbFoot { display: block; position: static; height: 80px !important; background: url('images/footer.gif') repeat-x bottom left;}
	
	.welcome-wrap {position:absolute;top:60px;left:20px;font-size: 24px;}
	.input-auth-wrap {padding-left: 10px;width: 154px;height: 22px;background: url(images/logon/input_rect_left.png) no-repeat;}
	.input-auth-wrap input {height: 18px;width: 143px;border: 0px none;}
	.input-auth-right {padding-right: 10px;height: 23px;background: url(images/logon/input_rect_right.png) repeat-x;}
	.input-auth-body {height: 20px;padding-top:2px;background-color:white;}
	.input-login {position: absolute;top:134px;left:120px;}
	.input-pass {position: absolute;top:165px;left:120px;}
	.input-wrap-submit {text-align: center;font-weight: bold;padding-top: 2px;font-size: 13px;cursor: pointer;position:absolute;top:200px;left:187px;width:95px;height:20px;background: url(./images/logon/enter.jpg) no-repeat;}
	.input-wrap-submit-over {background: url(./images/logon/enter_active.jpg) no-repeat;}
	
</style>
</head>

<body  onLoad="document.getElementById('user_login').focus()" background="images/body_back.jpg">
<form action="config.php" onKeyPress="if(event.keyCode==13) document.forms.indexForm.submit();" method="POST" name="indexForm">
<table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" >
	<tr>
	<td align="center">
	<div>        	
		<div id="login_lanbilling"><img height="236" width="305" src="./images/logon/lanbilling.jpg">
		<div id="login_rightcornerform"></div>
			<div class="welcome-wrap"><b><%@ Login to system %></b></div>
			<div id="text_login"><b><%@ Login %></b></div>
			<div id="text_password"><b><%@ Password %></b></div>
			<div class="input-auth-wrap input-login"><div class="input-auth-right"><div class="input-auth-body"><input type="text" name="login" id="user_login" /></div></div></div>
			<div class="input-auth-wrap input-pass"><div class="input-auth-right"><div class="input-auth-body"><input type="password" name="password" /></div></div></div>
			<div class="input-wrap-submit" onClick="javascript: document.forms.indexForm.submit();" onMouseOver="this.className+=' '+this.className+'-over'"  onMouseOut="this.className=this.className.split(' ')[0]" ><%@ Submit %></div>
			</div>	
            </div>
          </div>
        </td>
    </tr>
    <tr valign="bottom" >
    	<td  >
        <div id="lbFoot">		
	 		<div  style="padding-left:20px; padding-top:25px; font-size:13px;">
											<b>&copy; ООО "Сетевые Решения" 2001-{CURRENTYEAR}.</b><br />
											<%@ Technical support %>:(495)795-06-77, E-mail: <a href="mailto:itdep@lanbilling.ru">itdep@lanbilling.ru</a>
			</div>
       </div>
        </td>
    </tr>   
</table>
</form>

</body>
</html>