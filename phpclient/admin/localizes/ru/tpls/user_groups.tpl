<script type="text/javascript" src="js/searchtemplate.js"></script>
<script language="javascript">
//--------------------------------------------------------------------------
var Localize = {userGroups:'<%@ Users groups %>',userTotals:'<%@ Users total %>',name:'<%@ Name %>',
description:'<%@ Description %>',add:'<%@ Add %>', groupStructure:'<%@ Group structure%>',
accesibleInGroup:'<%@ Are accessible to assignment in group %>',
toGroupsList:'<%@ Go back to list %>',ugroupModification:'<%@User group modification%>',
promisedPayments:'<%@Promised payments%>',groupName:'<%@Group name%>',groupDescription:'<%@Group description%>',
maxSum:'<%@Maximum sum of payment%>',noMore:'<%@No more subscriber card%>',minSum:'<%@Minimum sum of payment%>',
admDebts:'<%@Admissible debts%>',currentCancel:'<%@To cancel in a current%>',currency:'<%@Currency%>',
AdvancedSearch: '<%@ Advanced search %>',
Add: '<%@ Add %>', Save: '<%@ Save %>', Remove: '<%@ Remove %>',Form: '<%@ Form %>',Upload: '<%@ Upload %>',
		StringOfQuery:'<%@ String of query %>', FilterOfRecords:'<%@ Filter of records %>', NetworkAgent:'<%@ Network agent %>',
		UserGroup:'<%@ User group %>', BeginOfPeriod:'<%@ Begin of period %>', EndOfPeriod:'<%@ End of period %>',
		LoginOfAccounts:'<%@ Account login %>',DescribeOfAccounts:'<%@ Describe of accounts %>',
		NameOfUser:'<%@ Name of user %>', AgreementNumber:'<%@ Agreement number %>', AppropriateIP:'<%@ Appropriate IP %>',
		AppropriatePhoneNumber:'<%@ Appropriate phone number %>' , code1C:'<%@ 1C code %>',OpenReportIn:'<%@ Open report in %>',
		NewWindow:'<%@ New window %>', Excel:'<%@ Excel %>', PDF:'<%@ PDF %>', logicalOperator:'<%@ Logical operator %>',
		addFilterString:'<%@ Add filter string %>',  wrongDateInterval:'<%@ Wrong date interval %>',
		Balance:'<%@ Balance %>',SelfReports:'<%@Self reports%>',StandartReports:'<%@Standart reports%>',
		Period:'<%@ Period %>',Date:'<%@ Date %>',Wait:'<%@ Wait for complete %>',Upload:'<%@File uploading %>',
		UsrsGrps: '<%@ Users groups %>', PersonFullName: '<%@ Person full name %>', Description: '<%@ Description %>',
		SetPermissions:'<%@ Set permissions for ./admin/users_reports %>', Warning: '<%@ Warning %>',
		Balance: '<%@ Balance %>', Symbol: '<%@ Symbol %>', Agreement: '<%@ Agreement %>', Address: '<%@ Address %>',
		Phone: '<%@ Phone %>', Login: '<%@ Login %>', UserLogin: '<%@ User login %>', AccountLogin: '<%@ Account login %>',
		Search: '<%@ Search %>', UserTpl: '<%@ User template %>', Template: '<%@ Template %>', EditUser: '<%@ Edit user %>',
		DeleteUser: '<%@ Delete user %>', UserType: '<%@ User type %>', Legal: '<%@ Legal person %>', Physic: '<%@ Physical person %>',
		SendingData: '<%@ Sending data %>', Connecting: '<%@ Connecting %>', AUsrFrmFields: '<%@ Additional user form fields %>',
		Type: '<%@ Type %>', DeleteField: '<%@ Remove %> <%@ field %>', EditField: '<%@ Edit %> <%@ field %>', Error: '<%@ Error %>',
		AddNewRecord: '<%@ Add new record %>', Cancel: '<%@ Cancel %>', Save: '<%@ Save %>', AddValue: '<%@ Add %> <%@ value %>',
		Value: '<%@ Value %>', DefinedValues: '<%@ Defined values %>', Field: '<%@ Field %>', Text: '<%@ Text %>', List: '<%@ List %>',
		Logic: '<%@ Logic %>', AND: '<%@ AND %>', OR: '<%@ OR %>', Date: '<%@ Date %>', equal: '<%@ equal %>',
		notequal: '<%@ not %> <%@ equal %>', equalmorethan: '<%@ equal %> <%@ or %> <%@ more than %>',
		equallessthan: '<%@ equal %> <%@ or %> <%@ less than %>', morethan: '<%@ more than %>', lessthan: '<%@ less than %>',
		contains: '<%@ contains %>', Condition: '<%@ Condition %>', Blocking: '<%@ Blocking %>', Blocked: '<%@ Blocked %>',
		ByClient: '<%@ by client %>', ByMan: '<%@ by manager %>', ByBalance: '<%@ by balance %>', ByTraf: '<%@ by traffic %>',
		Paycode: '<%@ Paycode %>', Module: '<%@ Agent %>', Tarif: '<%@ Tarif %>', Currency: '<%@ Currency %>',
		SearchTemplate: '<%@ Search template %>', Name: '<%@ Name %>', Property: '<%@ Property %>',
		AddNewCondition: '<%@ Add %> <%@ new condition %>', Change: '<%@ Change %>', AdvancedSearch: '<%@ Advanced search %>',
		rules: '<%@ rules %>', Create: '<%@ Create %>', Info: '<%@ Info %>', AdvancedSearch: '<%@ Advanced search %>',
		Change: '<%@ Change %>', Create: '<%@ Create %>', rules: '<%@ rules %>', SearchTemplate: '<%@ Search template %>',
		Name: '<%@ Name %>', Property: '<%@ Property %>', AddNewCondition: '<%@ Add %> <%@ new condition %>', Cancel: '<%@ Cancel %>',
		Save: '<%@ Save %>', AddValue: '<%@ Add %> <%@ value %>', Value: '<%@ Value %>', DefinedValues: '<%@ Defined values %>',
		Field: '<%@ Field %>', Text: '<%@ Text %>', List: '<%@ List %>', Logic: '<%@ Logic %>', AND: '<%@ AND %>', OR: '<%@ OR %>',
		Date: '<%@ Date %>', equal: '<%@ equal %>', notequal: '<%@ not %> <%@ equal %>',
		equalmorethan: '<%@ equal %> <%@ or %> <%@ more than %>', equallessthan: '<%@ equal %> <%@ or %> <%@ less than %>',
		morethan: '<%@ more than %>', lessthan: '<%@ less than %>', contains: '<%@ contains %>', Condition: '<%@ Condition %>',
		Credit: '<%@ Credit %>', UserName: '<%@ User name %>', CurrentShape: '<%@ Current shape %>', Blocking: '<%@ Blocking %>',
		Blocked: '<%@ Blocked %>', ByClient: '<%@ by client %>', ByMan: '<%@ by manager %>', ByBalance: '<%@ by balance %>',
		ByTraf: '<%@ by traffic %>', UserType: '<%@ User type %>', Balance: '<%@ Balance %>', Paycode: '<%@ Paycode %>',
		Module: '<%@ Agent %>', Tarif: '<%@ Tarif %>', Address: '<%@ Address %>', Legal: '<%@ Legal person %>',
		Physic: '<%@ Physical person %>', Apply: '<%@ Apply %>',ApplyFilter: '<%@ To applay the filter%>',
		IncludePromised: '<%@Include promised payments%>',Confirm: '<%@ Confirm %>',
		GroupCreation: '<%@For group creation enter her name and press the button to save%>',
		InProgress: '<%@Save process in progress%>'


};

