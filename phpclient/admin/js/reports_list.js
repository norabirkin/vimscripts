var num_files=0;//for create unique name additional file

var resetflag=0;
var fiadditional=new Array();
var storeReports ;
var storeStandartReports;
var user_reports;
var networkagent_id=0;

var usergroup_id=0;
var include_group=1;
var reportfilter_id=new Array();
var compare_name=new Array();
var show_in='win';
var grid;
var checkColumn = new Ext.grid.CheckColumn({
			id:'flag',
			header: '&nbsp;',
			width: 20,
			sortable: true,
			dataIndex: 'delid'
	});

var storeAgents = new Ext.data.Store({
    id: 'agents',
    proxy: new Ext.data.HttpProxy({
        url: 'config.php',
        method: 'POST'
    }),
    baseParams:{
        async_call: 1,
        devision: 107,
        getagents: 1
    },
    reader: new Ext.data.JsonReader(
        {root: 'results'},
        [
            {name:'id',type:'int'},
            {name:'name',type:'string'}
        ]
    ),
    autoLoad:true
});

var storeGroups = new Ext.data.Store({
    id: 'groups',
    proxy: new Ext.data.HttpProxy({
        url: 'config.php',
        method: 'POST'
    }),
    baseParams:{
        async_call: 1,
        devision: 107,
        getgroups: 1
    },
    reader: new Ext.data.JsonReader(
        {root: 'results'},
        [
            {name:'groupid',type:'int'},
            {name:'name',type:'string'}
        ]
    ),
    autoLoad:true
});


var comboFilter = [
	 ['1', '1. '+ Ext.app.Localize.get('Account login')],
	 ['2', '2. '+ Ext.app.Localize.get('Describe of accounts')],
	 ['3', '3. '+ Ext.app.Localize.get('Name of user')],
	 ['4', '4. '+ Ext.app.Localize.get('Agreement number')],
	 ['5', '5. '+ Ext.app.Localize.get('Appropriate IP')],
	 ['6', '6. '+ Ext.app.Localize.get('Appropriate phone number')],
	 ['7', '7. '+ Ext.app.Localize.get('1C code')],
	 ['8', '8. '+ Ext.app.Localize.get('Balance')]
];

var showReportIn=[
    ['win', Ext.app.Localize.get('New window')],
    ['exl', Ext.app.Localize.get('Excel')]
];

var time= new Date();
var selectedYear=time.format("Y");
var collapsed=true;
//End List of  vars


//------------------------------------------------------------------------------
Ext.onReady(function(){
Ext.QuickTips.init();


var tabs = new Ext.TabPanel({
	plain: true,
	enableTabScroll: true,
	frame:true,
    renderTo: 'my-tab',
	width: 960,
	height:475,
    activeTab: 0,
	layoutOnTabChange: true,
	deferredRender:true,
    items:[
        {
            contentEl:'standartReport',
            title: Ext.app.Localize.get('Standart reports'),
            id:'tab2',
			layout: 'fit',
			viewConfig: {forceFit: true}
        },
        {
            contentEl:'selfReports',
            title: Ext.app.Localize.get('Self reports'),
            id:'tab1',
			layout: 'fit',
			viewConfig: {forceFit: true}
        }
    ]
});


createFormOfReports();
createGridOfReports();
createGridOfStandartReports();
/*
gridstandartreports.on('mouseover', function(e,t)    {
var idx = grid.getView().findRowIndex(e.target);
var row = this.getStore().getAt(idx);

var rowID = row.id;

}); */

	tabs.getItem('tab1').on('activate', function(){
		var form = Ext.getCmp('formid');
		collapsed = false;
		form.destroy();
		createFormOfReports();
		grid.destroy();
		createGridOfReports();
	});


	tabs.getItem('tab2').on('activate', function(){
		var form = Ext.getCmp('formid');
		collapsed = true;
		form.destroy();
		createFormOfReports();
	});

});

