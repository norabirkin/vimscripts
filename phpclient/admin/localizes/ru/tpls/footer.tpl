&nbsp;
</div>
<script language="javascript">
	var curYear = new Date();
	curYear = curYear.format('Y');
//----------------------------------------------------------------
function Set_Cookie( name, value, expires, path, domain, secure )
{
var today = new Date();
today.setTime( today.getTime() );
if ( expires )
{
expires = expires * 1000 * 60 * 60 * 24;
}
var expires_date = new Date( today.getTime() + (expires) );
document.cookie = name + "=" +escape( value ) +
( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
( ( path ) ? ";path=" + path : "" ) +
( ( domain ) ? ";domain=" + domain : "" ) +
( ( secure ) ? ";secure" : "" );
}
//----------------------------------------------------------------
function Get_Cookie( name ) {
var start = document.cookie.indexOf( name + "=" );
var len = start + name.length + 1;
if ( ( !start ) &&
( name != document.cookie.substring( 0, name.length ) ) )
{return null;}
if ( start == -1 ) return null;
var end = document.cookie.indexOf( ";", len );
if ( end == -1 ) end = document.cookie.length;
return unescape( document.cookie.substring( len, end ) );
}
var stateHeader=0;
/*--------------------------------------------------*/

function Header(vid){

if (!stateHeader) {
	omenu = document.getElementById(vid);
	omenu.style.visibility = "hidden";
	omenu.style.display = "none";

	omenu = document.getElementById('menuheader');
	omenu.className = "x-tool x-tool-toggle x-tool-collapse-south";

	omenu = document.getElementById('lbFoot');
	omenu.style.display = "none";

	container.doLayout();
	Set_Cookie( 'mycookie', 'headeroff', 30, '/', '', '' );
	stateHeader=1;
	return;
}
else {

	omenu = document.getElementById(vid);
	omenu.style.visibility = "visible";
	omenu.style.display="block";

	omenu = document.getElementById('menuheader');
	omenu.className = "x-tool x-tool-toggle x-tool-collapse-north";

	omenu = document.getElementById('lbFoot');
	omenu.style.display = "";

	container.doLayout();
	Set_Cookie( 'mycookie', 'headeron', 30, '/', '', '' );
	stateHeader=0;
	return;
}
}
/*--------------------------------------------------*/
var north = '<table id="header" class="lbHead" border="0" width="100%" cellpadding="0" cellspacing="0"><tr><td>&nbsp;</td><td width="1024" height="50">' +
	'<div id="lbHead_content"><a href="'+location.href+'" title="<%@On the first page%>"><img src="images/lanbilling.gif" /></a>' +
	'<div id="lbHead_icon_user"><img  src="images/icon_user.gif"></div>' +
	'<div id="lbHead_man"> <%@ You loggeg in as %>: </div><div id="lbHead_name"><b>' +
	LoggedPerson +
	'</b></div>' +
	'<div id="lbHead_icon_currency"><img  src="images/icon_currency.gif"></div>' +
	'<div id="lbHead_curs" style="color: red; font-style: italic" title="<%@ There is undefined currency rate today %>"> <%@ Currency rate %>:</div><div id="lbHead_current"><b>' +
	RateValue +
	'</b></div>' +
	'</div><td></td><td>&nbsp;</td></tr></table>' +
	'<div class="lbBackMenu"><table align="center" cellpadding="0" cellspacing="0"><tr><td><div id="lbMenu"></div></td><td align="right"><div id="menuheader" class="x-tool x-tool-toggle x-tool-collapse-north" onclick="Header(\'header\');"></div></td></tr></table></div>';

var south='<div id="lbFoot" style="position:relative;">'+
	 '<div id="lbFootLego" ><img height="80" src="images/lego1.gif"></div><div  style="padding-top:30px; padding-left:20px;">'+
		'<b>&copy; <%@ NetSol %> 2001-'+curYear+'.</b><br />'+
		'<%@ Support %>: (495)795-06-77, E-mail: <a href="mailto:itdep@lanbilling.ru">itdep@lanbilling.ru</a>'+
	'</div></div>';


//Check cookies
var cp=Get_Cookie('mycookie');

if (cp=='headeroff'){
	stateHeader=1;
	north = '<table id="header" style="display:none" class="lbHead" border="0" width="100%" cellpadding="0" cellspacing="0"><tr><td>&nbsp;</td><td width="1024" height="50">' +
	'<div id="lbHead_content"><img src="images/lanbilling.gif" />' +
	'<div id="lbHead_icon_user"><img  src="images/icon_user.gif"></div>' +
	'<div id="lbHead_man"> <%@ You loggeg in as %>: </div><div id="lbHead_name"><b>' +
	LoggedPerson +
	'</b></div>' +
	'<div id="lbHead_icon_currency"><img  src="images/icon_currency.gif"></div>' +
	'<div id="lbHead_curs" style="color: red; font-style: italic" title="<%@ There is undefined currency rate today %>"> <%@ Currency rate %>:</div><div id="lbHead_current"><b>' +
	RateValue +
	'</b></div>' +
	'</div><td></td><td>&nbsp;</td></tr></table>' +
	'<div class="lbBackMenu"><table align="center" cellpadding="0" cellspacing="0"><tr><td><div id="lbMenu"></div></td><td align="right"><div id="menuheader" class="x-tool x-tool-toggle x-tool-collapse-south" onclick="Header(\'header\');"></div></td></tr></table></div>';

	 south='<div id="lbFoot" style="position:relative;display:none;">'+
	 '<div id="lbFootLego" ><img height=80 src="images/lego1.gif"></div><div  style="padding-top:30px; padding-left:20px;">'+
		'<b>&copy; <%@ NetSol %> 2001-'+curYear+'.</b><br />'+
		'<%@ Support %>: (495)795-06-77, E-mail: <a href="mailto:itdep@lanbilling.ru">itdep@lanbilling.ru</a>'+
	'</div></div>';
}


var northPanel={
region: 'north',
autoHeight: true,
border: false,
cmargins: '0 0 0 0',
margins: '0 0 0 0',
html:north
}


var southPanel={
html: south,
region: 'south',
autoHeight: true,
border: false,
cmargins: '0 0 0 0',
margins: '0 0 0 0'
}


var centerPanel={
xtype: 'panel',
autoScroll: true,
collapsible:false,
border:false,
contentEl:'center_page',
region: 'center',
stateful:true,
stateId:'centerpanel',
cmargins: '0 0 0 0',
margins: '0 0 0 0'
}


var container=new Ext.Viewport({
layout: 'border',
renderTo: Ext.getBody(),
autoScroll: true,
stateful:true,
stateId:'containerpanel',
defaults: {
bodyStyle: 'background: url("images/body_back.jpg")'
},
items: [centerPanel,northPanel,southPanel]
});
container.doLayout();

</script>


</body>
</html>
