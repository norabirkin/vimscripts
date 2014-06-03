/**
 * JS Engine to view gen.sales page
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
    Ext.layout.FormLayout.prototype.trackLabels = true;
	// Load List object
	showGenSalesPanel('genSales');
});
/**
 * Show log table panel
 * @param	string, DOM element id to render to
 */
function showGenSalesPanel( renderTo )
{
    if(!document.getElementById(renderTo)) return;

    new Ext.Panel({
		id: 'extSalesPanel',
		title: Ext.app.Localize.get('Generate documents of charges'),
		autoHeight: true,
		width: 960,
        frame: true,
        labelWidth: 110,
        bodyStyle: 'padding:0 10px 0;',
		renderTo: renderTo,
        tbar:[
            {
                text: Ext.app.Localize.get('Generate'),
                formBind: true,
                iconCls: 'ext-table',
                id:'buttonOK',
                handler: function(){

                    if (!Ext.getCmp('genSalesForm').getForm().isValid()) {
                        Ext.Msg.error('Check form data');
                        return false;
                    }

                    Ext.MessageBox.show({
                        title: Ext.app.Localize.get('Generate documents?'),
                        msg: Ext.app.Localize.get('Are you sure you want to generate documents?'),
                        width:400,
                        buttons: Ext.MessageBox.OKCANCEL,
                        multiline: false,
                        fn: function( btn ){
                            if (btn == 'cancel') return;
                            
                            var _params = Ext.getCmp('advSearchList').params;
                            _params.devision = 26,
                            _params.async_call = 1,
                            _params.genSales = 1,
                            _params.devision = 26,
                            _params.fields = Ext.util.JSON.encode(Ext.getCmp('genSalesForm').getForm().getValues())
                            
                            
                            Ext.Ajax.request({
                                url: 'config.php',
                                method: 'POST',
                                timeout: 18000000,
                                params: _params,
                                scope: {
                                    load: Ext.Msg.wait(Ext.app.Localize.get('Wait for complete') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                                },
                                callback: function(opt, success, res) {
                                    this.load.hide();
                                    if(!success) {
                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                                        return false;
                                    }
                                    if (Ext.isDefined(res['responseText'])) {
                                        var data = Ext.util.JSON.decode(res.responseText);
                                        if ( data.success ){
                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Data successfully generated'));
                                        }else{
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                        }
                                    }
                                  return false;
                                }
                            });
                        }
                    });

                }
            }
        ],
        items:[
            {
				xtype: 'form',
                id: 'genSalesForm',
                bodyStyle: {padding: '10px'},
                url: 'config.php',
                monitorValid: true,
                items:[
                    // WARNING! items need for correct rendering of table layout
                    { xtype: 'hidden', name: 'genUserId', id: 'genUserId', value: 0},
                    { xtype: 'hidden', name: 'genAgrmId', id: 'genAgrmId', value: 0},
                    {
                        xtype: 'combo',
                        id: 'type',
                        fieldLabel: Ext.app.Localize.get('Action'),
                        hiddenName: 'gen_type',
                        width: 300,
                        displayField: 'name',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        value: '1',
                        editable: false,
                        allowBlank: false,
                        store: new Ext.data.SimpleStore({
                            data: [
                                ['1', Ext.app.Localize.get('Generate documents of accruals')],
                                ['2', Ext.app.Localize.get('Documents export')],
                                ['3', Ext.app.Localize.get('Balances export')]
                            ],
                            fields: ['id', 'name']
                        }),
                        listeners: {
                            select: function(combo, record){
                                if (record.data.id == 1){
                                    Ext.getCmp('date').show();
                                    Ext.getCmp('bdate').label.update(Ext.app.Localize.get('Begin of period'));
                                    Ext.getCmp('date').label.update(Ext.app.Localize.get('Date of issue of documents'));
                                    Ext.getCmp('date').setValue( new Date().format('Y-m-00'));
                                    Ext.getCmp('1Cfilter').hide();
                                }
                                else if (record.data.id == 2){
                                    Ext.getCmp('date').show();
                                    Ext.getCmp('bdate').label.update(Ext.app.Localize.get('Begin of period'));
                                    Ext.getCmp('date').label.update(Ext.app.Localize.get('End of period'));
                                    Ext.getCmp('date').setValue(new Date().add(Date.MONTH, 0).format('Y-m-01'));
                                    Ext.getCmp('1Cfilter').show();
                                    if(Ext.getCmp('1CexpFilter').getValue()==1)
                                    	Ext.getCmp('date').hide();
                                		
                                }
                                else if (record.data.id == 3){
                                    Ext.getCmp('bdate').label.update(Ext.app.Localize.get('For date'));
                                    Ext.getCmp('date').hide();
                                    Ext.getCmp('date').setValue(new Date().format('Y-m-00'));
                                    Ext.getCmp('1Cfilter').hide();
                                }

                            }
                        }
                    },                    
                    {
						xtype: 'combo',
                        id: 'docstype',
                        fieldLabel: Ext.app.Localize.get('Type of agreements'),
                        hiddenName: 'archive',
                        width: 300,
                        displayField: 'name',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        value: '0',
                        editable: false,
                        allowBlank: false,
                        store: new Ext.data.SimpleStore({
                            data: [
                                ['0', Ext.app.Localize.get('Active and canceled')],
                                ['1', Ext.app.Localize.get('Removed')],
                                ['-1', Ext.app.Localize.get('All')]
                            ],
                            fields: ['id', 'name']
                        })				
					},             	        
                    {
                        xtype: 'datefield',
                        fieldLabel: Ext.app.Localize.get('Begin of period'),
                        id: 'bdate',
                        width: 200,
                        format: 'Y-m-d',
                        maskRe: new RegExp('[0-9\-]'),
                        value: new Date().add(Date.MONTH, -1).format('Y-m-01'),
                        allowBlank: false
                    },
                    {
                        xtype: 'datefield',
						fieldLabel: Ext.app.Localize.get('Date of issue of documents'),
                        id: 'date',
                        width: 200,
                        format: 'Y-m-d',
                        maskRe: new RegExp('[0-9\-]'),
						value: new Date().format('Y-m-00'),
                        allowBlank: false
                    },
                    {
                        xtype: 'fieldset',
                        id: '1Cfilter',
                        title: Ext.app.Localize.get('1C export parameters'),
                        autoHeight: true,
                        defaults: {
                            bodyStyle:'padding: 0 0 5px; 0',
                            labelSeparator: '',
                            hideLabel: true
                        },
                        collapsible: true,
                        hidden: true,
                        layout:'anchor',
                        items: [
                        {
                            layout: 'table',
                            autoHeight:true,
                            width: 700,
                            items: [
                                {
                                    xtype: 'radio',
                                    name: 'export_group',
                                    id: 'exportAll',
                                    boxLabel: Ext.app.Localize.get('Download') + ' ' + Ext.app.Localize.get('All'),
                                    checked: true,
                                    inputValue: 0
                                },
                                { xtype: 'tbspacer', width: 5 },
                                {
                                    xtype: 'radio',
                                    name: 'export_group',
                                    id: 'exportPayments',
                                    boxLabel: Ext.app.Localize.get('payments only'),
                                    inputValue: 1
                                },
                                { xtype: 'tbspacer', width: 5 },
                                {
                                    xtype: 'radio',
                                    name: 'export_group',
                                    id: 'exportOrd',
                                    boxLabel: Ext.app.Localize.get('Export accruals'),
                                    inputValue: 2
                                }
                            ]
                        },
                        {
                            xtype: 'checkbox',
                            name: '1CexportOne',
                            boxLabel: Ext.app.Localize.get('Export in one file'),
                            labelSeparator: '',
                            padding: 0
                        },                
	                    {
							xtype: 'fieldset',
							border: false,
							labelWidth: 150,
							style: "padding: 0",
							items:
							[{
								xtype: 'combo',
		                        fieldLabel: Ext.app.Localize.get('Filter documents to:'),
		                        id: '1CexpFilter',
		                        name: '1CexportFilter',
		                        hiddenName: '1CexportFilter',
		                        width: 205,
		                        displayField: 'name',
		                        valueField: 'id',
		                        padding: 0,
		                        mode: 'local',
		                        triggerAction: 'all',
		                        value: '-1',
		                        editable: false,
		                        allowBlank: false,
		                        listeners: {
		                            select: function(combo, record){
		                                if (record.data.id != 1){
		                                    Ext.getCmp('date').show();
		                                    Ext.getCmp('bdate').label.update(Ext.app.Localize.get('Begin of period'));
		                                    Ext.getCmp('date').label.update(Ext.app.Localize.get('End of period'));
		                                    Ext.getCmp('date').setValue(new Date().add(Date.MONTH, 0).format('Y-m-01'));
		                                }
		                                else {
		                                    Ext.getCmp('bdate').label.update(Ext.app.Localize.get('Begin of period'));
		                                    Ext.getCmp('date').hide();
		                                    Ext.getCmp('date').setValue(new Date().format('Y-m-00'));
		                                }
		                            }
		                        },
		                        store: new Ext.data.SimpleStore({
		                            data: [
		                                ['-1', Ext.app.Localize.get('Creation date')],
		                                ['0', Ext.app.Localize.get('Docdate')],
		                                ['1', Ext.app.Localize.get('Period')]
		                            ],
		                            fields: ['id', 'name']
		                        })
							}]
						}
                        /*{
                            xtype: 'checkbox',
                            name: '1CByDocDate',
                            boxLabel: Ext.app.Localize.get('Отбирать документы по дате документа, а не по дате регистрации документа в базе.'),
                            labelSeparator: '',
                            padding: 5
                        }*/
                        ]
                    },
                    {
                        items: {
                            xtype: 'fieldset',
                            title: Ext.app.Localize.get('Filter'),
                            autoHeight: true,
                            layout: 'table',
                            layoutConfig: {
                                tableAttrs: {
                                    style: {
                                        width: '100%'
                                    }
                                },
                                columns: 2
                            },
                            defaults: {
                                bodyStyle:'padding: 3px 5px;',
                                labelSeparator: '',
                                hideLabel: true
                            },
                            collapsible: true,
                            items: [

                                /* First row */
                                {
                                    colspan: 2,
                                    items: {
                                        xtype: 'radio',
                                        name: 'filter',
                                        boxLabel: Ext.app.Localize.get('To all'),
                                        checked: true,
                                        inputValue: 'all',
                                        listeners: {
                                            check: function(checkbox, checked) {
                                                if(checked) {
                                                    /* Second block */
                                                    Ext.getCmp('userCombo').disable();
                                                    Ext.getCmp('radioInclGroup').disable();
                                                    Ext.getCmp('radioExclGroup').disable();
                                                    /* Third block */
                                                    Ext.getCmp('searchUsrField').setValue("").disable();
                                                    Ext.getCmp('searchUsrBtn').disable();
                                                    /* Fourth block */
                                                    Ext.getCmp('searchAgrmField').setValue("").disable();
                                                    Ext.getCmp('searchAgrmBtn').disable();
                                                    /* Fifth block */
                                                    Ext.getCmp('advSearchEdit').disable();
                                                    Ext.getCmp('advSearchList').disable();

                                                    Ext.getCmp('genUserId').setValue(0);
                                                    Ext.getCmp('genAgrmId').setValue(0);
                                                }
                                            }
                                        }
                                    }
                                },


                                /* Second row */
                                {
                                    items: {
                                        xtype: 'radio',
                                        name: 'filter',
                                        boxLabel: Ext.app.Localize.get('User group'),
                                        inputValue: 'group',
                                        listeners: {
                                            check: function(checkbox, checked) {
                                                if(checked) {
                                                    /* Second block */
                                                    Ext.getCmp('userCombo').enable();
                                                    Ext.getCmp('radioInclGroup').enable();
                                                    Ext.getCmp('radioExclGroup').enable();
                                                    /* Third block */
                                                    Ext.getCmp('searchUsrField').setValue("").disable();
                                                    Ext.getCmp('searchUsrBtn').disable();
                                                    /* Fourth block */
                                                    Ext.getCmp('searchAgrmField').setValue("").disable();
                                                    Ext.getCmp('searchAgrmBtn').disable();
                                                    /* Fifth block */
                                                    Ext.getCmp('advSearchEdit').disable();
                                                    Ext.getCmp('advSearchList').disable();

                                                    Ext.getCmp('genUserId').setValue(0);
                                                    Ext.getCmp('genAgrmId').setValue(0);
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    items: {
                                        layout: 'table',
                                        defaults: {
                                            disabled: true
                                        },
                                        autoHeight:true,
                                        items: [
                                        {
                                            xtype: 'combo',
                                            hiddenName: 'user_group',
                                            editable : false,
                                            typeAhead: true,
                                            mode: 'local',
                                            triggerAction: 'all',
                                            emptyText : Ext.app.Localize.get('Choose the group'),
                                            disabled: true,
                                            id: 'userCombo',
                                            width: 300,
                                            tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.groupid + " - " + values.name, 32)]}</div></tpl>',
                                            itemSelector: 'div.x-combo-list-item',
                                            valueField: 'groupid',
                                            displayField: 'name',
                                            allowBlank: false,
                                            store: new Ext.data.Store({
                                                proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
                                                reader: new Ext.data.JsonReader(
                                                    { root: 'results' },
                                                    [
                                                        { name: 'groupid',     type: 'int' },
                                                        { name: 'name',        type: 'string' },
                                                        { name: 'description', type: 'string' }
                                                    ]
                                                ),
                                                autoLoad: true,
                                                baseParams: {
                                                    async_call: 1,
                                                    devision: 26,
                                                    getUserGroups: 1
                                                }
                                            })
                                        },
                                        { xtype: 'tbspacer', width: 5 },
                                        {
                                            xtype: 'radio',
                                            name: 'include_group',
                                            id: 'radioInclGroup',
                                            boxLabel: Ext.app.Localize.get('Include'),
                                            checked: true,
                                            inputValue: 1,
                                            labelSeparator: '',
                                            disabled: true
                                        },
                                        { xtype: 'tbspacer', width: 5 },
                                        {
                                            xtype: 'radio',
                                            name: 'include_group',
                                            id: 'radioExclGroup',
                                            boxLabel: Ext.app.Localize.get('Exclude'),
                                            inputValue: 2,
                                            labelSeparator: '',
                                            disabled: true
                                        }
                                        ]
                                    }
                                },

                                /* Third row */
                                {
                                    items: {
                                        xtype: 'radio',
                                        name: 'filter',
                                        labelSeparator: '',
                                        hideLabel: true,
                                        boxLabel: Ext.app.Localize.get('User'),
                                        inputValue: 'user',
                                        listeners: {
                                            check: function(checkbox, checked) {
                                                if(checked) {
                                                    /* Second block */
                                                    Ext.getCmp('userCombo').setValue("").disable();
                                                    Ext.getCmp('radioInclGroup').disable();
                                                    Ext.getCmp('radioExclGroup').disable();
                                                    /* Third block */
                                                    Ext.getCmp('searchUsrField').enable();
                                                    Ext.getCmp('searchUsrBtn').enable();
                                                    /* Fourth block */
                                                    Ext.getCmp('searchAgrmField').setValue("").disable();
                                                    Ext.getCmp('searchAgrmBtn').disable();
                                                    /* Fifth block */
                                                    Ext.getCmp('advSearchEdit').disable();
                                                    Ext.getCmp('advSearchList').disable();

                                                    Ext.getCmp('genAgrmId').setValue(0);
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    items: {
                                        layout: 'hbox',
                                        defaults: {
                                            disabled: true
                                        },
                                        autoHeight:true,
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                id: 'searchUsrField',
                                                name: 'searchUsrField',
                                                value: '',
                                                readOnly: true,
                                                width: 273,
                                                allowBlank: false
                                            },
                                            { xtype: 'tbspacer', width: 5 },
                                            {
                                                xtype: 'button',
                                                id: 'searchUsrBtn',
                                                iconCls: 'ext-blocked-grid',
                                                hideLabel: true,
                                                handler: function () {
                                                    showUsers({
                                                        sm: true,
                                                        callbackok: function(grid){
                                                            try {
                                                                if(Ext.isEmpty(grid.getSelectionModel().getSelected())) {
                                                                    return false;
                                                                } else {
                                                                    var record = grid.getSelectionModel().getSelected();
                                                                }
                                                                Ext.getCmp('genUserId').setValue(record.data.uid);
                                                                Ext.getCmp('searchUsrField').setValue(record.data.name);
                                                            } catch(e) {
                                                                Ext.Msg.error(e);
                                                                return false;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                },

                                /* Fourth row */
                                {
                                    items: {
                                        xtype: 'radio',
                                        name: 'filter',
                                        labelSeparator: '',
                                        hideLabel: true,
                                        boxLabel: Ext.app.Localize.get('Agreement'),
                                        inputValue: 'agreement',
                                        listeners: {
                                            check: function(checkbox, checked) {
                                                if(checked) {
                                                    /* Second block */
                                                    Ext.getCmp('userCombo').disable();
                                                    Ext.getCmp('radioInclGroup').disable();
                                                    Ext.getCmp('radioExclGroup').disable();
                                                    /* Third block */
                                                    Ext.getCmp('searchUsrField').setValue("").disable();
                                                    Ext.getCmp('searchUsrBtn').disable();
                                                    /* Fourth block */
                                                    Ext.getCmp('searchAgrmField').enable();
                                                    Ext.getCmp('searchAgrmBtn').enable();
                                                    /* Fifth block */
                                                    Ext.getCmp('advSearchEdit').disable();
                                                    Ext.getCmp('advSearchList').disable();

                                                    Ext.getCmp('genUserId').setValue(0);
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    items: {
                                        layout: 'hbox',
                                        defaults: {
                                            disabled: true
                                        },
                                        autoHeight:true,
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                id: 'searchAgrmField',
                                                name: 'searchAgrmField',
                                                value: '',
                                                readOnly: true,
                                                width: 273,
                                                allowBlank: false
                                            },
                                            { xtype: 'tbspacer', width: 5 },
                                            {
                                                xtype: 'button',
                                                id: 'searchAgrmBtn',
                                                iconCls: 'ext-text',
                                                hideLabel: true,
                                                handler: function(){
                                                	var agrmType = Ext.getCmp('docstype').getValue();
                                                    selectAgrm(null, null, 'searchAgrmField', 'genAgrmId', 'genSalesForm', agrmType, 1, AUTOLOAD, 1);
                                                }
                                            }
                                        ]
                                    }
                                },
                                
                                /* Fifth row */
                                {
                                    items: {
                                        xtype: 'radio',
                                        name: 'filter',
                                        labelSeparator: '',
                                        hideLabel: true,
                                        boxLabel: Ext.app.Localize.get('Advanced search'),
                                        inputValue: 'adv_search',
                                        listeners: {
                                            check: function(checkbox, checked) {
                                                if(checked) {
                                                    /* Second block */
                                                    Ext.getCmp('userCombo').disable();
                                                    Ext.getCmp('radioInclGroup').disable();
                                                    Ext.getCmp('radioExclGroup').disable();
                                                    /* Third block */
                                                    Ext.getCmp('searchUsrField').setValue("").disable();
                                                    Ext.getCmp('searchUsrBtn').disable();
                                                    /* Fourth block */
                                                    Ext.getCmp('searchAgrmField').disable();
                                                    Ext.getCmp('searchAgrmBtn').disable();
                                                    /* Fifth block */
                                                    Ext.getCmp('advSearchEdit').enable();
                                                    Ext.getCmp('advSearchList').enable();
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    items: {
                                        layout: 'hbox',
                                        defaults: {
                                            disabled: true
                                        },
                                        autoHeight:true,
                                        items: [
											{
											    xtype: 'combo',
											    id: 'advSearchList',
											    width: 300,
											    displayField: 'tplname',
											    valueField: 'tplname',
											    typeAhead: true,
											    mode: 'local',
											    triggerAction: 'all',
											    editable: true,
											    store: new Ext.data.ArrayStore({
											        fields: [{ name: 'tplname', type: 'string' }],
											        data: []
											    }),
											    params: {},
											    listeners: {
											    	'select': function(){
											    		var n = new RegExp('searchtpl','i');
											            var s = {};
											            
											            var C = Ext.getCmp('advSearchList');
											            C.params = s;
											            if(C.mainStore.find('tplname', C.getValue()) > -1) {
											                C.mainStore.each(function(r,idx){
											                    if(r.data.tplname != this.tplname) {
											                        return;
											                    }
											                    for(var i in r.data) {
											                        if(i == 'tplname') {
											                            continue;
											                        }
											                        this.params['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
											                    }
											                }, { params: C.params, tplname: C.getValue() });
											            }
											    	}
											    },
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
											                        this.store.sort('tplname', 'ASC');
											                    }
											                }, { store: C.store, mainStore: C.mainStore });
											            },
											            load: function(s,r,i){
											            s.events.add.listeners[0].fn(s,r,i);
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
											}, {
											    xtype: 'tbspacer',
											    width: 5
											}, {
											    xtype: 'button',
											    id: 'advSearchEdit',
											    text: Ext.app.Localize.get('Change') + '&nbsp;' + Ext.app.Localize.get('rules') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
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
											            
											            
											            var n = new RegExp('searchtpl','i');
											            var s = {};

											            C.params = s;
											            if(C.mainStore.find('tplname', C.getValue()) > -1) {
											                C.mainStore.each(function(r,idx){
											                    if(r.data.tplname != this.tplname) {
											                        return;
											                    }
											                    for(var i in r.data) {
											                        if(i == 'tplname') {
											                            continue;
											                        }
											                        this.params['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
											                    }
											                }, { params: C.params, tplname: C.getValue() });
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
                                      ]}
                                }
                            ]
                        }
                    }
                ]
            }
        ]
	});

} // end showGenSalesPanel()