//------------------------------------------------------------------------------------
// Begin of Function createFormOfReports()
function createFormOfReports(){
    var numfs;
    var time = new Date();
    var max_date;
    var rf;

    numfs = num_files;

    addAdditionalFile(numfs);
    max_date_begin=time.format("Y-m-d");
    time.setDate(time.getDate() + 1);
    max_date_end=time.format("Y-m-d");

    rf = (resetflag == 1) ? false : true;

    //Create Form Panel
    user_reports = new Ext.FormPanel({
        id:'formid',
        url: 'config.php',
        baseParams:{async_call: 1, devision: 107, insupd: 1,reportid: 0},
        fileUpload: true,
        renderTo:'fi-basic',
        bodyStyle:'padding:15px 0px 0',
        collapsible:true,
        animCollapse:false,
        titleCollapse:true,
        //collapsed:true,
        frame: true,
        title:'<div id="formheader">'+ Ext.app.Localize.get('Users reports')+'</div>',
        labelWidth: 170,
        width: 960,
		//layout:'fit',
		//viewConfig: {forceFit: true},
        listeners: {
            beforedestroy: function(){
                Ext.getCmp('advSrcCont').destroy();
            }
        },
        items: [{
                xtype:'fieldset',
                id:'fieldset',
                checkboxToggle:true,
                title: Ext.app.Localize.get('Create user reports'),
                //autoHeight:true,
                defaultType: 'textfield',
                buttonAlign:'center',
                collapsed:rf,
                items:[
                    { xtype: 'container', autoEl: 'div', layout: 'fit', width: 300, html: '&nbsp;' } ,
                    {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Name of user report'),
                    width:450,
                    allowBlank:false,
                    hidden:false,
                    name: 'reportname'
                    },
                    {
                    xtype: 'textarea',
                    layout:'form',
                    fieldLabel: Ext.app.Localize.get('Description of user report'),
                    width:450,
                    allowBlank:false,
                    name:'reportdesc'
                    },
                    {
                    xtype:'fileuploadfield',
                    //layout:'form',
                    id:'mainfile',
                    allowBlank:false,
                    name: 'mainfile',
                    readOnly:true,
                    fieldLabel: Ext.app.Localize.get('Main file of user report'),
                    anchor:'90%',
                    emptyText: Ext.app.Localize.get('Select main file'),
                    buttonCfg: {
                        text: Ext.app.Localize.get('Upload')
                    }
                    },
                    fiadditional[numfs]
                ],
                buttons:[
                    {
                    text: Ext.app.Localize.get('Save'),
                    handler: function (){
                        user_reports.getForm().submit({
                            success: function(f,a){
                                grid.destroy();
                                createGridOfReports();
                                user_reports.destroy();
                                num_files=0;
                                createFormOfReports();
                            },
                            failure: function(f,a){
                                Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Set permissions for ./admin/users_reports'));
                                }
                        });
                    }
                    },
                    {
                    text: Ext.app.Localize.get('Reset'),
                    handler:function (){
                    resetflag=1;
                    user_reports.destroy();
                    num_files=0;
                    createFormOfReports();
                    }
                }
                ]
            },
            {
            xtype:'fieldset',
            id:'filter',
            checkboxToggle:true,
            title: Ext.app.Localize.get('Additional filter'),
            autoHeight:true,
            buttonAlign:'center',
            collapsed: collapsed,
                items:[
                    { xtype: 'container', autoEl: 'div', layout: 'fit', width: 300, html: '&nbsp;' } ,
                    {
                    xtype: 'datefield',
                    id:'start_of_period',
                    format:'d-m-Y',
                    fieldLabel: Ext.app.Localize.get('Begin of period'),
                    maxValue: max_date_begin,
                    width:250,
                    allowBlank:true,
                    name:'beginofperiod',
                    validator: function (){
                        ep=Ext.getCmp('end_of_period').getValue();
                        if (!ep) return true;
                        sp=this.getValue();
                        if (sp > ep) {
                            Ext.Msg.alert('',Ext.app.Localize.get('Wrong date interval'));
                            return false;
                        }
                        return true;
                        }
                    },
                    {
                    xtype: 'datefield',
                    id:'end_of_period',
                    format:'d-m-Y',
                    maxValue: max_date_end,
                    fieldLabel: Ext.app.Localize.get('End of period'),
                    width:250,
                    allowBlank:true,
                    name:'endofperiod',
                    validator: function (){
                        sp=Ext.getCmp('start_of_period').getValue();
                        ep=this.getValue();
                        if (sp > ep) {
                            Ext.Msg.alert('', Ext.app.Localize.get('Wrong date interval'));
                            return false;
                        }
                        return true;
                        }
                    },
                    {
                    xtype: 'combo',
                    id:	'networkagent',
                    fieldLabel: Ext.app.Localize.get('Network agent'),
                    width:450,
                    allowBlank:true,
                    name:'networkagent',
                    displayField: 'name',
                    store: storeAgents,
                    triggerAction:'all',
                        listeners: {
                            select: function (f,r,i){
                            data=this.store.data.items[i].data['name'];
                            networkagent_id=this.store.data.items[i].data['id'];
                            }
                        }
                    },  
                    {
                    xtype: 'combo',
                    id: 'usergroup',
                    fieldLabel: Ext.app.Localize.get('User group'),
                    width:450,
                    allowBlank:true,
                    name:'groupofusers',
                    displayField: 'name',
                    store: storeGroups,
                    triggerAction:'all',
                        listeners: {
                            select: function (f,r,i){
                            data=this.store.data.items[i].data['name'];
                            usergroup_id=this.store.data.items[i].data['groupid'];
                            }
                        }
                    },
                    {
                    xtype: 'combo',
                    id:	'openreportin',
                    fieldLabel: Ext.app.Localize.get('Open report in'),
                    width:250,
                    allowBlank:true,
                    name:'openreportin',
                    valueField: 'id',
                    displayField:'name',
                    store: new Ext.data.SimpleStore({
                             fields:['id', 'name'],
                             data:showReportIn
                        }),
                    triggerAction:'all',
                    mode:'local',
                    listeners: {
                            select: function (f,r,i){
                            show_in=this.store.data.items[i].data['id'];
                            }
                        }
                    }, {
                        xtype: 'container',
                        autoEl: 'div',
                        id: 'advSrcCont',
                        style: 'padding: 0px, marging: 0px',
                        width: 480,
                        layout: 'column',
                        fieldLabel: Ext.app.Localize.get('Advanced search'),
                        items: [{
                            width: 255,
                            height: 26,
                            xtype: 'container',
                            style: 'padding: 0px, marging: 0px',
                            aautoEl: 'div',
                            items: {
                            xtype: 'combo',
                            width: 250,
                            id: 'advSearchList',
                            displayField: 'tplname',
                            valueField: 'tplname',
                            typeAhead: true,
                            mode: 'local',
                            lazyRender: true,
                            triggerAction: 'all',
                            editable: true,
                            store: new Ext.data.ArrayStore({
                                fields: [{ name: 'tplname', type: 'string' }],
                                data: []
                            }),
                            mainStore: new Ext.data.Store({
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
                                baseParams: {
                                    async_call: 1,
                                    devision: 42,
                                    getallsearchtpl: ''
                                },
                                autoLoad: true,
                                listeners: {
                                    add: function(s,r,i){
                                        var C = Ext.getCmp('advSearchList');
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
                                        var C = Ext.getCmp('advSearchList');
                                        var f = C.store.find('tplsname', r.data.tplname);
                                        if(f > -1) {
                                            C.store.remove(C.store.getAt(f));
                                        }
                                    }
                                }
                            })
                        }
                    }, {
                            xtype: 'container',
                            autoEl: 'div',
                            width: 210,
                            items: {
                                xtype: 'button',
                                text: Ext.app.Localize.get('Change') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
                                handler: function(){
                                    fn = function(A){
                                        var C = Ext.getCmp('advSearchList');
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
                                    var C = Ext.getCmp('advSearchList');
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
                    }
                ]
            }
            ]
        });
    //End Form Panel

}


/**
 * Standart reports grid
 */
function createGridOfStandartReports(){

    var max_date = time.format("Y-m-d");

    var storeStandartReports = new Ext.data.Store({
		id: 'getstandartreports',
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams: {
            async_call: 1,
            devision: 107,
            getstandartreports: 1
        },
		reader: new Ext.data.JsonReader({
		root: 'results'
		},[
			{name:'docid',type:'string'},
			{name:'name',type:'string'},
			{name:'doctemplate',type:'string'},
			{name:'action',type:'string'},
            {name:'uploadext',type:'string'},
            {name:'documentperiod',type:'int'},
            {name:'onfly',type:'int'} 
		])
	});
	
	var getExportParams = function(grid, record, i, enqueue) {
		if(Ext.getCmp('openreportin').getValue() == 'exl') {
			record.data.uploadext = 'application/vnd.ms-excel';
		}
        if (record.data.uploadext === 'application/msword'){
            if ( enqueue === undefined ) Ext.getCmp('excel').setValue(true);
        }

        /**
         * Important to declare variable before the using. (IE fix)
         */
        var checkbox_excel = (Ext.getCmp('excel').getValue()) ? 1 : 0;
        var timeperiod = Ext.getCmp('timeperiod').getValue().format("Ymd");
        var timeperiodtill = Ext.getCmp('timeperiodtill').getValue().format("Ymd");
        var selectedday = Ext.getCmp('selectedday').getValue().format("Ymd");
        var selectedmonth = Ext.getCmp('selectedmonth').getValue();
        var selectedmonthyear = Ext.getCmp('selectedmonthyear').getValue();
        
        var f_code = Ext.getCmp('f_code').getValue();
        var f_receipt = Ext.getCmp('f_receipt').getValue();
        var f_category = Ext.getCmp('f_category').getValue();

        var p = {
            async_call: 1,
            devision: 107,
            report: 1,
            checkbox_excel: checkbox_excel,
            download_type: record.data.uploadext,
            doctemplate: record.data.doctemplate,
            documentperiod: record.data.documentperiod, 
            onfly: record.data.onfly,     
            docid: record.data.docid,
            timeperiod: timeperiod,
            timeperiodtill: timeperiodtill,
            selectedday: selectedday,
            selectedmonth: selectedmonth,
            selectedmonthyear: selectedmonthyear,
            usergroupid: usergroup_id,
            f_code: f_code, 
            f_receipt: f_receipt, 
            f_category: f_category,
			include_group: include_group
        };
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
        return p;
	};
	
	var Enqueue = new Ext.grid.RowButton({
        header: '&nbsp;',
        width: 150,
        renderer: function(value, meta, record, row) {
        	var id = 'enq-btn-wrp-' + row;
        	meta.style = 'cursor:pointer';
        	meta.css += (meta.css ? ' ' : '') + 'ext-grid3-row-action-cell'; 
    		return '<div class="enq-btn">' + Ext.app.Localize.get('Enqueue') + '</div>';
    	},
    	iconCls: 'enq-btn'
    });
    
    Enqueue.on('action', function(grid, record, i) {
    	var p = getExportParams(grid, record, i, true);
    	p.enqueueItem = 1;
    	var W = Ext.MessageBox.wait(Ext.app.Localize.get('Connecting'), Ext.app.Localize.get('Sending data'));
    	
    	Ext.Ajax.request({
    		method: 'POST', 
    		timeout:580000, 
    		params: p,
    		url: 'config.php', 
    		success: function(response){ 
    			W.hide();     			
    			try {
                	obj = Ext.util.JSON.decode(response.responseText);
                	if (obj.success == false) {
                    	Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.isEmpty(obj.reason) ? ( Ext.app.Localize.get('Unknown server error') ) : ( Ext.app.Localize.get('Server error') + ': ' + obj.reason));
                	}
                	else Ext.getCmp('QueueGridPanel').getStore().reload();
            	}
            	catch (e) {
                	Ext.Msg.alert( Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown server error') );
            	}
            	
    		}, 
    		failure: function(A){ 
    			W.hide(); 
    			Ext.Msg.alert( Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown server error') );
    		} 
    	});
    	
		return;
    });

    var Export = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Form'),
        width: 22,
        iconCls: function(record){
            switch (record.data.uploadext){
                case 'application/msword': return 'ext-ms-word';
                case 'application/vnd.ms-excel': return 'ext-ms-excel';
                case 'text/html': return 'ext-text';
                default: return 'ext-table';
            }
        }
    });
    Export.on('action', function(grid, record, i) {
		var p = getExportParams(grid, record, i);
		
		if(Ext.isEmpty(record.get("doctemplate"))) {
		
			Ext.Msg.error(Ext.app.Localize.get('Unable to generate document with empty template'));
		}
		else {
			
			var msg = Ext.app.Localize.get('Are you sure you want to generate documents?') + '<br/><br/><b>' + record.data.name + '</b>';
			switch (record.get('documentperiod')) {
				case 0:
					msg+= '</br>' + Ext.app.Localize.get('Period') + ': ' + Ext.getCmp('selectedmonth').getValue() + ' ' + Ext.getCmp('selectedmonthyear').getValue();
					break;
				case 1:
					msg+= '</br>' + Ext.app.Localize.get('Since') + ': ' + Ext.getCmp('timeperiod').getValue().format("d.m.Y") + ' ' + Ext.app.Localize.get('To') + ': ' + Ext.getCmp('timeperiodtill').getValue().format("d.m.Y");
					break;
				case 2:
				default:
					msg+= '</br>' + Ext.app.Localize.get('Date') + ': ' + Ext.getCmp('selectedday').getValue().format("d.m.Y");
			}

	        Ext.MessageBox.show({
	            title: Ext.app.Localize.get('Form') + '&nbsp;' + Ext.app.Localize.get('reports'),
	            msg: msg,
	            width: 420,
	            buttons: Ext.MessageBox.OKCANCEL,
	            multiline: false,
	            fn: function( btn ){
	                if (btn == 'cancel') return;
	                Ext.Ajax.request({
	                    url: 'config.php',
	                    method: 'POST',
	                    timeout:1200000,
	                    params: p,
	                    scope: {
	                        load: Ext.Msg.wait(Ext.app.Localize.get('Wait for complete') + "...",Ext.app.Localize.get('File uploading'), { autoShow: true })
	                    },
	                    callback: function(opt, success, res) {
	                    	var checkbox_excel = (Ext.getCmp('excel').getValue()) ? 1 : 0;
	                        this.load.hide();
	                        if(!success) {
	                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Can\'t generate document!'));
	                            return false;
	                        }
	                        if (Ext.isDefined(res['responseText'])) {
								if (checkbox_excel) {
	                                var data = Ext.util.JSON.decode(res.responseText);
	                                    if ( data.success ){
	                                        p['getreport'] = data.filename;
	                                        Download(p);
	                                    }else{
	                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
	                                    }
	                            } else {
	                                try {
										var data = Ext.util.JSON.decode(res.responseText);
										Ext.Msg.error(data.errors.reason);
									} catch (e) {
										myWin = open("", "", "", menubar = 1, scrollbars = 1);
										myWin.document.open();
										myWin.document.write(res.responseText);
										myWin.document.close();
									}
	                            }
	                        }
	                      return false;
	                    }
	                });
	            }
	        });
			
		}

    });

    // Create the Grid
    var gridstandartreports = new Ext.grid.GridPanel({
        id:'gridstandartreportsid',
        renderTo:'standartReport',
        loadMask: true,
		height: '417',
        stripeRows: true,
		tbar:[{
				xtype: 'container', 
				id: 'timeperiod_cnt',
				hidden: false,
				layout: 'toolbar',
				listeners: {
					afterlayout: function(cnt) {
						cnt.hide();
					}
				},
				items: [
		            { xtype: 'tbspacer', width: 7},
		            {
		                xtype: 'tbtext',
		                text: Ext.app.Localize.get('Since')
		            },
		            { xtype: 'tbspacer', width: 3},
		            {
		                xtype: 'datefield',
		                id: 'timeperiod',
		                format: 'Y-m-d',
		                autoWidth: true,
		                allowBlank: false,
		                readOnly: false,
		                width: 100,
		                value: max_date,
		                maxValue: max_date,
		                maskRe: new RegExp('[0-9\-]')
		            }
		           ]
			},{
				xtype: 'container',
				id: 'timeperiodtill_cnt',
				hidden: false,
				layout: 'toolbar',
				listeners: {
					afterlayout: function(cnt) {
						cnt.hide();
					}
				},
				items: [
		            { xtype: 'tbspacer', width: 7},
		            {
		                xtype: 'tbtext',
		                text: Ext.app.Localize.get('To')
		            },
		            { xtype: 'tbspacer', width: 3},
		            {
		                xtype: 'datefield',
		                id: 'timeperiodtill',
		                format: 'Y-m-d',
		                autoWidth: true,
		                allowBlank: false,
		                readOnly: false,
		                width: 100,
		                value: max_date,
		                //maxValue: max_date,
		                maskRe: new RegExp('[0-9\-]')
		            }
		           ]
			},
			{
            	xtype: 'container', 
                id: 'selectedday_cnt',
                layout: 'toolbar',
                items: [
                        
		            { xtype: 'tbspacer', width: 7},
		            {
		                xtype: 'tbtext',
		                text: Ext.app.Localize.get('Date')
		            },
		            { xtype: 'tbspacer', width: 3},
		            {
		                xtype: 'datefield',
		                id: 'selectedday',
		                format: 'Y-m-d',
		                fieldLabel: Ext.app.Localize.get('Date'),
		                width: 100,
		                value: max_date,
		                maxValue: max_date,
		                maskRe: new RegExp('[0-9\-]'),
		                readOnly: false
		            }
		        ]
			},
            {
            	xtype: 'container', 
                id: 'selectedmonth_cnt',
                hidden: false,
                layout: 'toolbar',
				listeners: {
					afterlayout: function(cnt) {
						cnt.hide();
					}
				},
                items: [
	                { xtype: 'tbspacer', width: 7},  
	                {
	                    xtype: 'tbtext',
	                    text: Ext.app.Localize.get('Period')
	                },
	                { xtype: 'tbspacer', width: 3},
	                {
	    				xtype: 'combo',
	                    fieldLabel: Ext.app.Localize.get('Month'),
	    				id: 'selectedmonth',
	    				width:76,
	    				displayField: 'name',
	    				valueField: 'id',
	    				mode: 'local',
	    				triggerAction: 'all',
	    				editable: false,
	    				triggerClass : 'x-form-date-trigger',
	    				value: new Date().format('m'),
	    				store: new Ext.data.ArrayStore({
	    	                data: [
	    	                    ['01', Ext.app.Localize.get('January')],
	    	                    ['02', Ext.app.Localize.get('February')],
	    	                    ['03', Ext.app.Localize.get('March')],
	    	                    ['04', Ext.app.Localize.get('April')],
	    	                    ['05', Ext.app.Localize.get('May')],
	    	                    ['06', Ext.app.Localize.get('June')],
	    	                    ['07', Ext.app.Localize.get('July')],
	    	                    ['08', Ext.app.Localize.get('August')],
	    	                    ['09', Ext.app.Localize.get('September')],
	    	                    ['10', Ext.app.Localize.get('October')],
	    	                    ['11', Ext.app.Localize.get('November')],
	    	                    ['12', Ext.app.Localize.get('December')]
	    	                ],
	    	                fields: ['id',  'name']
	    	            })
	    			},
	    			{ xtype: 'tbspacer', width: 3},
	                {
	    				xtype: 'combo',
	                    fieldLabel: Ext.app.Localize.get('Month year'),
	    				width:60,
	    				allowBlank:true,
	    				id:'selectedmonthyear',
	    				displayField: 'id',
	    				valueField: 'id',
	    				mode: 'local',
	    				triggerAction: 'all',
	    				value: new Date().format('Y'),
	    				editable: true,
	    				triggerClass : 'x-form-date-trigger',
	    				store: new Ext.data.ArrayStore({
	    	                data: [
	    	                    [new Date().format('Y')],
	    	                    [new Date().format('Y')-1],
	    	                    [new Date().format('Y')-2],
	    	                    [new Date().format('Y')-3],
	    	                    [new Date().format('Y')-4],
	    	                    [new Date().format('Y')-5],
	    	                    [new Date().format('Y')-6],
	    	                    [new Date().format('Y')-7],
	    	                    [new Date().format('Y')-8],
	    	                    [new Date().format('Y')-9],
	    	                    [new Date().format('Y')-10],
	    	                    [new Date().format('Y')-11],
	    	                    [new Date().format('Y')-12]
	    	                ],
	    	                fields: ['id']
	    	            })
	    			},
	    			{
	                    xtype: 'tbtext',
	                    text: Ext.app.Localize.get('short_year')
	                }
            	]
            },
            '->',
            {
                xtype: 'tbtext',
                text: Ext.app.Localize.get('User group')
            },
            { xtype: 'tbspacer', width: 3},
            {
				xtype: 'combo',
				id: 'include_group',
				width:150,
				allowBlank:true,
				name:'include_group',
				triggerAction:'all',
				mode: 'local',
				editable: false,
				store: new Ext.data.SimpleStore({
                    data: [
                        ['1', Ext.app.Localize.get('Include')],
                        ['2', Ext.app.Localize.get('Exclude')]
                    ],
                    fields: ['id', 'name']
                }),
                valueField: 'id',
				displayField: 'name',
					listeners: {
						select: function (f,r,i){
                            include_group=r.data.id;
						}
					}
            },
            { xtype: 'tbspacer', width: 3},
            {
				xtype: 'combo',
                fieldLabel: Ext.app.Localize.get('User group'),
				id: 'usergroup1',
				width:150,
				allowBlank:true,
				name:'groupofusers1',
				displayField: 'name',
				store: storeGroups,
				triggerAction:'all',
					listeners: {
						select: function (f,r,i){
                            usergroup_id=this.store.data.items[i].data['groupid'];
                            
                            var includeTrigger = this.ownerCt.find('name', 'include_group')[0];
                            if(Ext.isEmpty(includeTrigger.getValue())){
                            	includeTrigger.setValue(1);
                            }
						}
					}
			},
			{ xtype: 'tbspacer', width: 7},
			{
				xtype: 'hidden',
				id: 'f_category',
				value: '-1'
			},{
				xtype: 'hidden', 
				id: 'f_receipt',
				value: ''
			},{
				xtype: 'hidden',
				id: 'f_code',
				value: ''
			},
			{
                xtype: 'button', 
                id: 'additional_flt_btn',
                hidden: true, 
                iconCls: 'ext-filter',
                text: Ext.app.Localize.get('Additonal filters'),
            	handler: function(){
            		
            		    new Ext.Window({
            		        modal: true,
            		        width: 450,
            		        title: Ext.app.Localize.get('Additonal filters'),
            		        layout: 'fit',
            		        height: 170,
            		        items: [{
            		            xtype: 'form',
            		            monitorValid: true,
            		            frame: true,
            		            url: 'config.php',
            		            labelWidth: 160,
            		            defaults: {
            		                xtype: 'hidden',
            		                anchor: '100%'
            		            },
            		            items: [    
								{
								    xtype: 'combo',
								    id: 'payment_category',
								    fieldLabel: Ext.app.Localize.get('Class of payment'),
								    width: 190,
								    displayField: 'classname',
								    valueField: 'classid',
								    name: 'f_category',
								    typeAhead: true,
								    mode: 'local',
								    triggerAction: 'all',
								    editable: false,
								    value: -1,
								    store: new Ext.data.Store({
								        proxy: new Ext.data.HttpProxy({
								            url: 'config.php',
								            method: 'POST'
								        }),
								        reader: new Ext.data.JsonReader(
								            { root: 'results' },
								            [
								                { name: 'classid', type: 'int' }, 
												{ name: 'classname', type: 'string' }, 
												{ name: 'descr', type: 'string' }
								            ]
								        ),
								        autoLoad: true,
								        baseParams: {
								            async_call: 1, 
											devision: 331,
											getpayclass: 0
								        },
								        listeners: {
								            load: function(store) {
								            	store.insert(0, new store.recordType({
            		     							classid: -1,
            		     							classname: Ext.app.Localize.get('All')
	            		   						}));
								            	
								            	Ext.getCmp('payment_category').setValue(Ext.getCmp('payment_category').getValue());
								            }
								        }
								    })
								},         
        
            		            {
            		                xtype: 'textfield',
            		                fieldLabel: Ext.app.Localize.get('Pay document number'),
            		                name: 'f_receipt'
            		            }, {
            		                xtype: 'textfield',
            		                fieldLabel: Ext.app.Localize.get('Payment type'),
            		                name: 'f_code'
            		            }],
            		            buttonAlign: 'center',
            		            buttons: [{
            		                xtype: 'button',
            		                bindForm: true,
            		                text: Ext.app.Localize.get('Save'),
            		                handler: function(Btn) {
            		                	
            		                	var form = Btn.findParentByType('form').getForm();
            		                	
            		                	Ext.getCmp('f_code').setValue(form.findField('f_code').getValue());
                    		    		Ext.getCmp('f_receipt').setValue(form.findField('f_receipt').getValue());
                    		    		Ext.getCmp('f_category').setValue(form.findField('f_category').getValue());
                    		    		
                    		    		Btn.findParentByType('window').close();

            		                }
            		            }]
            		        }]
            		    }).show(null, function(win) {
            		    	var form = win.get(0).getForm(); 
            		    	
            		    	form.setValues({
            		    		f_code: Ext.getCmp('f_code').getValue(),
            		    		f_receipt: Ext.getCmp('f_receipt').getValue(),
            		    		f_category: Ext.getCmp('f_category').getValue()
            		    	});
            		    });
            	}
     		},
            { xtype: 'tbspacer', width: 7}
        ],
        view: new Ext.grid.GridView({
            forceFit:false,
            enableRowBody:true,
            enableNoGroups: false,
            deferEmptyText: false,
            emptyText: Ext.app.Localize.get('There is no created standart reports. Please create one.')
        }),
        store: storeStandartReports,
        sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
        autoExpandColumn: 'namestandartreports',
        cm: new Ext.grid.ColumnModel({
            columns: [
                { header: Ext.app.Localize.get('ID'),                       id:'docidstandartreports', dataIndex: 'docid',       width: 50  },
                { header: Ext.app.Localize.get('Name of user report'),      id:'namestandartreports',  dataIndex: 'name'                    },
                { header: Ext.app.Localize.get('Main file of user report'), id:'doctemplate',          dataIndex: 'doctemplate', width: 200 },
               	Enqueue,
                Export
            ],
            defaults: {
                sortable: true,
                menuDisabled: true
            }
        }),
        plugins: [Export, Enqueue],
        listeners: { 
        	rowclick: function(grid, rowIndex, e) {

        		var value = grid.getStore().getAt(rowIndex).get('documentperiod');

        		if(Ext.isEmpty(value)) 
        			return;
        		
        		grid.getTopToolbar().get('timeperiod_cnt')[ value == 1 ? 'show' : 'hide']();
        		grid.getTopToolbar().get('timeperiodtill_cnt')[ value == 1 ? 'show' : 'hide']();
        		grid.getTopToolbar().get('selectedday_cnt')[ value == 2 ? 'show' : 'hide']();
        		grid.getTopToolbar().get('selectedmonth_cnt')[ value == 0 ? 'show' : 'hide']();
				
        		Ext.getCmp('selectedmonth_cnt')[ value == 0 ? 'show' : 'hide']();		
				Ext.getCmp('timeperiod_cnt')[ value == 1 ? 'show' : 'hide']();
				Ext.getCmp('timeperiodtill_cnt')[ value == 1 ? 'show' : 'hide']();
				
        		var onfly = grid.getStore().getAt(rowIndex).get('onfly'); 
        			grid.getTopToolbar().get('additional_flt_btn')[ onfly == 7 ? 'show' : 'hide']();    
        	}
        }
	});


	var tb2 = new Ext.Toolbar({
		renderTo: gridstandartreports.tbar, // добавляем дополнительный tbar в стандартные отчеты
		items: [
            Ext.app.Localize.get('Advanced search') + ': ',
            {
                xtype: 'container',
                autoEl: 'div',
                id: 'advSrcCont1',
                width: 450,
                height:24,
                layout: 'column',
                fieldLabel: Ext.app.Localize.get('Advanced search'),
                items: [
                    {
                        width: 205,
                        xtype: 'container',
                        autoEl: 'div',
                        items: [
                            {
                                xtype: 'combo',
                                width: 200,
                                id: 'advSearchList1',
                                displayField: 'tplname',
                                valueField: 'tplname',
                                typeAhead: true,
                                mode: 'local',
                                lazyRender: true,
                                triggerAction: 'all',
                                editable: true,
                                store: new Ext.data.ArrayStore({
                                    fields: [{ name: 'tplname', type: 'string' }],
                                    data: []
                                }),
                                mainStore: new Ext.data.Store({
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
                                    baseParams: {
                                        async_call: 1,
                                        devision: 42,
                                        getallsearchtpl: ''
                                    },
                                    autoLoad: true,
                                    listeners: {
                                        add: function(s,r,i){
                                            var C = Ext.getCmp('advSearchList1');
                                            Ext.each(r, function(A){
                                                if(this.store.find('tplname', A.data.tplname) < 0) {
                                                    this.store.add(A);
                                                }
                                            this.store.sort('tplname', 'ASC');
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
                        ]
                    },
                    {
                        xtype: 'container',
                        autoEl: 'div',
                        width: 210,
                        items: {
                            xtype: 'button',
                            text: Ext.app.Localize.get('Change') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
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
                    }
                ]
			},
            '->',
            {
                xtype: 'box',
                autoEl: {tag: 'img', src:'images/page_save.png'}
            },
            Ext.app.Localize.get('Download') + ' ',
            {
                xtype:'checkbox',
                id:'excel'
            }
        ]
	});
	//gridstandartreports.hide();
	gridstandartreports.show();
//End Create the Grid

//-----------------------------------------------------------------------
//Function getButton1
function getButton1(val, x, store){
    var docid=store.data.docid;
    var period=new Date();
    period = Ext.getCmp('timeperiod').getValue().format("Ymd");
    return   '<div align="center"><button onclick="RunReport(\''+docid+'\',\''+period+'\')"><img border=0 hight=15 src="images/book.gif" title="'+Ext.app.Localize.get('Form')+'"/></button></div>';
}
//End Function getButton1
//-----------------------------------------------------------------------
storeStandartReports.reload();
gridstandartreports.getSelectionModel().selectFirstRow();
}
//End function createGridOfStandartReports()
//-----------------------------------------------------------------------



function RunReport(id, timeperiod) {
    var timeperiod = new Date();
    var timeperiodtill = new Date();
    var selectedday = new Date();
    var selectedmonth = new Date().format('m');
    var selectedmonthyear = new Date().format('Y');
    
    var checkbox_excel=Ext.getCmp('excel').getValue();

    if (checkbox_excel){checkbox_excel=1;} else{checkbox_excel=0;}

    timeperiod = Ext.getCmp('timeperiod').getValue().format("Ymd");
    timeperiodtill = Ext.getCmp('timeperiodtill').getValue().format("Ymd");

    selectedday=Ext.getCmp('selectedday').getValue().format("Ymd");
    selectedmonth=Ext.getCmp('selectedmonth').getValue();
    selectedmonthyear=Ext.getCmp('selectedmonthyear').getValue();
    
    var p = {
		async_call: 1,
		checkbox_excel:checkbox_excel, 
		devision: 107, 
		report: 1,docid:id, 
		timeperiod:timeperiod, 
		timeperiodtill:timeperiodtill, 
		selectedday:selectedday, 
		selectedmonthyear: selectedmonthyear, 
		selectedmonth: selectedmonth, 
		usergroupid:usergroup_id,
		include_group:include_group
    };

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

    Ext.Msg.wait(Ext.app.Localize.get('Wait'),Ext.app.Localize.get('File uploading'));
    var conn=new Ext.data.Connection();
    conn.request({
        url:'config.php',
        method:'POST',
        timeout:1200000,
        params:p,
        success: function(resp,opt){
            if (checkbox_excel) {
                var A = Ext.util.JSON.decode(resp.responseText);
                Download({
                    devision: 107,
                    getreport: A.filename
                });
                Ext.Msg.hide();
            }
            else {
                Ext.Msg.hide();
                myWin = open("", "", "", menubar = 1, scrollbars = 1);
                myWin.document.open();
                myWin.document.write(resp.responseText);
                myWin.document.close();
            }
        },
        failure:function(resp,opt){Ext.Msg.hide();alert("failure");}
    });

}
//-------------------------------------------------------------------------------------
//Begin ofFunction createGridOfReports()


function createGridOfReports() {
	//Store for list of  user reports
	storeReports = new Ext.data.Store({
		id: 'listOfReports',
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams: {
			async_call: 1,
			devision: 107,
			getallcontent: 1
		},
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [{
			name: 'reportid',
			type: 'string'
		}, {
			name: 'reportname',
			type: 'string'
		}, {
			name: 'reportdesc',
			type: 'string'
		}, {
			name: 'reportact',
			type: 'int'
		}, {
			name: 'mainfile',
			type: 'string'
		}, {
			name: 'delid',
			type: 'int'
		}])
	});
	//End Store for list of  user reports


// Create the Grid
grid = new Ext.grid.GridPanel({
	id: 'gridid',
	renderTo: 'selfReports',
	store: storeReports,
	frame: true,
	plugins: checkColumn,
	autoExpandColumn: 'reportdesc',
	columns: [
	checkColumn,
	{
		id: 'reporid',
		header: 'ID',
		width: 40,
		sortable: true,
		hidden: true,
		dataIndex: 'reportid'
	}, {
		id: 'reportname',
		header: Ext.app.Localize.get('Name of user report'),
		width: 180,
		sortable: true,
		dataIndex: 'reportname'
	}, {
		id: 'reportdesc',
		header: Ext.app.Localize.get('Description of user report'),
		//width: 220,
		sortable: true,
		dataIndex: 'reportdesc'
	}, {
		id: 'mainfile',
		header: Ext.app.Localize.get('Main file of user report'),
		width: 170,
		sortable: true,
		dataIndex: 'mainfile'
	}, {
		id: 'reportact',
		header: Ext.app.Localize.get('Form'),
		width: 100,
		sortable: true,
		dataIndex: 'reportact',
		renderer: getButton
	}, {
		id: 'delid',
		header: '',
		hidden: true,
		width: 30,
		sortable: true,
		dataIndex: 'delid',
		renderer: setId
	}

	],
	stripeRows: true,
	sm: new Ext.grid.RowSelectionModel({
		singleSelect: true
	}),
	tbar: [{
		xtype: 'button',
		text: Ext.app.Localize.get('Remove'),
		iconCls: 'ext-remove',
		handler: function() {
			storeReports.each(function(record, idx) {
				if (record.dirty == true) {
					if (record.data.delid == true) {
						var conn = new Ext.data.Connection();
						conn.request({
							url: 'config.php',
							method: 'POST',
							params: {
								async_call: 1,
								devision: 107,
								delrow: 1,
								id: record.data.reportid
							}
						});
						grid.getStore().remove(record);
					}
				}
			});
		}
	}],
	height: '447'
});
//End Create the Grid

    //Function getButton
    function getButton(val, x, store){
        var name_file="./users_reports/"+store.data.mainfile;

        return   '<div align="center"><button onclick="post(\''+name_file+'\')"><img border=0 hight=15 src="images/book.gif" title="'+Ext.app.Localize.get('Form')+'"/></button></div>';
    }
    //End Function getButton

    function setId(){
        return 0;
    }

    storeReports.reload();
    grid.getSelectionModel().selectFirstRow();
}
//End function createGridOfReports()
//-----------------------------------------------------------------------

//Function added on the fly field to form user_reports for upload additional file
function addAdditionalFile(numfs){
//alert(num_files);
fiadditional[numfs] = new Ext.form.FileUploadField({
		fieldLabel: Ext.app.Localize.get('Additional files of user report'),
		anchor:'90%',
		layout:'form',
		readOnly:true,
		name:'additionalfile' + numfs,
		xtype: 'fileuploadfield',
		id: 'additionalfile' + numfs,
		emptyText: Ext.app.Localize.get('Select additional file'),
		buttonCfg: {
				text: Ext.app.Localize.get('Upload')
			},
		listeners: {
			'fileselected': function(fb, v){
			 num_files++;numfs++;
			 addAdditionalFile(numfs);
			 }
		 }
	});
	if (numfs>0){
		user_reports.items.items[0].add(fiadditional[numfs]);
		user_reports.doLayout();
	}
}
//End function addAdditionalFile




//Function post
function post( name_file )
{
	var start_period;
	var end_period;
	var report_filter_agent = networkagent_id;
	var choose_group;

	var advSearch = function(f) {
		var c = Ext.getCmp('advSearchList');
		var n = new RegExp('searchtpl', 'i');

		if (Ext.isEmpty(f)) {
			return f;
		}

		if (c.mainStore.find('tplname', c.getValue()) > -1) {
			c.mainStore.each(function(r, idx) {
				if (r.data.tplname != this.tplname) {
					return;
				}
				for (var i in r.data) {
					if (i == 'tplname') {
						continue;
					}

					var tmp = document.createElement("input");
					tmp.type = "hidden";
					tmp.name = 'searchtpl[' + idx + '][' + i + ']';
					tmp.value = r.data[i];
					this.form.appendChild(tmp);
				}
			}, {
				form: f,
				tplname: c.getValue()
			});
		}
		return f;
	}

	if (Ext.get('start_of_period')) start_period = Ext.get('start_of_period').getValue();
	else start_period = '';

	if (Ext.get('end_of_period')) end_period = Ext.get('end_of_period').getValue();
	else end_period = '';

	if (Ext.get('usergroup')) choose_group = Ext.get('usergroup').getValue();
	else choose_group = 0;

	var user_reports_type = show_in;
	var day = start_period.substring(0, 2);
	var month = start_period.substring(3, 5);
	var year = start_period.substring(6, 10);
	var t_day = end_period.substring(0, 2);
	var t_month = end_period.substring(3, 5);
	var t_year = end_period.substring(6, 10);

	var varHash = {
		day: day,
		month: month,
		year: year,
		t_day: t_day,
		t_month: t_month,
		t_year: t_year,
		report_filter_agent: report_filter_agent,
		choose_group: choose_group,
		user_reports_type: user_reports_type,
		usergroup_id: usergroup_id
	};

	var form = document.createElement("form");
	form.action = name_file;
	form.method = "post";
	form.target = "_blank";

	for (var param in varHash) {
		tmp = document.createElement("input");
		tmp.type = "hidden";
		tmp.name = param;
		tmp.value = varHash[param];
		form.appendChild(tmp);
	}

	// Push dom elements for advanced search rules
	form = advSearch(form);

	document.body.appendChild(form);
	form.submit();
}
//End Function post
//--------------------------------------------------------------------------