var storeGroups;
var groupid;
Ext.onReady(function(){
Ext.QuickTips.init();

/*
 * Get list of user groups to store
 */
storeGroups = new Ext.data.Store({
		id: 'storegroups',
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, getgroups: 1},
		reader: new Ext.data.JsonReader({
		root: 'results'
		},[ {name:'editgroup',type:'string'},
			{name:'groupid',type:'int'},
			{name:'usercnt',type:'string'},
			{name:'name',type:'string'},
			{name:'description',type:'string'},
			{name:'promisemax',type:'string'},
			{name:'promisemin',type:'string'},
			{name:'promiseallow',type:'int'},
			{name:'promiserent',type:'int'},
			{name:'promisetill',type:'string'},
			{name:'promiselimit',type:'string'},
			{name:'promiseblockdays',type:'int'},
			{name:'promiseondays',type:'int'},
            {name:'blockamount',type:'int'},
            {name:'blockdurationdebtor',type:'int'},
            {name:'blockdurationdenouncement',type:'int'},
			{name:'deletegroup',type:'string'},
			{name:'fread',type:'int'},
			{name:'fwrite',type:'int'}
		]),
		autoLoad:true
	});
//end store storeGroups


/*
 * Grid of user groups
 */
var groupsList = new Ext.grid.GridPanel({
	id			:'groupsList',
	title		:Localize.userGroups,
	renderTo	:'list_groups',
	store		: storeGroups,
	autoExpandColumn : 'name',
	frame		:true,

		columns: [
			{id:'imgedit',
			header:'&nbsp;',
			width: 35,
			renderer:getButtonEdit
			},
			{id:'groupid',
			header:'ID',
			width: 40,
			hidden:false,
			dataIndex: 'groupid'
			},
			{id:'usercnt',
			header:Localize.userTotals,
			width: 100,
			hidden:false,
			dataIndex: 'usercnt'
			},
			{id:'name',
			header:Localize.name,
			width: 210,
			sortable: true,
			dataIndex: 'name'
			},
			{id:'description',
			header:Localize.description,
			width: 310,
			sortable: true,
			dataIndex: 'description'
			},
			{id:'imgdelete',
			header:'&nbsp;',
			width: 40,
			renderer:getButtonDelete
			}
		],
	stripeRows	: true,
	tbar		:[{xtype:'button',text:Localize.add,iconCls: 'ext-add',handler:function(){editGroup(-1,'','','','','','','');}}],
	sm			: new Ext.grid.RowSelectionModel({singleSelect: true}),
	height		:400,
	width		:800
});
//end grid of user groups

//Function getButtonEdit
function getButtonEdit(val, x, store){

var groupid=store.data.groupid;
var name=escape(store.data.name);
var description=escape(store.data.description);
var promisemax=store.data.promisemax;
var promisemin=store.data.promisemin;
var promiseallow=store.data.promiseallow;
var promiserent=store.data.promiserent;
var promisetill=store.data.promisetill;
var promiselimit=store.data.promiselimit;
var promiseblockdays=store.data.promiseblockdays;
var promiseondays=store.data.promiseondays;
var blockamount=store.data.blockamount;
var blockdurationdebtor=store.data.blockdurationdebtor;
var blockdurationdenouncement=store.data.blockdurationdenouncement;

var fread=store.data.fread;
var fwrite=store.data.fwrite;

return '<button onclick="editGroup(\''+groupid+'\',\''+name+'\',\''+description+'\',\''+promiseallow+'\',\''+promisemax+'\',\''+promisemin+'\',\''+promiserent+'\',\''+promisetill+'\',\''+promiselimit+'\',\''+blockamount+'\',\''+blockdurationdebtor+'\',\''+blockdurationdenouncement+'\',\''+promiseblockdays+'\',\''+promiseondays+'\')"><img style="vertical-align: top" height="15" src="images/edit16.gif" /></button>';}
//End Function getButtonEdit

//Function getButtonDelete
function getButtonDelete(val, x, store){
var groupid=store.data.groupid;

return   '<button onclick="deleteGroup(\''+groupid+'\')"><img style="vertical-align: top" height="15" src="images/delete.gif" />&nbsp;</button>';
}
//End Function getButtonDelete

});//End Ext.onReady()





