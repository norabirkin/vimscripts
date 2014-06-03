<?php
error_reporting(7);

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


	<script type="text/javascript" src="./ux/gridfilters/menu/RangeMenu.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/menu/ListMenu.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/GridFilters.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/Filter.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/StringFilter.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/DateFilter.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/ListFilter.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/NumericFilter.js"></script>
	<script type="text/javascript" src="./ux/gridfilters/filter/BooleanFilter.js"></script>
	<link rel="stylesheet" type="text/css" href="./ux/gridfilters/css/GridFilters.css" />
    <link rel="stylesheet" type="text/css" href="./ux/gridfilters/css/RangeMenu.css" />
<script language="javascript">


var Localize = {
		NameOfUser:'<%@ Name of user %>', AgreementNumber:'<%@ Agreement number %>', wrongDateInterval:'<%@ Wrong date interval %>',
		User:'<%@User%>',Login:'<%@Login%>', Account:'<%@Account%>', AgreementNumber:'<%@Agreement number%>',
		Tarif:'<%@Tarif%>',Volume:'<%@Volume%>',Rent:'<%@Rent%>',Above:'<%@Above%>',Sum:'<%@Sum%>',Report2:'<%@Report2%>',
		Print:'<%@Print%>',Type:'<%@Type%>',Company:'<%@Company%>',Personal:'<%@Personal%>',CreateTimeInterval:'<%@Create time interval%>',
		Currency:'<%@Currency%>',Operator:'<%@ Operator %>',Manager:'<%@ Manager %>',User:'<%@ User %>',PaymentDate:'<%@ Payment date %>',
		PayDocumentNumber:'<%@Pay document number%>',generalInformation:'<%@General information%>',Comment:'<%@Comment%>',Operator:'<%@Operator%>',
		selectAll:'<%@Select all%>', registrationDate:'<%@Registration date of payment%>'
	};

</script>
EOF;
$localize->compile($p, true);
?>

<script language="javascript" charset="utf-8">

    var post_name = new Array();
    var post_value = new Array();
    var name = "";
    var value = "";
    var start_period = "";
    var end_period = "";
    var report_filter_agent = "";
    var usergroup_id = "";
    var itogo = 0;
    var header_start_period = "";
    var header_end_period = "";
    var header = "";
    var grid;
    var manager_id = -1;
    var operator_id = 0;

var storeManagers = new Ext.data.Store({
    id: 'managers',
    proxy: new Ext.data.HttpProxy({
        url: 'report2.php',
        method: 'POST'
    }),
    baseParams: {
        getmanagers: 1
    },
    reader: new Ext.data.JsonReader({
        root: 'results'
    }, [{
        name: 'personid',
        type: 'int'
    }, {
        name: 'fio',
        type: 'string'
    }])
/*,
        autoLoad:true*/
});

var storeOperators = new Ext.data.Store({
    id: 'operators',
    proxy: new Ext.data.HttpProxy({
        url: 'report2.php',
        method: 'POST'
    }),
    baseParams: {
        getoperators: 1
    },
    reader: new Ext.data.JsonReader({
        root: 'results'
    }, [{
        name: 'uid',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }])
/*,
        autoLoad:true*/
});

// configure whether filter query is encoded or not (initially)
var encode = false;

// configure whether filtering is performed locally or remotely (initially)
var local = true;
var filters = new Ext.ux.grid.GridFilters({
    // encode and local configuration options defined previously for easier reuse
    //encode: encode, // json encode the filter query
    local: local,
    // defaults to false (remote filtering)
    filters: [{
        type: 'string',
        dataIndex: 'opername'
    }, {
        type: 'string',
        dataIndex: 'manager'
    }, {
        type: 'string',
        dataIndex: 'uname'
    }, {
        type: 'string',
        dataIndex: 'login'
    }, {
        type: 'string',
        dataIndex: 'agreement'
    }, {
        type: 'string',
        dataIndex: ''
    }, {
        type: 'string',
        dataIndex: 'receipt'
    }, {
        type: 'date',
        dataIndex: 'date'
    }, {
        type: 'date',
        dataIndex: 'localdate'
    }, {
        type: 'numeric',
        dataIndex: 'paysum'
    }]
});

