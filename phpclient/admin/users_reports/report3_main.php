<?php

include_once("../localize.php");
include_once('../localize.class.php');
include_once("../functions.inc");
include_once("../api_functions.php");
include_once("../constants.php");
include_once("../IT.php");
include_once("../common_display_1.php");
include_once("../soap.class.php");
include_once("../main.class.php");
include_once("../includes.php");
$localize = new Localize('ru', 'UTF-8',array("rootPath"=>"../"));
$lanbilling = new LANBilling(array("rootPath"=>"../"));


$p=<<<EOF

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" type="text/css" href="./../resources/extjs-3/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="./../resources/extjs-3/resources/css/xtheme-gray.css">
<script type="text/javascript" src="./../resources/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="./../resources/extjs-3/ext-all.js"></script>
<script language="javascript">


var Localize = {
		wrongDateInterval:'<%@ Wrong date interval %>',
		legalPerson:'<%@Legal person%>',physicalPerson:'<%@Physical person%>',all:'<%@All%>',
		vgids:'<%@User services total%>',internetReport:'<%@Internet report%>',
		User:'<%@User%>', Account:'<%@Account%>', AgreementNumber:'<%@Agreement number%>', ModuleType:'<%@Module type%>',
		Tarif:'<%@Tarif%>',Volume:'<%@Volume%>',Rent:'<%@Rent%>',Above:'<%@Above%>',Sum:'<%@Sum%>',Report1:'<%@Report1%>',
		Print:'<%@Print%>',Type:'<%@Type%>',Company:'<%@Company%>',Personal:'<%@Personal%>',CreateTimeInterval:'<%@Create time interval%>',
		Currency:'<%@Currency%>',Sum:'<%@Sum%>',generalInformation:'<%@General information%>',Comment:'<%@Comment%>'
	};

</script>
EOF;
$localize->compile($p, true);
?>