//Begin function editGroup

function editGroup(groupid,name,description,promiseallow,promisemax,promisemin,promiserent,promisetill,promiselimit,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays){
var checkpromiserent=parseInt(promiserent);
var checkpromiseallow=parseInt(promiseallow);


var groupsList=Ext.getCmp('groupsList');
groupsList.hide();//hide grid of groupsList


var fields=[ {name:'uid',type:'int'},{name:'name',type:'string'},{name:'showuser',type:'string'}];

var  firstGridStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, first: 1, groupid: groupid,limit:100,start:0},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[ {name:'uid',type:'int'},
			{name:'name',type:'string'}
		]),
		autoLoad:true

	});

var  secondGridStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, second: 1, groupid: groupid,limit:100,start:0},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[ {name:'uid',type:'int'},
			{name:'name',type:'string'}
		]),
		autoLoad:true
	});

var cols=[{id:'uid',header:'ID',width: 40,dataIndex: 'uid'},
		  {id:'name',header:Localize.name,width: 210,sortable: true,dataIndex: 'name'}
		 ];

/*
 * firstGrid of user groups
 */
var firstGrid = new Ext.grid.GridPanel({
	id			:'firstgrid',
	title		:Localize.groupStructure,
	ddGroup     : 'secondGridDDGroup',
	enableDragDrop   : true,
	store		: firstGridStore,
	loadMask 	: {msg: 'Loading Data...'},
	border		: false,
	columns		: cols,
	stripeRows	: true,
	autoExpandColumn : 'name',
	tbar		:[{xtype:'button',text:Localize.ApplyFilter,iconCls: 'ext-search',handler:function(){reloadGrid(firstGrid,groupid);}}],
	bbar		:new Ext.PagingToolbar({pageSize:100,store:firstGridStore,displayInfo: true}),
	height		:350,
	width		:500
});
//end firstGrid


