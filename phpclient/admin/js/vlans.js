/**
 * Vlans functions
 */

Ext.onReady(function() {
    Ext.QuickTips.init();
	showVlansList('vlansList');
});

PAGESIZE = 100;

function showVlanWindow( config ) {
    var config = config || {
        win: {},
        grid: {}
    };
    
    if(!config.grid) {
        config.grid = {};
    }
    
    new Ext.Window({
        title: config.winTitle || Ext.app.Localize.get('List of vlans'),
        modal: config.modal || true,
        items: getVlanPanel(config),
        layout: 'fit',
        width: 800,
        height: 500,
        buttonAlign: 'center',
        buttons: config.win.buttons || null
    }).show();
}

function showVlansList( renderTo ) {
    if(!document.getElementById(renderTo))  { return; }
    
    getVlanPanel({
        grid: {
            title: Ext.app.Localize.get('List of vlans'),
            height: 780,
            frame: true
        }
    }).render(renderTo);
}

function getVlanPanel( config )
{
    var config = config || {
        grid: {}
    };
    
    var vlansStore = new Ext.data.Store({
        id: 'vlansStore',
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            {name: 'recordid',  type: 'int'},
            {name: 'outervlan', type: 'int'},
            {name: 'innervlan', type: 'int'},
            {name: 'name',      type: 'string'},
            {name: 'type',      type: 'string'}
           ]
        ),
        baseParams: {
            async_call: 1,
            devision: 210,
            action: 'getVlans'
        },
        autoLoad: true //AUTOLOAD
    });

    /**
     * Кнопка редактирования Vlan
    */
    var btnEdit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit') + ' ' + Ext.app.Localize.get('Vlan'), width: 22, iconCls: 'ext-table' });
    btnEdit.on('action', function(g, r, i) {
        insUpdVlan({Store: Ext.getCmp('vlanGrid').getStore(), editVlan: r});
    });

    /**
     * Кнопка удаления Vlan
    */
    var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Delete'), width: 22, iconCls: 'ext-drop' });
    btnDel.on('action', function(g, r, i) {
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Deleting vlan'),
            msg: Ext.app.Localize.get('Are you sure, want to delete vlan?'),
            width:400,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: {
                        async_call: 1,
                        devision: 210,
                        action: 'delVlan',
                        vlan_id: r.data.recordid
                    },
                    scope: {
                        load: Ext.Msg.wait(Ext.app.Localize.get('Wait for complete') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                    },
                    callback: function(opt, success, res) {
                        this.load.hide();
                        if(!success) {
                            Ext.Msg.error(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                            return false;
                        }
                        if (Ext.isDefined(res['responseText'])) {
                            var data = Ext.util.JSON.decode(res.responseText);
                            if ( data.success ){
                                vlansStore.removeAll();
                                vlansStore.load();
                                Ext.Msg.alert(Ext.app.Localize.get('Info'), "Vlan successfully deleted.");
                            }else{
                                Ext.Msg.error(Ext.app.Localize.get('Error'), data.error.reason);
                            }
                        }
                      return false;
                    }
                });
            }
        });
    });

    var masterVlansList = new Ext.grid.GridPanel({
        title: config.grid.title || null,
        xtype: 'grid',
        id: 'vlanGrid',
        height: config.grid.height || 'auto',
        frame: config.grid.frame || false,
        loadMask: true,
        store: vlansStore,
        autoExpandColumn: 'name',
        listeners: {
            beforerender: function(grid) {
                // Add selection
                if(config.grid.sm) {
                    var model = grid.getColumnModel();
                    model.config.unshift(grid.getSelectionModel())
                    model.setConfig(model.config);
                }
            }
        },
        sm: new Ext.grid.CheckboxSelectionModel({singleSelect: config.grid.singleSelect || true}),
        cm: new Ext.grid.ColumnModel({
            columns: [
                btnEdit,
                { header: Ext.app.Localize.get('Outer Vlan'), dataIndex: 'outervlan', width: 160 },
                { header: Ext.app.Localize.get('Inner Vlan'), dataIndex: 'innervlan', width: 160 },
                { header: Ext.app.Localize.get('Name'), dataIndex: 'name', id: 'name' },
                {
                    header: Ext.app.Localize.get('Type'),
                    dataIndex: 'type',
                    width: 200,
                    renderer: function(value){
                        switch (value){
                            case '1': return Ext.app.Localize.get('Client'); break;
                            case '2': return Ext.app.Localize.get('Device'); break;
                            case '3': return Ext.app.Localize.get('Guest'); break;
                        }
                    }
                },
                btnDel
            ]
        }),
        plugins: [btnEdit,btnDel],
        viewConfig: {
            deferEmptyText: false,
            emptyText:Ext.app.Localize.get('There is no created Vlans.')
        },
        tbar: [
        {
            xtype: 'button',
            iconCls: 'ext-add',
            id: 'addNewCat',
            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('Vlan'),
            handler: function(){
                insUpdVlan({Store: Ext.getCmp('vlanGrid').getStore()});
            }
        },
        '->',
        Ext.app.Localize.get('Search') + '&nbsp;',
        {
            name: 'search',
            id: '_search',
            xtype: 'textfield',
            emptyText: Ext.app.Localize.get('search by name'),     
			qtip: Ext.app.Localize.get('search by vlan number'),
			listeners: {
				afterrender: function() {
					this.on('specialkey', function(f, e){
						if (e.getKey() == e.ENTER) {
							this.ownerCt.ownerCt.getStore().setBaseParam('search',Ext.getCmp('_search').getValue());
							this.ownerCt.ownerCt.getStore().reload({
								params: {
									limit: 100,
									start: 0
								}
							})
						}
					}, this);
				}
			}
        },
        {
            xtype: 'button',
            iconCls: 'ext-search',
            tooltip: Ext.app.Localize.get('Search by VLAN name'),
            handler: function(){
        	    vlansStore.setBaseParam('search',Ext.getCmp('_search').getValue());
        	    vlansStore.reload({ params: { start: 0, limit: 100 } });
            }
        },
        {
            xtype: 'button',
            iconCls: 'ext-erase',
            tooltip: Ext.app.Localize.get('Clear'),
            handler: function(){
                Ext.getCmp('_search').setValue('');
                vlansStore.setBaseParam('search','');
                vlansStore.reload({
                    params: {
                        start: 0,
                        limit: 100
                    }
                });
            }
        },
        '&nbsp;'

        ],
        bbar: new Ext.PagingToolbar({
            pageSize: PAGESIZE,
            store: vlansStore,
            displayInfo: true
        })
    });
    
    return masterVlansList;
    
    /*new Ext.Panel({
        id: 'vlansPanel',
        frame: false,
        bodyStyle: 'padding:0px',
        title: Ext.app.Localize.get('Vlans list'),
        border: false,
        layout: 'card',
        activeItem: 0,
        height: 744,
        width: 960,
        renderTo: renderTo,
        autoDestroy: false,
        defaults: {
            border: false
        },
        items: [
            masterVlansList
        ]
    });*/
}