<script language="javascript">
var post_name=new Array();
var post_value=new Array();
var name="";
var value="";
var start_period="";
var end_period="";
var report_filter_agent="";
var usergroup_id="";
var header_start_period="";
var header_end_period="";
var header="";
var storeReports;
var filter;
var grid;
var common;
//------------------------------------------------------------------------------
Ext.onReady(function(){
Ext.QuickTips.init();
//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

<?php

if(!empty($_POST)){
	$i=0;
	foreach($_POST as $name => $val){?>
				post_name[<?php echo $i;?>]="<?php echo $name?>";
				name=name+post_name[<?php echo $i;?>]+",";
				post_value[<?php echo $i;?>]="<?php echo $val?>";
				value=value+post_value[<?php echo $i;?>]+",";
				<?php $i++;
	}
}
?>


start_period="<?php echo $_POST['year'].$_POST['month'].$_POST['day']; ?>";
end_period="<?php echo $_POST['t_year'].$_POST['t_month'].$_POST['t_day']; ?>";
header_start_period="<?php echo $_POST['day'].'.'.$_POST['month'].'.'.$_POST['year']; ?>";
header_end_period="<?php echo $_POST['t_day'].'.'.$_POST['t_month'].'.'.$_POST['t_year']; ?>";
report_filter_agent="<?php echo (integer)$_POST['report_filter_agent']; ?>";
usergroup_id="<?php echo (integer)$_POST['usergroup_id']; ?>";
<?php
if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
		foreach($_POST['searchtpl'] as $item) {
			$t = explode('.', $item['property']);
			$_filter['searchtempl'][] = array(
				"tplname" => '',
				"tablename" => $t[0],
				"field" => $t[1],
				"condition" => $item['condition'],
				"value" => $item['value'],
				"logic" => $item['logic']
			);
		}
	}
$tt=json_encode($_filter);
?>filter=('<?php echo $tt; ?>');<?php
?>


header=Localize.internetReport+' <font color=darkblue>&nbsp;'+header_start_period+' - '+header_end_period+'</font> ';
if (!start_period || !end_period || start_period==end_period) {
	Ext.Msg.alert('',Localize.CreateTimeInterval,function(){window.close();});
	return;
}
createGridOfReports();


//-----------------------------------------------------------------------------------------------

function createGridOfReports(){
	//Store for list of  user reports
var conn=new Ext.data.Connection();
	conn.request({
		url:'report3.php',
		method:'POST',
		timeout:380000,
		params:{filter:filter,start_period:start_period, end_period:end_period,report_filter_agent:report_filter_agent,commondate:1,usergroup_id:usergroup_id},
		success: function(resp,opt){
		common=Ext.util.JSON.decode(resp.responseText);

		},
		failure:function(resp,opt){alert("failure");}
	});


storeReports = new Ext.data.Store({
		id: 'listOfReports',
		proxy: new Ext.data.HttpProxy({
			url: 'report3.php',
			method: 'POST',
			timeout:380000
		}),
		baseParams:{filter:filter,start_period:start_period, end_period:end_period,report_filter_agent:report_filter_agent,usergroup_id:usergroup_id,limit:500,start:0},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[
			{name:'tar_descr',type:'string'},
			{name:'vg_id',type:'string'},
			{name:'user_type',type:'string'},
			{name:'rent',type:'string'},
			{name:'above',type:'string'},
			{name:'sum',type:'string'},
			{name:'curr_symbol',type:'string'}

		])
	});
//End Store for list of  user reports
Ext.Msg.wait('Загрузка... подождите!','Загрузка');

storeReports.load();

storeReports.on('load',function(){
    //delay the message 1 seconds
	var vgid=0;
	var rent=0;
	var above=0;
	var sum=0;

	storeReports.each(function(record){
							vgid=vgid+parseInt(record.data['vg_id']);
							rent=rent+parseFloat(record.data['rent']);
							above=above+parseFloat(record.data['above']);
							sum=sum+parseFloat(record.data['sum']);
					});
	rent=rent.toFixed(2);
	above=above.toFixed(2);
	sum=sum.toFixed(2);
	common=new Ext.data.Record({'tar_descr':'<font color=red>Итого</font>','vg_id':'<font color=red>'+vgid+'</font>','user_type':'','rent':'<font color=red>'+rent+'</font>','above':'<font color=red>'+above+'</font>','sum':'<font color=red>'+sum+'</font>','curr_symbol':''});
	storeReports.add(common);

    setTimeout(function(){
        Ext.Msg.hide(); // just to see the waiting message XD (don't do it in the real world)
    },1000);
});

var	gridColumnModel = new Ext.grid.ColumnModel(
[{
			id: 'tardescr',
			header: Localize.Tarif,
			width: 230,
			sortable: true,
			dataIndex: 'tar_descr'
		}, {
			id: 'vgid',
			header: Localize.vgids,
			width: 100,
			sortable: true,
			dataIndex: 'vg_id'
		}, {
			id: 'type',
			header: Localize.Type,
			width: 120,
			renderer: typeOfUser,
			sortable: true,
			dataIndex: 'user_type'
		},{
			id: 'rent',
			header:Localize.Rent,
			width: 130,
			sortable: true,
			dataIndex: 'rent'
		}, {
			id: 'above',
			header: Localize.Above,
			width: 130,
			sortable: true,
			dataIndex: 'above'
		}, {
			id: 'sum',
			header:Localize.Sum,
			width: 70,
			sortable: true,
			dataIndex: 'sum'
		}, {
			id: 'currsymbol',
			header:Localize.Currency,
			width: 70,
			sortable: true,
			dataIndex: 'curr_symbol'
		}]
);

	// Create the Grid
grid = new Ext.grid.GridPanel({
		id: 'gridid',
		title:header,
		store: storeReports,
		frame: true,
		renderTo:'report3',
		cm: gridColumnModel,
		stripeRows: true,
		sm: new Ext.grid.RowSelectionModel({
			singleSelect: true
		}),
		 tbar: [{xtype: 'button',
		 			text:Localize.legalPerson,
					handler: function(f){
						var vgid=0;
						var rent=0;
						var above=0;
						var sum=0;
						storeReports.remove(common);
						storeReports.filter('user_type','1');
						storeReports.each(function(record){
											vgid=vgid+parseInt(record.data['vg_id']);
											rent=rent+parseFloat(record.data['rent']);
											above=above+parseFloat(record.data['above']);
											sum=sum+parseFloat(record.data['sum']);
										  });
						rent=rent.toFixed(2);
						above=above.toFixed(2);
						sum=sum.toFixed(2);
						common=new Ext.data.Record({'tar_descr':'<font color=red>Итого</font>','vg_id':'<font color=red>'+vgid+'</font>','user_type':'','rent':'<font color=red>'+rent+'</font>','above':'<font color=red>'+above+'</font>','sum':'<font color=red>'+sum+'</font>'});
						storeReports.add(common);

						}
				},
		 		{xtype:'tbseparator'},
				{xtype: 'button',
					text:Localize.physicalPerson,
					handler: function(f){
						var vgid=0;
						var rent=0;
						var above=0;
						var sum=0;
						storeReports.remove(common);
						storeReports.filter('user_type','2');
						storeReports.each(function(record){
											vgid=vgid+parseInt(record.data['vg_id']);
											rent=rent+parseFloat(record.data['rent']);
											above=above+parseFloat(record.data['above']);
											sum=sum+parseFloat(record.data['sum']);
										  });
						rent=rent.toFixed(2);
						above=above.toFixed(2);
						sum=sum.toFixed(2);
						common=new Ext.data.Record({'tar_descr':'<font color=red>Итого</font>','vg_id':'<font color=red>'+vgid+'</font>','user_type':'','rent':'<font color=red>'+rent+'</font>','above':'<font color=red>'+above+'</font>','sum':'<font color=red>'+sum+'</font>'});
						storeReports.add(common);

					}
				},
		 		{xtype:'tbseparator'},
				{xtype: 'button',
					text:Localize.all,
					handler: function(f){
						var vgid=0;
						var rent=0;
						var above=0;
						var sum=0;
						storeReports.remove(common);
						storeReports.filter('user_type','');
						storeReports.each(function(record){
											vgid=vgid+parseInt(record.data['vg_id']);
											rent=rent+parseFloat(record.data['rent']);
											above=above+parseFloat(record.data['above']);
											sum=sum+parseFloat(record.data['sum']);
										  });

						rent=rent.toFixed(2);
						above=above.toFixed(2);
						sum=sum.toFixed(2);
						common=new Ext.data.Record({'tar_descr':'<font color=red>Итого</font>','vg_id':'<font color=red>'+vgid+'</font>','user_type':'','rent':'<font color=red>'+rent+'</font>','above':'<font color=red>'+above+'</font>','sum':'<font color=red>'+sum+'</font>'});
						storeReports.add(common);
						}
				},
		 		{xtype:'tbfill'},
				{xtype:'tbseparator'},
				{xtype: 'button',text:Localize.Print,handler: function(f){gridPrint(header,gridColumnModel,storeReports);}}
				],
		bbar:	new Ext.PagingToolbar({pageSize:500,store:storeReports,displayInfo: true}),
		height: 650,
		width: 900
	});
}

});
//--------------------------------------------------------------------------
function typeOfUser(val)
{
if (val==1) {val=Localize.Company; val='<span style="color:darkblue;">' + val + '</span>';}
if (val==2) {val=Localize.Personal;val='<span style="color:green;">' + val + '</span>';}

return val;
}