var secondGrid = new Ext.grid.GridPanel({
	id			:'secondgrid',
	title		:Localize.accesibleInGroup,
	ddGroup     : 'firstGridDDGroup',
	enableDragDrop   : true,
	store		: secondGridStore,
	loadMask 	: {msg: 'Loading Data...'},
	border		: false,
	columns		: cols,
	stripeRows	: true,
	autoExpandColumn : 'name',
	tbar		: [{xtype:'button',text:Localize.ApplyFilter,iconCls: 'ext-search',handler:function(){reloadGrid(secondGrid,groupid);}}],
	bbar		: new Ext.PagingToolbar({pageSize:100,store:secondGridStore,displayInfo: true}),
	height		: 350,
	width		: 500
});
//end secondGrid

var filter = new Ext.Toolbar({
		items: ['<b>&nbsp;<font color=#464646>'+ Localize.FilterOfRecords+'</font></b>&nbsp;&nbsp;&nbsp;&nbsp;'+Localize.AdvancedSearch+': ',
		{
			xtype	: 'container',
			autoEl	: 'div',
			id		: 'advSrcCont1',
			width	: 450,
			height	:24,
			layout	: 'column',
			fieldLabel:Localize.AdvancedSearch,
			items	: [
				{
				width	: 205,
				xtype	: 'container',
				autoEl	: 'div',
				items	:
				   {
					xtype		: 'combo',
					width		: 200,
					id			: 'advSearchList1',
					displayField: 'tplname',
					valueField	: 'tplname',
					typeAhead	: true,
					mode		: 'local',
					lazyRender	: true,
					triggerAction: 'all',
					editable	: true,
					store		: new Ext.data.ArrayStore({
									fields: [{ name: 'tplname', type: 'string' }],
									data: []
								}),
					mainStore	: new Ext.data.Store({
									proxy: new Ext.data.HttpProxy({
										url: 'config.php',
										method: 'POST'
									}),
								reader: new Ext.data.JsonReader({
								root: 'results'
								}, [
								{ name: 'tplname', type: 'string' },
								{ name: 'property', type: 'string' },
								{ name: 'condition', type: 'string' },
								{ name: 'date', type: 'date', dateFormat: 'd-m-Y' },
								{ name: 'value', type: 'string' },
								{ name: 'logic', type: 'string' }
								]),
								baseParams: {async_call: 1,	devision: 42,getallsearchtpl: ''},
								autoLoad: true,
								listeners: {
									add: function(s,r,i){
										var C = Ext.getCmp('advSearchList1');
										Ext.each(r, function(A){
											if(this.store.find('tplname', A.data.tplname) < 0) {
												this.store.add(A);
											}
										}, { store: C.store, mainStore: C.mainStore });
									},
								load: function(s,r,i){
									s.events.add.listeners[0].fn(s, r, i);
								},
								remove: function(s,r,i){
									var C = Ext.getCmp('advSearchList1');
									var f = C.store.find('tplsname', r.data.tplname);
									if(f > -1) {
										C.store.remove(C.store.getAt(f));
									}
								}
							}
						})
					  }
					}, {
						xtype		: 'container',
						autoEl		: 'div',
						width		: 210,
						items		:
							{
								xtype: 'button',
								text:Localize.Change + '&nbsp;' + Localize.rules + ' / ' + Localize.Create + '&nbsp;' + Localize.rules,
								handler: function(){
								fn = function(A){
									var C = Ext.getCmp('advSearchList1');
									C.mainStore.each(function(r){
										if(r.data.tplname == this.tplname) {
											this.store.remove(r);
										}
									}, { store: C.mainStore, tplname: A.tplname});
									if(A.data.length > 0) {
										Ext.each(A.data, function(A){
											this.add(new this.recordType(A))
										}, C.mainStore);
										if(!Ext.isEmpty(A.data[0].tplname)) {
											C.setValue(A.data[0].tplname);
										}
									}
									else {
										var i = C.store.find('tplname', A.tplname);
										if(i > -1) {
											C.store.remove(C.store.getAt(i));
										}
										C.setValue('');
									}
								};
								var C = Ext.getCmp('advSearchList1');
								var rules = [];
								C.mainStore.each(function(R){
									if(this.tplname == R.data.tplname){
										this.rules.push(R.data);
									}
								}, { rules: rules, tplname: C.getValue() });
								new SearchTemplate.show({
									tplname: C.getValue(),
									onsearch: fn,
									onsave: fn,
									onSaveClose: true,
									rules: rules
								})
							}
						}
					}]
				}]
	});
