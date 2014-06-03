PPAGELIMIT=100;

var accessReady=function(){
	saleDictionary();
}

function saleDictionary() {
	
 
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader(
            { root: 'results', totalProperty: 'total' },
            [
                { name: 'recordid',      type: 'int' },
                { name: 'gaap',          type: 'int' },
                { name: 'name',          type: 'string' },
                { name: 'unit',          type: 'string' },
                { name: 'codeokei',      type: 'int' },
                { name: 'unitmult',      type: 'float' },
                { name: 'modperson',     type: 'int' },
                { name: 'servtype',     type: 'int' }
            ]
        ),
        baseParams: {
            async_call: 1,
            devision: 4,
            getSaleDictionary: 1,
            start: 0,
            limit: PPAGELIMIT
        },
        sortInfo: {
            field: 'name',
            direction: "ASC"
        },
        autoload: true
    });

    store.load();

    var btnEdit = new Ext.grid.RowButton({
        header: '&nbsp;', 
        qtip: Ext.app.Localize.get('Edit'), 
        width: 22, 
        iconCls: 'ext-edit', 
        disabled: Access.saledictionary < 2 ? true : false
    });
    btnEdit.on('action', function(g, r, i) {
    	if (Access.saledictionary<2) return;
        insUpdSalesDictionary({Store: store, editSalesDict: r});
    });

    
    
    
    var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Delete'), width: 22, iconCls: 'ext-drop' });
    btnDel.on('action', function(g, r, i) {
    	if (Access.saledictionary<2) return;
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Remove'),
            msg: Ext.app.Localize.get('Do You really want to remove selected record') + '?',
            width: 300,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: {
                        async_call: 1,
                        devision: 4,
                        delSalesDict: r.data.recordid
                    },
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
                                store.removeAll();
                                store.load();
                            }else{
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                            }
                        }
                      return false;
                    }
                });
            }
        });
    });
    
    var colModel = new Ext.grid.ColumnModel([
        btnEdit,
        {
            header: Ext.app.Localize.get('Name'),
            dataIndex: 'name',
            id: 'name',
            sortable: true
        }, {
            header: Ext.app.Localize.get('Unit of m.'),
            width: 80,
            dataIndex: 'unit'
        },
        {
            header: Ext.app.Localize.get('Code'),
            dataIndex: 'gaap',
            sortable: true
        }, {
            header: Ext.app.Localize.get('Service'),
            dataIndex: 'servtype',
            sortable: true,
            renderer: function(value) {
				if(value == 1) { return Ext.app.Localize.get('Sell'); }
				else if(value == 2) { return Ext.app.Localize.get('Rent'); }
				else { return '-'; }
			}
        },
        btnDel
    ]);
    
    
    
    
	new Ext.grid.GridPanel({
        renderTo: 'ADPanel',
        title: Ext.app.Localize.get("Classifier services"),
        width: 900,
        height: 744,
        store: store,
        cm: colModel,
        plugins: [btnEdit, btnDel],
        loadMask: true,
        autoExpandColumn: 'name',
        PAGELIMIT: 100,
        listeners: {
            afterrender: function(grid) {
                // Set paging bar
                grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                var bbar = grid.getBottomToolbar();
                bbar.pageSize = grid.PAGELIMIT;
                bbar.bindStore(grid.store);
                bbar.add(['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    mode: 'local',
                    triggerAction: 'all',
                    value: grid.PAGELIMIT,
                    editable: false,
                    store: {
                        xtype: 'arraystore',
                        data: [[20], [50], [100], [500]],
                        fields: ['id']
                    },
                    listeners: {
                        select: function(c){
                            this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
                            this.store.reload({
                                params: {
                                    limit: this.PAGELIMIT
                                }
                            });
                        }.createDelegate(grid)
                    }
                }]);
            }
        },
        tbar: [{
            xtype: 'button',
            id: '_addSalesRecord',
            text: Ext.app.Localize.get("Add"),
            iconCls: 'ext-add',
            disabled: Access.saledictionary < 2 ? true : false,
            handler: function() {
                insUpdSalesDictionary({Store: store});
            }
        }],
        bbar: {
            xtype: 'paging',
            pageSize: 0,
            displayInfo: true
        }
    });
} // end saleDictionary()