//------------------------------------------------------------------------------
Ext.onReady(function(){

    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

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
    start_period        = "<?php echo $_POST['year'].$_POST['month'].$_POST['day']; ?>";
    end_period          = "<?php echo $_POST['t_year'].$_POST['t_month'].$_POST['t_day']; ?>";
    header_start_period = "<?php echo $_POST['day'].'.'.$_POST['month'].'.'.$_POST['year']; ?>";
    header_end_period   = "<?php echo $_POST['t_day'].'.'.$_POST['t_month'].'.'.$_POST['t_year']; ?>";
    report_filter_agent = "<?php echo (integer)$_POST['report_filter_agent']; ?>";
    usergroup_id        = "<?php echo (integer)$_POST['usergroup_id']; ?>";

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
    $tt = json_encode($_filter);
?>
    filter=('<?php echo $tt; ?>');

<?php ?>

header = Localize.Report2 + ' <font color=darkblue>&nbsp;' + header_start_period + ' - ' + header_end_period + '</font> ';
if (!start_period || !end_period || start_period == end_period) {
    Ext.Msg.alert('', Localize.CreateTimeInterval, function() {
        window.close();
    });
    return;
}
createGridOfReports();


// User information on click cell
grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
    var record = grid.getStore().getAt(rowIndex); // Get the Record
    var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get field name
    var data = record.get('agrmid');
    if (fieldName == 'uname') {
        Ext.Ajax.request({
            url: 'report2.php',
            timeout: 1200000,
            success: function(resp, opt) {
                commoninfo = Ext.util.JSON.decode(resp.responseText);
                showInfo(commoninfo.results);
            },
            failure: function() {},
            method: 'POST',
            params: {
                getuserinfo: 1,
                agrmid: data
            }
        });
    }
});