function insUpdVlan(Object) {
    isInsert = (typeof Object.editVlan == 'undefined') ? true : false;
    Object.editVlan = Object.editVlan || {
        data: {
            outervlan: '',
            name: '',
            recordid: 0,
            type: 1
        }
    };
    Store = Object['Store'];

    if (!Ext.isEmpty(Ext.getCmp('winInsUpdVlan'))) { return; }

    var typeVlan = 1;
    switch(Object.editVlan.data.type){
        case 'CLIENT': case '1': typeVlan = 1; break;
        case 'DEVICE': case '2': typeVlan = 2; break;
        case 'GUEST': case '3':  typeVlan = 3; break;
        default: typeVlan = 1; break;
    }

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
                    Ext.Msg.alert('Error!', obj.error.reason);
                };
                //Win.destroy();
            }
        });
    }
    var Win = new Ext.Window({
        title: Ext.app.Localize.get('Adding Vlan'),
        id: 'winInsUpdVlan',
        width: 350,
        plain: true,
        modal: true,
        items: [{
            xtype: 'form',
            buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame: true,
            labelWidth: 120,
            width: '350',
            height: 'auto',
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 210 },
                { xtype: 'hidden', name: 'action', value: 'insUpdVlan' },
                { xtype: 'hidden', name: 'isInsert', value: isInsert?1:0 },
                { xtype: 'hidden', name: 'recordid', value: Object.editVlan.data.recordid},
                {
                    xtype: 'numberfield',
                    name: 'innervlan',
                    width: 180,
                    allowDecimals: false,
                    allowNegative: false,
                    blankText: Ext.app.Localize.get('Input number from 1 to 4095'),
                    maxValue: 4095,
                    minValue: 1,
                    fieldLabel: Ext.app.Localize.get('Inner Vlan'),
                    maskRe: new RegExp("[0-9]"),
                    value: Object.editVlan.data.innervlan
                },
                {
                    xtype: 'numberfield',
                    name: 'outervlan',
                    id: 'outervlan',
                    width: 180,
                    allowDecimals: false,
                    allowNegative: false,
                    blankText: Ext.app.Localize.get('Input number from 1 to 4095'),
                    maxValue: 4095,
                    minValue: 1,
                    fieldLabel: Ext.app.Localize.get('Outer Vlan'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9]"),
                    value: Object.editVlan.data.outervlan
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    id: 'name',
                    width: 180,
                    fieldLabel: Ext.app.Localize.get('Vlan name'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9a-zA-Z:]"),
                    value: Object.editVlan.data.name
                },
                {
                    xtype: 'combo',
                    id: 'vlanTypeCombo',
                    hiddenName: 'type',
                    width: 180,
                    displayField: 'name',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: typeVlan,
                    editable: false,
                    allowBlank: false,
                    store: new Ext.data.SimpleStore({
                        data: [
                            ['1', Ext.app.Localize.get('Clientvlan')],
                            ['2', Ext.app.Localize.get('Servicevlan')],
                            ['3', Ext.app.Localize.get('Guestvlan')]
                        ],
                        fields: ['id', 'name']
                    })
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
} // end insUpdVlan()