//Begin of displayPanel
var displayPanel = new Ext.Panel({
		id			 :'displayPanel',
		width        : 1000,
		border		 : false,
		height       : 320,
		layout       : 'hbox',
		tbar		 : filter,
		defaults     : { flex : 1 }, //auto stretch
		layoutConfig : { align : 'stretch' },
		items        : [
						firstGrid,
						secondGrid
					   ]
	});
//End of displayPanel

var formTop=new Ext.form.FormPanel ({
	id			:'formtop',
	//bbar		:[Localize.GroupCreation],
	labelWidth	:100,
	border		:false,
	width		:1000,
	bodyStyle:'padding:5px 5px 5px 5px;background-color:#EAEAEA',
	items: [{
            layout:'column',
			bodyStyle:'padding:5px 5px 5px 5px;',
            items:[{
                columnWidth:.5,
                layout: 'form',
				border:false,
                items: [{
                    xtype:'textfield',
					id:'groupname',
                    fieldLabel: Localize.groupName,
					allowBlank:false,
					value:unescape(name),
                    name: 'first',
                    anchor:'95%'
                }]
            },{
                columnWidth:.5,
                layout: 'form',
				border:false,
                items: [{
                    xtype:'textarea',
					id:'groupdescription',
                    fieldLabel: Localize.groupDescription,
					value:unescape(description),
                    name: 'last',
					height:35,
                    anchor:'95%'
                }]
            }]
			}]

});
var formBottom=new Ext.form.FormPanel ({
	id			:'formbottom',
	title		:Localize.promisedPayments,
	labelWidth	:200,
	border		:false,
	width		:1000,
	bodyStyle	:'padding:5px 5px 5px  5px;background-color:#EAEAEA',


		items: [{
            layout:'column',
			bodyStyle:'padding:5px 5px 5px  5px;margin:1px;',
            items:[{
                columnWidth:.5,
                layout: 'form',
				border:false,
                items: [{
                    xtype:'checkbox',
					id:'promiseallow',
                    fieldLabel: Localize.IncludePromised,
					checked:checkpromiseallow,
					value:checkpromiseallow,
                    anchor:'75%'
                },{
                    xtype:'textfield',
					id:'promisemax',
                    fieldLabel: Localize.maxSum,
					value:promisemax,
					vtype:'alphanum',
                    anchor:'75%'
                },{
                    xtype:'textfield',
					id:'promisemin',
                    fieldLabel: Localize.minSum,
					value:promisemin,
                    anchor:'75%'
                },{
                    xtype:'numberfield',
					id:'promiseondays',
					allowDecimal: false,
                    fieldLabel: Ext.app.Localize.get("For agreements with lifetime (days)"),
					value:promiseondays,
					decimalPrecision:0,
                    anchor:'75%',
                    listeners: {
	                    render: function(G){
							if(G.value== undefined || G.value=='')
								G.value=30;
	                    }
	                }
                }]
            },{
                columnWidth:.5,
                layout: 'form',
				border:false,
                items: [{
                    xtype:'checkbox',
					id:'promiserent',
                    fieldLabel: Localize.noMore,
					checked:checkpromiserent,
					value:checkpromiserent,
                    anchor:'75%'
                },{
                    xtype:'textfield',
					id:'promiselimit',
                    fieldLabel: Localize.admDebts,
					value:promiselimit,
                    anchor:'75%'
                },{
                    xtype:'textfield',
					id:'promisetill',
                    fieldLabel: Localize.currentCancel,
					value:promisetill,
                    anchor:'75%'
                },{
                    xtype:'numberfield',
					id:'promiseblockdays',
					allowDecimal: false,
                    fieldLabel: Ext.app.Localize.get("Block in case to delay payment (days)"),
					value:promiseblockdays,
					decimalPrecision:0,
                    anchor:'75%',
                    listeners: {
	                    render: function(G){
							if(G.value== undefined || G.value=='')
								G.value=90;
	                    }
	                }
                }]
            }]

	}]
});