function showInfo(user) {
    if (Ext.isEmpty(user)) return;
    if (user[0].type == 2) {
        if (!user[1]) address1 = 'нет данных';
        else address1 = user[1].address;
        if (!user[2]) address2 = 'нет данных';
        else address2 = user[2].address;
        if (!user[3]) address3 = 'нет данных';
        else address3 = user[3].address;
        var html = '<table border="0" bgcolor="#FFFFFF" width="100%" height="100%" style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;color:gray">' + '<tr><td><font color="red">Физическое лицо</font></td><td></td></tr>' + '<tr><td>ФИО: </td><td>' + user[0].name + '</td></tr>' + '<tr><td>Логин: </td><td>' + user[0].login + '</td></tr>' + '<tr><td>Телефон: </td><td>' + user[0].phone + '</td></tr>' + '<tr><td>Факс: </td><td>' + user[0].fax + '</td></tr>' + '<tr><td>E-mail: </td><td><a href="mailto:' + user[0].email + '">' + user[0].email + '</a></td></tr>' + '<tr><td><font color="red">Паспортные данные</font></td><td> </td></tr>' + '<tr><td>Серия: </td><td>' + user[0].passsernum + '</td></tr>' + '<tr><td>Номер: </td><td>' + user[0].passno + '</td></tr>' + '<tr><td>Когда выдан: </td><td>' + user[0].passissuedate + '</td></tr>' + '<tr><td>Кем выдан: </td><td>' + user[0].passissuedep + '</td></tr>' + '<tr><td>Место выдачи: </td><td>' + user[0].passissueplace + '</td></tr>' + '<tr><td>Дата рождения: </td><td>' + user[0].birthdate + '</td></tr>' + '<tr><td>Место рождения: </td><td>' + user[0].birthplace + '</td></tr>' + '<tr><td><font color="red">Адреса</font></td><td></td></tr>' + '<tr><td>Адрес прописки: </td><td>' + address1 + '</td></tr>' + '<tr><td>Почтовый адрес: </td><td>' + address2 + '</td></tr>' + '<tr><td>Адрес доставки счета: </td><td>' + address3 + '</td></tr>' + '</table>';

    } else {

        if (!user[1]) address1 = 'нет данных';
        else address1 = user[1].address;
        if (!user[2]) address2 = 'нет данных';
        else address2 = user[2].address;
        if (!user[3]) address3 = 'нет данных';
        else address3 = user[3].address;
        var html = '<table border="0" bgcolor="#FFFFFF" width="100%" height="100%" style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;color:gray">' + '<tr><td><font color="red">Юридическое лицо</font></td><td></td></tr>' + '<tr><td>Название организации: </td><td>' + user[0].name + '</td></tr>' + '<tr><td>Логин: </td><td>' + user[0].login + '</td></tr>' + '<tr><td>Телефон: </td><td>' + user[0].phone + '</td></tr>' + '<tr><td>Факс: </td><td>' + user[0].fax + '</td></tr>' + '<tr><td>E-mail: </td><td><a href="mailto:' + user[0].email + '">' + user[0].email + '</a></td></tr>' + '<tr><td>Директор: </td><td>' + user[0].gendiru + '</td></tr>' + '<tr><td>Главный бухгалтер: </td><td>' + user[0].glbuhgu + '</td></tr>' + '<tr><td>Контактное лицо: </td><td>' + user[0].kontperson + '</td></tr>' + '<tr><td><font color="red">Банковские реквизиты</font></td><td></td></tr>' + '<tr><td>Банк: </td><td>' + user[0].bankname + '</td></tr>' + '<tr><td>Отделение банка: </td><td>' + user[0].branchbankname + '</td></tr>' + '<tr><td>Бик: </td><td>' + user[0].bik + '</td></tr>' + '<tr><td>Расчетный счет: </td><td>' + user[0].settl + '</td></tr>' + '<tr><td>Корр. счет: </td><td>' + user[0].corr + '</td></tr>' + '<tr><td>ИНН: </td><td>' + user[0].inn + '</td></tr>' + '<tr><td>КПП: </td><td>' + user[0].kpp + '</td></tr>' + '<tr><td>ОКПО: </td><td>' + user[0].okpo + '</td></tr>' + '<tr><td>ОКВЭД: </td><td>' + user[0].okved + '</td></tr>' + '<tr><td>Казначейство: </td><td>' + user[0].treasuryname + '</td></tr>' + '<tr><td>Лицевой счет казначейства: </td><td>' + user[0].treasuryaccount + '</td></tr>' + '<tr><td><font color="red">Адреса</font></td><td></td></tr>' + '<tr><td>Адрес прописки: </td><td>' + address1 + '</td></tr>' + '<tr><td>Почтовый адрес: </td><td>' + address2 + '</td></tr>' + '<tr><td>Адрес доставки счета: </td><td>' + address3 + '</td></tr>' + '</table>';
    }

    var container = new Ext.Window({
        title: 'Информация о пользователе',
        width: 600,
        height: 450,
        html: html,
        defaults: {
            bodyStyle: 'padding:10px'
        },
        layout: 'anchor'
    });
    container.show();
}

//-----------------------------------------------------------------------------------------------
function createGridOfReports(){
	//Store for list of  user reports


var storeReports = new Ext.data.Store({
    id: 'listOfReports',

    proxy: new Ext.data.HttpProxy({
        url: 'report2.php',
        method: 'POST',
        timeout: 1200000
    }),
    baseParams: {
        filter: filter,
        manager_id: manager_id,
        operator_id: operator_id,
        start_period: start_period,
        end_period: end_period,
        usergroup_id: usergroup_id,
        report_filter_agent: report_filter_agent,
        limit: 500,
        start: 0
    },
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total'
    }, [{
        name: 'opername',
        type: 'string'
    }, {
        name: 'manager',
        type: 'string'
    }, {
        name: 'comment',
        type: 'string'
    }, {
        name: 'uname',
        type: 'string'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'agreement',
        type: 'string'
    }, {
        name: 'date',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'localdate',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'receipt',
        type: 'string'
    }, {
        name: 'paysum',
        type: 'string'
    }, {
        name: 'currsymb',
        type: 'string'
    }, {
        name: 'above',
        type: 'string'
    }, {
        name: 'str_volume',
        type: 'string'
    }, {
        name: 'curr_symbol',
        type: 'string'
    }, {
        name: 'agrmid',
        type: 'string'
    }

    ])
});

//End Store for list of  user reports
//Ext.Msg.wait('Загрузка... подождите!','Загрузка');
//storeReports.load();

storeReports.on('load', function() {
    //delay the message 1 seconds
    setTimeout(function() { Ext.Msg.hide(); }, 1000);
});