/**
 * Create new record or update existing
 * @param {Object} Object
 */
function insUpdSalesDictionary(Object)
{
    isInsert = (typeof Object.editSalesDict == 'undefined') ? true : false;
    Object.editSalesDict = Object.editSalesDict || {
        data: {
            gaap: '',
            name: '',
            servtype: 0,
            codeokei: null,
            unit: null,
            unitmult: null,
            recordid: 0
        }
    };
    Store = Object['Store'];
    if (!Ext.isEmpty(Ext.getCmp('winInsUpdSalesDict'))) { return; }
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                Store.reload();
                Win.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.errors.reason);
                };
                //Win.destroy();
            }
        });
    }

    var Win = new Ext.Window({
        title: (isInsert) ? Ext.app.Localize.get('New classification') : Ext.app.Localize.get('Edit') + ': ' + Object.editSalesDict.data.name,
        id: 'winInsUpdSalesDict',
        renderTo:Ext.getBody(),
        width: 450,
        height: 270,
        border:false,
        layout:'fit',
        modal: true,
        items: [{
            xtype: 'form',
            buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame:true,
            labelWidth: 130,
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 4 },
                { xtype: 'hidden', name: 'insUpdSalesDictionary', value: 1 },
                { xtype: 'hidden', name: 'isInsert', value: isInsert?1:0 },
                { xtype: 'hidden', name: 'recordid', value: Object.editSalesDict.data.recordid},
                {
                    xtype: 'numberfield',
                    name: 'gaap',
                    id: 'gaap',
                    width: 180,
                    allowDecimals: false,
                    allowNegative: false,
                    fieldLabel: Ext.app.Localize.get('Code'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9]"),
                    value: Object.editSalesDict.data.gaap,
                    anchor:'-18'
                }, {
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Type of transaction'),
                    hiddenName: 'servtype',
					mode: 'local',
					anchor:'-18',
					triggerAction: 'all',
					valueField: 'servtype',
					displayField: 'name',
					editable: false,
                    store: {
						xtype: 'arraystore',
						autoLoad: false,
						fields: ['servtype', 'name'],
						data: [
							[2, Ext.app.Localize.get('Rent')],
							[1, Ext.app.Localize.get('Sell')],
							[0, '"' + Ext.app.Localize.get('Service') + '" ' + Ext.app.Localize.get('or') + ' "' + Ext.app.Localize.get('Temporarily use') + '"']
						]
					},
					listeners: {
                        afterrender: function(combo) {
                            combo.setValue(this.editSalesDict.data.servtype);
                        }.createDelegate(Object)
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Unit of measurement'),
                    hiddenName: 'codeokei',
                    selectOnFocus: true,
                    mode: 'remote',
                    displayField: 'name',
                    valueField: 'recordid',
                    forceSelection: true,
                    triggerAction: 'all',
                    editable: false,
                    anchor:'-18',
                    listeners: {
                        afterrender: function(combo) {
                            combo.setValue(this.editSalesDict.data.codeokei);
                            combo.setRawValue(this.editSalesDict.data.unit);
                        }.createDelegate(Object)
                    },
                    store: {
                        xtype: 'jsonstore',
                        root: 'results',
                        fields: ['recordid','name'],
                        baseParams: {
                            async_call: 1,
                            devision: 4, 
                            getDefUnit: 1
                        }
                    }
                }, {
                    xtype: 'numberfield',
                    name: 'unitmult',
                    anchor:'-18',
                    value: Object.editSalesDict.data.unitmult,
                    fieldLabel: Ext.app.Localize.get('Conversion coefficient') // X015 del ;
                },
                {
                    xtype: 'textarea',
                    name: 'name',
                    id: 'name',
                    fieldLabel: Ext.app.Localize.get('Description'),
                    allowBlank: false,
                    enableKeyEvents: true,
                    height:80,
                    width: 280,
                    value: Object.editSalesDict.data.name,
                    autoScroll:true
                }
            ],
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                formBind: true,
                handler: sendData
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Cancel'),
                handler: function(){
                    Win.close();
                }
            }]
        }]        
    });
    Win.show();
}