function pctChangeGreen(val){
var p;
 p=parseInt(val);
        if(p == 1){
            return '<span style="color:green;">' + val + '</span>';
        }else if(p == 2){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

function pctChangeBlue(val){

            return '<span style="color:blue;">' + val + '</span>';

    }
function gridPrint(tableHeader,tableBaseParams,gridData){
var htmlCode="";
var nameWindow=header;
var tableWidth;
var numGridColons;
var numGridStrings;
var namesOfColons= new Array();
tableWidth=tableBaseParams.totalWidth;
numGridColons=tableBaseParams.config.length;


htmlCode="<table cellspacing=0>"+
"<tr><td colspan="+numGridColons+" class=hd2>"+tableHeader+"</td></tr>";
htmlCode+="<tr>";
for(i=0,j=0; i<numGridColons; ++i){
	if (!tableBaseParams.config[i].hidden){
		htmlCode+="<td class=hd2 width="+tableBaseParams.config[i].width+">"+tableBaseParams.config[i].header+"</td>";
		namesOfColons[j++]=tableBaseParams.config[i].dataIndex;
	}
}
numGridColons=j;
htmlCode+="</tr>";

numGridStrings=gridData.data.items.length;

for(i=0; i<numGridStrings; ++i){
	htmlCode+="<tr>";
		for(j=0; j<numGridColons; ++j){
			name=namesOfColons[j];
			data=gridData.data.items[i].data[name];
			if(name=="atype") {if (data=="1") data="Юр. лицо";if (data=="2") data="Физ. лицо";}
			if (data=="") data="&nbsp;";
			htmlCode+="<td>"+data+"</td>";
		}
	htmlCode+="</tr>";
}

htmlCode+="</table>";
openPrintWin(nameWindow,tableWidth,htmlCode);

return;
}

function openPrintWin(nameWindow,tableWidth,htmlCode) {

myWin= open("", "","width="+tableWidth+",menubar=1, scrollbars=1");


myWin.document.open();


myWin.document.write("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\" /><title>"+nameWindow+"</title>");


myWin.document.write(" <style>");
myWin.document.write(".body  { font-family: verdana,tahoma,arial,lucida,helvetica,sans-serif; font-size: 11px; }");
myWin.document.write("td { padding: 4px; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;font-family: verdana,tahoma,arial,lucida,helvetica,sans-serif; font-size: 11px; }");
myWin.document.write("table { border-left: solid 1px #c0c0c0; border-top: solid 1px #c0c0c0;margin:0; }");
myWin.document.write(".hd2 { font-weight: bold; font-size: 11px; text-align: center; background-color: #e0e0e0; }");
myWin.document.write("</style>");

myWin.document.write("</head><body style='margin:0;padding:0'>");
myWin.document.write(htmlCode);
myWin.document.write("</body></html>");


myWin.document.close();
}
</script>
<style>
html, body {margin: 0; padding: 0;}
html {height:100%;}
body {min-height: 100%; height: auto !important; height: 100%;}
/*Links*/
a:link {color: #29aaa2;text-decoration: underline;}
a:visited{color: #000000;text-decoration: underline;}
a:active {color: #29aaa2;text-decoration: underline;}
a:hover{color:#29aaa2;text-decoration: underline;}
.selected {color:#29aaa2;text-decoration: none; font-weight:bold;}

body {font-size: 13px; font-family: Arial, Helvetica, Tahoma, sans-serif; min-width:1024px;}
#lbFoot { display: block; position: static; height: 80px !important; background: url('../images/footer.gif') repeat-x bottom left;}
input { border:none;}
</style>
<body background=../images/body_back.jpg style=padding-top:20px;>

<table  width="100%" height="100%">
<tr><td>
<table align="center">

<tr><td><span id='report3'></span></td></tr>
</table>
</td></tr>
<tr valign="bottom"><td><div id="lbFoot">
<div  style="padding-left:20px; padding-top:25px; font-size:13px;">
<b>&copy; OOO "Сетевые Решения" 2001-<?php echo date('Y');?>.</b><br />
Технические вопросы:(495)795-06-77, E-mail: <a href="mailto:itdep@lanbilling.ru">itdep@lanbilling.ru</a>
</div>
     </div>
</td></tr>
</table>
</body>