var	gridColumnModel = new Ext.grid.ColumnModel(
    [
        {
			id: 'agrmid',
			header:'ID',
			width: 50,
			hidden:true,
			sortable: true,
			dataIndex: 'agrmid'
		},{
			id: 'paysum',
			header:'<img align=left src=\'../images/search.gif \'>'+Localize.Sum,
			width: 120,
			sortable: true,
			dataIndex: 'paysum'
		},{
			id: 'currsymb',
			header: Localize.Currency,
			width: 60,
			sortable: true,
			dataIndex: 'currsymb'
		},{
			id: 'receipt',
			header:'<img align=left src=\'../images/search.gif \'>'+Localize.PayDocumentNumber,
			width: 165,
			sortable: true,
			dataIndex: 'receipt'
		},{
			id: 'date',
			header: '<img align=left src=\'../images/search.gif \'>'+Localize.PaymentDate,
			width: 130,
			sortable: true,
			renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
			dataIndex: 'date'
		},{
			id: 'uname',
			header: '<img align=left src=\'../images/search.gif \'>'+Localize.User,
			width: 160,
			sortable: true,
			renderer: function(val){ return '<img align=left src=\'../images/user_online.gif \'>'+val;},
			dataIndex: 'uname'
		},{
			id: 'agreement',
			header:'<img align=left src=\'../images/search.gif \'>'+Localize.AgreementNumber,
			width: 180,
			sortable: true,
			dataIndex: 'agreement'
		},{
			id: 'login',
			header: '<img align=left src=\'../images/search.gif \'>'+Localize.Login,
			width: 160,
			sortable: true,
			dataIndex: 'login'
		},{
			id: 'opername',
			header:'<img align=left src=\'../images/search.gif \'>'+Localize.Operator,
			width: 130,
			sortable: true,
			dataIndex: 'opername'
		},{
			id: 'manager',
			header: '<img align=left src=\'../images/search.gif \'>'+Localize.Manager,
			width: 120,
			sortable: true,
			dataIndex: 'manager'
		},{
			id: 'localdate',
			header: '<img align=left src=\'../images/search.gif \'>'+Localize.registrationDate,
			width: 130,
			sortable: true,
			renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
			dataIndex: 'localdate'
		},{
			id: 'comment',
			header: Localize.Comment,
			width: 90,
			hidden: true,
			sortable: true,
			dataIndex: 'comment'
		}
    ]
);

// Create the Grid
grid = new Ext.grid.GridPanel({
		id: 'gridid',
		title:header,
		store: storeReports,
		frame: true,
		renderTo:'report2',
		cm: gridColumnModel,
		plugins:[filters],
		stripeRows: true,
		sm: new Ext.grid.RowSelectionModel({
			singleSelect: true
		}),
		tbar: [
            {
                xtype: 'button',
                text: Localize.generalInformation,
                handler: function(f){
                    Ext.Msg.alert('Общая информация', 'Итоговая сумма: ' + itogo + ' руб.');
				}
			},
			{xtype:'tbseparator'},
			Localize.Manager+': ',
			{
				xtype: 'combo',
				id: 'managerlist',
				width:250,
				allowBlank:true,
				name:'groupofmanagers',
				displayField: 'fio',
				value:Localize.selectAll,
				store: storeManagers,
                tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.fio}">{[values.personid >=0 ? values.personid + ". " : ""]}{[Ext.util.Format.ellipsis(values.fio, 27)]}</div></tpl>',
				triggerAction:'all',
					listeners: {
						select: function (f,r,i){
						data=this.store.data.items[i].data['fio'];
						manager_id=this.store.data.items[i].data['personid'];

						}
					}
			},
			{xtype:'tbseparator'},
            Localize.Operator+': ',
			{
				xtype: 'combo',
				id: 'operatorlist',
				width:250,
				allowBlank:true,
				value:Localize.selectAll,
				name:'groupofoperators',
				displayField: 'name',
				store: storeOperators,
				triggerAction:'all',
					listeners: {
						select: function (f,r,i){
						operator_id=this.store.data.items[i].data['uid'];

						}
					}
				},
                {xtype:'tbseparator'},
				{
                    xtype: 'button',
                    text:'Показать',
                    handler: function(f){
                        Ext.Msg.wait('Загрузка... подождите!','Загрузка');
                        storeReports.baseParams.manager_id=manager_id;
                        storeReports.baseParams.operator_id=operator_id;
                        storeReports.load();
                        var conn=new Ext.data.Connection();
                        conn.request({
                            url:'report2.php',
                            method:'POST',
                            timeout:1200000,
                            params:{filter:filter,manager_id:manager_id,operator_id:operator_id,start_period:start_period, end_period:end_period,usergroup_id:usergroup_id,report_filter_agent:report_filter_agent,commondate:1},
                            success: function(resp,opt){
                            itogo=resp.responseText;

                            },
                            failure:function(resp,opt){alert("failure");}
                        });
					}
				},
				{xtype:'tbfill'},
				{xtype:'tbseparator'},
				{xtype: 'button',text:Localize.Print,handler: function(f){gridPrint(header,gridColumnModel,storeReports);}}
		],
		bbar:	new Ext.PagingToolbar({pageSize:500,store:storeReports,displayInfo: true}),
		height: 650
		//width: 1170
	});


}

});