var formDuration=new Ext.form.FormPanel ({
	id			:'formduration',
	title		: Ext.app.Localize.get("Delayed lock"),
	hidden: true,
	labelWidth	:300,
	border		:false,
	width		:1000,
	bodyStyle	:'padding:5px 5px 5px  5px;background-color:#EAEAEA',


		items: [{
            layout:'column',
			bodyStyle:'padding:5px 5px 5px  5px;margin:1px;',
            items:[
				{
						columnWidth:.5,
						layout: 'form',
						border:false,
						items: [
						{
							xtype:'textfield',
							id:'blockamount',
                            fieldLabel: Ext.app.Localize.get('Threshold of sum of total debt'),
                            maskRe: new RegExp("[0-9]"),
							vtype:'alphanum',
                            value: blockamount
						},{
							xtype:'textfield',
							id:'blockdurationdebtor',
							fieldLabel: Ext.app.Localize.get('The period of being in debt') + ' "' + Ext.app.Localize.get('Debtor') + '"' + Ext.app.Localize.get('l_days'),
                            maskRe: new RegExp("[0-9]"),
							value: blockdurationdebtor
						},{
							xtype:'textfield',
							id:'blockdurationdenouncement',
							fieldLabel: Localize.minSum,
							fieldLabel: Ext.app.Localize.get('The period of being in debt') + ' "' + Ext.app.Localize.get('On termination') + '"' + Ext.app.Localize.get('l_days'),
                            maskRe: new RegExp("[0-9]"),
							value: blockdurationdenouncement
						}]
				}
			]

	}]
});