//--------------------------------------------------------------------------


function typeOfUser(val) {
    if (val == 1) {
        val = '<span style="color:darkblue;">' + val + '</span>';
    }
    if (val == 2) {
        val = '<span style="color:green;">' + val + '</span>';
    }

    return val;
}


function pctChangeGreen(val) {
    var p;
    p = parseInt(val);
    if (p == 1) {
        return '<span style="color:green;">' + val + '</span>';
    } else if (p == 2) {
        return '<span style="color:red;">' + val + '</span>';
    }
    return val;
}

function pctChangeBlue(val) {

    return '<span style="color:blue;">' + val + '</span>';

}



function gridPrint(tableHeader, tableBaseParams, gridData) {
    var htmlCode = "";
    var nameWindow = header;
    var tableWidth;
    var numGridColons;
    var numGridStrings;
    var namesOfColons = new Array();


    tableWidth = tableBaseParams.totalWidth;
    numGridColons = tableBaseParams.config.length;


    htmlCode = "<table cellspacing=0>" + "<tr><td colspan=" + numGridColons + " class=hd2>" + tableHeader + "</td></tr>";
    htmlCode += "<tr>";
    for (i = 0, j = 0; i < numGridColons; ++i) {
        if (!tableBaseParams.config[i].hidden) {
            htmlCode += "<td class=hd2 width=" + tableBaseParams.config[i].width + ">" + tableBaseParams.config[i].header + "</td>";
            namesOfColons[j++] = tableBaseParams.config[i].dataIndex;
        }
    }
    numGridColons = j;
    htmlCode += "</tr>";

    numGridStrings = gridData.data.items.length;

    for (i = 0; i < numGridStrings; ++i) {
        htmlCode += "<tr>";
        for (j = 0; j < numGridColons; ++j) {
            name = namesOfColons[j];
            data = gridData.data.items[i].data[name];
            if (name == "atype") {
                if (data == "1") data = "Юр. лицо";
                if (data == "2") data = "Физ. лицо";
            }
            if (data == "") data = "&nbsp;";
            htmlCode += "<td>" + data + "</td>";
        }
        htmlCode += "</tr>";
    }

    htmlCode += "</table>";
    openPrintWin(nameWindow, tableWidth, htmlCode);

    return;
}
function openPrintWin(nameWindow, tableWidth, htmlCode) {
    myWin = open("", "", "width=" + tableWidth + ",menubar=1, scrollbars=1");
    myWin.document.open();
    myWin.document.write("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\" /><title>" + nameWindow + "</title>");
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


<body background="../images/body_back.jpg" style="padding-top:20px;">
    <table  width="100%" height="100%">
        <tr>
            <td>
                <table align="center">
                    <tr><td><span id='report2'></span></td></tr>
                </table>
            </td>
        </tr>
        <tr valign="bottom">
            <td>
                <div id="lbFoot">
                    <div  style="padding-left:20px; padding-top:25px; font-size:13px;">
                        <b>&copy; <?php echo $localize->get('NetSol'); ?> 2001-<?php echo date('Y');?>.</b><br />
                        <?php echo $localize->get('Support'); ?>:(495)795-06-77, E-mail: <a href="mailto:itdep@lanbilling.ru">itdep@lanbilling.ru</a>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