var mainPanel = new Ext.Panel({
		id			 :'mainPanel',
		title		 :Localize.ugroupModification,
		width        : 1000,
		autoHeight   : true,
		border		 : false,
		renderTo     : 'panel',
		defaults     : { flex : 1 }, //auto stretch
		layoutConfig : { align : 'stretch' },
		tbar		:[{xtype:'button',text:Localize.toGroupsList,iconCls: 'ext-levelup',
				   	handler: function (){
				   	var dPanel=Ext.getCmp('mainPanel');
					dPanel.destroy();//hide panel
					var gl=Ext.getCmp('groupsList');

					gl.show();//show grid of groupsList
					gl.store.reload();

				   }
				  },
				  {xtype:'tbseparator'},
				  {xtype:'button',text:Localize.Save,iconCls: 'ext-save',
				   	handler: function(){
						if (groupid == -1) {
							Ext.getCmp('headtoolbar').hide();
						}
						Ext.MessageBox.show({
          				msg: Localize.InProgress,
         				//progressText: Localize.InProgress,
          				width:300,
           				wait:true,
          			 	waitConfig: {interval:200}
      				 });
        				setTimeout(function(){
            				Ext.MessageBox.hide();
        				}, 1000);
						var groupname=Ext.get('groupname').getValue();
						var description=Ext.get('groupdescription').getValue();
						var promisemax=Ext.get('promisemax').getValue();
						var promiserent=Ext.getCmp('promiserent').getValue();
						if (promiserent) promiserent=1; else promiserent=0;
						var promiseallow=Ext.getCmp('promiseallow').getValue();
						if (promiseallow) promiseallow=1; else promiseallow=0;

						var promisemin=Ext.get('promisemin').getValue();
						var promiselimit=Ext.get('promiselimit').getValue();
						var promisetill=Ext.get('promisetill').getValue();

                        var blockamount=Ext.get('blockamount').getValue();
                        var blockdurationdebtor=Ext.get('blockdurationdebtor').getValue();
                        var blockdurationdenouncement=Ext.get('blockdurationdenouncement').getValue();
                        
                        var promiseblockdays=Ext.get('promiseblockdays').getValue();
                        var promiseondays=Ext.get('promiseondays').getValue();

						if (groupid == -1) {
							createGroup(groupname,description,promiseallow,promisemax,promiserent,promisemin,promiselimit,promisetill,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays);

						}
						else saveGroup(groupid,groupname,description,promiseallow,promisemax,promiserent,promisemin,promiselimit,promisetill,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays);
					}
				  }
				 ],
		items        : [
						formTop,
						displayPanel,
						formBottom,
						formDuration
					   ]
	});


//used to add records to the destination stores
	if (groupid==-1) {Ext.getCmp('displayPanel').disable();
					  var tbar = new Ext.Toolbar({
            				id:         'headtoolbar',
           					items: ['<font color=red>'+Localize.GroupCreation+'</font>']
       				  });
					  Ext.getCmp('formtop').add(tbar);
					  Ext.getCmp('formtop').doLayout();
					  }
	if (groupid==0) {Ext.getCmp('secondgrid').disable();}

	if (groupid != 0) {
		var blankRecord = Ext.data.Record.create(fields);
		var firstGridDropTargetEl = firstGrid.getView().scroller.dom;
		var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
			ddGroup: 'firstGridDDGroup',
			notifyDrop: function(ddSource, e, data){

				var records = ddSource.dragData.selections;
				Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);

				firstGrid.store.add(records);
				firstGrid.store.sort('name', 'ASC');
				var uids='';
				Ext.each(records,function(r){
					uid=r.data.uid;
					uids=uids+uid+',';

				});

				var strLen = uids.length;
				uids = uids.slice(0,strLen-1);
				addToGroup(uids,groupid);
				return true;
			}
		});


		// This will make sure we only drop to the view scroller element
		var secondGridDropTargetEl = secondGrid.getView().scroller.dom;
		var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
			ddGroup: 'secondGridDDGroup',
			notifyDrop: function(ddSource, e, data){
				var records = ddSource.dragData.selections;
				Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
				secondGrid.store.add(records);
				secondGrid.store.sort('name', 'ASC');
				var uids='';
				Ext.each(records,function(r){
					uid=r.data.uid;
					uids=uids+uid+',';

				});

				var strLen = uids.length;
				uids = uids.slice(0,strLen-1);
				deleteFromGroup(uids,groupid);
				return true;
			}
		});
	}

}//end function editGroup



//function reloadGrid()
function reloadGrid(grid,groupid){

if (grid.id=='firstgrid')  var p =	{async_call: 1, devision: 23, first: 1, groupid: groupid,limit:100,start:0};
if (grid.id=='secondgrid') var p =	{async_call: 1, devision: 23, second: 1, groupid: groupid,limit:100,start:0};


	var advSearch = function(p){
		var c = Ext.getCmp('advSearchList1');
		var n = new RegExp('searchtpl','i');
		var p = p || {};

		if(c.mainStore.find('tplname', c.getValue()) > -1) {
			c.mainStore.each(function(r,idx){
				if(r.data.tplname != this.tplname) {
					return;
				}
				for(var i in r.data) {
					if(i == 'tplname') {
						continue;
					}
					this.params['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
				}
			}, { params: p, tplname: c.getValue() });
		}

		return p;
	}

var p = advSearch(p);

grid.store.baseParams=p;
grid.store.baseParams.start=0;
grid.store.load();
}
//end function reloadGrid()

//function createGroup()
function createGroup(groupname,description,promiseallow,promisemax,promiserent,promisemin,promiselimit,promisetill,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays){

Ext.Ajax.request({
		   url: 'config.php',
		   success: function(resp,opt){
		   			groupid=Ext.util.JSON.decode(resp.responseText);
					dp=Ext.getCmp('displayPanel');
					dp.enable();
					var dPanel=Ext.getCmp('mainPanel');
					dPanel.destroy();//hide panel
					editGroup(groupid,groupname,description,promiseallow,promisemax,promisemin,promiserent,promisetill,promiselimit,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays);
				},
		   failure: function(){},
		   method:'POST',
		   params: { async_call: 1, devision: 23, creategroup: 1,groupname:groupname,description:description,promiseallow:promiseallow,promisemax:promisemax,promiserent:promiserent,promisemin:promisemin,promiselimit:promiselimit,promisetill:promisetill,blockamount:blockamount,blockdurationdebtor:blockdurationdebtor,blockdurationdenouncement:blockdurationdenouncement, promiseblockdays:promiseblockdays, promiseondays:promiseondays}
		});
}
//end function createGroup()

//function deleteGroup()
function deleteGroup(groupid){
	Ext.MessageBox.confirm(Localize.Confirm, Localize.Remove+'?',
						function(btn){
							if (btn=='yes'){
								var  deleteGroup = new Ext.data.Store({
								proxy: new Ext.data.HttpProxy({
								url: 'config.php',
								method: 'POST'
								}),
								baseParams:{async_call: 1, devision: 23, deletegroup: 1,groupid:groupid},
								reader: new Ext.data.JsonReader({
								root: 'results',
								totalProperty:'total'
								},[ ])
								});
								deleteGroup.load({
								callback: function(){
								storeGroups.load();
				 			 	}
							 });
							}
	});

}
//end function deleteGroup()


//function addToGroup()
function addToGroup(uids,groupid){
	var totaluids=uids.length;
	var  updateSecond = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, adduids:1, groupid:groupid, uids: uids},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[ ])
	});
	updateSecond.load();
}
//function deleteFromGroup()
function deleteFromGroup(uids,groupid){
	var totaluids=uids.length;
	var  updateSecond = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, deleteuids:1, groupid:groupid, uids: uids},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[ ])
	});
	updateSecond.load();
}
//function saveGroup()
function saveGroup(groupid,groupname,description,promiseallow,promisemax,promiserent,promisemin,promiselimit,promisetill,blockamount,blockdurationdebtor,blockdurationdenouncement, promiseblockdays, promiseondays){	
	var  createGroup = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 23, savegroup: 1,groupid:groupid,groupname:groupname,description:description,promiseallow:promiseallow,promisemax:promisemax,promiserent:promiserent,promisemin:promisemin,promiselimit:promiselimit,promisetill:promisetill,blockamount:blockamount,blockdurationdebtor:blockdurationdebtor,blockdurationdenouncement:blockdurationdenouncement, promiseblockdays:promiseblockdays, promiseondays:promiseondays},
		reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty:'total'
		},[ ]),
		autoLoad:true
	});
}
</script>

<table align="center">
 <tr>
    <td><div id="list_groups"></div><div id="panel"></div>
	</td>
  </tr>
</table>
