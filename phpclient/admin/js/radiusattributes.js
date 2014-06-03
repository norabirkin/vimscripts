/**
 * Control panel to create new attributes or edit existing for these units:
 *         Module
 *         Accounts union
 *         Tariff
 *         Tariff category
 *         Account
 */

Ext.onReady(function(){
    Ext.QuickTips.init();
    // Show Tabpanle with RADIUS attributes
    showRADIUSAttributes('RADIUSAttrList');
});


/**
 * Show tabpanel with RADIUS attributes
 * @param        string, body element to render to this tabpanel
 */
function showRADIUSAttributes(renderTo)
{
    if(!Ext.get(renderTo)) {
        return false;
    }

    var PAGELIMIT = 100;

    var Store = new Ext.data.Store({
        is: 'attrStore',
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [
            { name: 'recordid', type: 'int' },
            { name: 'agentid', type: 'int' },
            { name: 'nasid', type: 'int' },
            { name: 'groupid', type: 'int' },
            { name: 'vgid', type: 'int' },
            { name: 'tarid', type: 'int' },
            { name: 'shape', type: 'int' },
            { name: 'radiuscode', type: 'int' },
            { name: 'attrid', type: 'int' },
            { name: 'value', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'ownerdescr', type: 'string' },
            { name: 'dictname', type: 'string' },
            { name: 'catdescr', type: 'string' },
            { name: 'catidx', type: 'int' },
            { name: 'service', type: 'string' },
            { name: 'serviceforlist', type: 'int' },
            { name: 'devgroupid', type: 'int' },
            { name: 'tag', type: 'int' }
        ]),
        baseParams: {
            async_call: 1,
            devision: 399,
            getattributes: 0,
            start: 0,
            limit: PAGELIMIT
        }
    });

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Change') + ' ' + Ext.app.Localize.get('attribute'),
        width: 22,
        dataIndex: 'recordid',
        iconCls: 'ext-edit'
    });

    var ModuleModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var UnionModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var TariffModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var CategoryModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var AccModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var ShapeModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    new Ext.TabPanel({
        renderTo: renderTo,
        activeTab: 0,
        plain: true,
        width: 980,
        deferredRender: false,
        listeners: {
            tabchange: function(A, B){
                switch(B.getId()) {
                    case 'moduletab':
                        B.store.baseParams.getattributes = 1;
                    break;

                    case 'uniontab':
                        B.store.baseParams.getattributes = 2;
                    break;

                    case 'tarifftab':
                        B.store.baseParams.getattributes = 3;
                    break;

                    case 'shapetab':
                        B.store.baseParams.getattributes = 5;
                    break;

                    case 'accounttab':
                        B.store.baseParams.getattributes = 6;
                    break;
                }

                A.getTopToolbar().findById('hidetars')[(B.getId() != 'tarifftab') ? 'disable' : 'enable']();
                A.getTopToolbar().findById('hidetars').setValue(false);

                A.getTopToolbar().findById('hideserv')[(B.getId() != 'moduletab') ? 'disable' : 'enable']();
                A.getTopToolbar().findById('hideserv').setValue(false);

                var sel = B.getBottomToolbar().findByType('combo')[0];

                B.store.reload({
                    params: {
                        start: 0,
                        limit: sel.getValue() || PAGELIMIT
                    }
                });
            }
        },
        tbar: [{
            xtype: 'button',
            iconCls: 'ext-add',
            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('attribute'),
            handler: function() {
                this.ownerCt.ownerCt.getActiveTab();
                AttributeForm(
                    {
                        store:Store,
                        edit: false,
                        record: {},
                        success: function(){ }
                    }
                );
            }
        }, {
            xtype: 'button',
            iconCls: 'ext-remove',
            text: Ext.app.Localize.get('Remove') + ' ' + Ext.app.Localize.get('attribute'),
            form: new Ext.form.FormPanel({
                frame: false,
                url: 'config.php',
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 399
                }],
                renderTo: Ext.getBody()
            }),
            submitObject: {
                method:'POST',
                waitTitle: Ext.app.Localize.get('Connecting'),
                waitMsg: Ext.app.Localize.get('Sending data') + '...',
                success: function(form, action) {
                    var O = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
                        this.store.reload();
                    }.createDelegate(this.grid));
                },
                failure: function(form, action){
                    var O = Ext.util.JSON.decode(action.response.responseText);
                    if(!Ext.isArray(O.reason)) {
                        Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
                            this.store.reload()
                        }.createDelegate(this.grid));
                    }
                    else {
                        try {
                            var store = new Ext.data.ArrayStore({
                                autoDestroy: true,
                                idIndex: 0,
                                data: O.reason,
                                fields: [{
                                    name: 'attribute',
                                    type: 'string'
                                }, {
                                    name: 'reason',
                                    type: 'string'
                                }]
                            });

                            new Ext.Window({
                                modal: true,
                                title: Ext.app.Localize.get('Error'),
                                width: 600,
                                items: [{
                                    xtype: 'grid',
                                    store: store,
                                    height: 200,
                                    autoExpandColumn: 'nonedelreason',
                                    cm: new Ext.grid.ColumnModel({
                                        columns: [{
                                            header: Ext.app.Localize.get('Attribute'),
                                            dataIndex: 'attribute',
                                            width: 140
                                        }, {
                                            header: Ext.app.Localize.get('Reason'),
                                            dataIndex: 'reason',
                                            id: 'nonedelreason'
                                        }],
                                        defaults: {
                                            sortable: true,
                                            menuDisabled: true
                                        }
                                    })
                                }],
                                listeners: {
                                    close: function(){
                                        this.store.reload()
                                    }.createDelegate(this.grid)
                                }
                            }).show();
                        }
                        catch(e) { }
                    }
                }
            },
            handler: function() {
                var G = this.ownerCt.ownerCt.getActiveTab();
                var M = G.getSelectionModel();
                if(M.getCount() > 0) {
                    Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Remove selected') + ' ' + Ext.app.Localize.get('attributes') + '?', function(B){
                        if(B != 'yes') {
                            return false;
                        }

                        this.Button.submitObject.params = {};

                        this.sm.each(function(record){
                            this['delattrs[' + record.data.recordid + '][dictname]'] = record.data.dictname;
                        }, this.Button.submitObject.params);

                        if(!Ext.isDefined(this.Button.submitObject['scope'])) {
                            this.Button.submitObject.scope = {
                                form: this.Button.form,
                                grid: this.Grid
                            }
                        }

                        this.Button.form.getForm().submit(this.Button.submitObject);
                    }, {
                        sm: M,
                        Button: this,
                        Grid: G
                    });
                }
            }
        }, '-', {
            xtype: 'tbtext',
            style: {
                paddingRight: 5
            },
            text: Ext.app.Localize.get('Categories')
        }, {
            xtype: 'checkbox',
            id: 'hidetars',
            qtip: Ext.app.Localize.get('Hide attributes not associated with the category'),
            handler: function(B, C) {
                var G = this.ownerCt.ownerCt.getActiveTab();
                G.store.baseParams.getattributes = C ? 4 : 3;
                var sel = B.getBottomToolbar().findByType('combo')[0];
                G.store.reload({
                    params: {
                        start: 0,
                        limit: sel.getValue() || PAGELIMIT
                    }
                });
            }
        }, {
            xtype: 'tbtext',
            style: {
                paddingRight: 5
            },
            text: Ext.app.Localize.get('Services')
        }, {
            xtype: 'checkbox',
            id: 'hideserv',
            qtip: Ext.app.Localize.get('Hide attributes not associated with the services'),
            handler: function(B, C) {
                var G = this.ownerCt.ownerCt.getActiveTab();
                G.store.baseParams.getattributes = C ? 7 : 1;
                var sel = B.getBottomToolbar().findByType('combo')[0];
                G.store.reload({
                    params: {
                        start: 0,
                        limit: sel.getValue() || PAGELIMIT
                    }
                });
            }
        }],
        items: [{
            title: Ext.app.Localize.get('Module'),
            xtype: 'grid',
            id: 'moduletab',
            height: 700,
            loadMask: true,
            border: false,
            store: Store,
            autoExpandColumn: 'descrcol',
            plugins: [ Edit ],
            sm: ModuleModel,
            cm: new Ext.grid.ColumnModel({
                columns: [ ModuleModel, Edit, {
                    header: 'ID',
                    dataIndex: 'recordid',
                    width: 60
                }, {
                    header: Ext.app.Localize.get('Linked') + ' (' + Ext.app.Localize.get('Module') + ')',
                    dataIndex: 'ownerdescr',
                    width: 220
                }, {
                    header: Ext.app.Localize.get('Service'),
                    dataIndex: 'service',
                    width: 100
                }, {
                    header: Ext.app.Localize.get('Attribute'),
                    dataIndex: 'dictname',
                    width: 200
                }, {
                    header: 'RADIUS Code',
                    dataIndex: 'radiuscode',
                    width: 120,
                    renderer: function(value) {
                        switch(value) {
                            case 2: return 'Access-Acept';
                            case 3: return 'Access-Reject';
                            default: return value;
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'description',
                    id: 'descrcol'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: PAGELIMIT,
                store: Store,
                displayInfo: true,
                items: ['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: PAGELIMIT,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['100'],
                            ['500']
                        ],
                        fields: ['id']
                    }),
                    listeners: {
                        select: function(){
                            this.ownerCt.pageSize = PAGELIMIT = this.getValue() * 1;
                            Store.reload({ params: { limit: this.ownerCt.pageSize } });
                        }
                    }
                }]
            })
        }, {
            title: Ext.app.Localize.get('Union') + ' ' + Ext.app.Localize.get('by accounts'),
            xtype: 'grid',
            id: 'uniontab',
            height: 700,
            loadMask: true,
            border: false,
            store: Store,
            autoExpandColumn: 'descrcol',
            plugins: [ Edit ],
            sm: UnionModel,
            cm: new Ext.grid.ColumnModel({
                columns: [ UnionModel, Edit, {
                    header: 'ID',
                    dataIndex: 'recordid',
                    width: 60
                }, {
                    header: Ext.app.Localize.get('Linked') + ' (' + Ext.app.Localize.get('Module') + ')',
                    dataIndex: 'ownerdescr',
                    width: 240
                }, {
                    header: Ext.app.Localize.get('Attribute'),
                    dataIndex: 'dictname',
                    width: 200
                }, {
                    header: 'RADIUS Code',
                    dataIndex: 'radiuscode',
                    width: 120,
                    renderer: function(value) {
                        switch(value) {
                            case 2: return 'Access-Acept';
                            case 3: return 'Access-Reject';
                            default: return value;
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'description',
                    id: 'descrcol'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: PAGELIMIT,
                store: Store,
                displayInfo: true,
                items: ['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: PAGELIMIT,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['100'],
                            ['500']
                        ],
                        fields: ['id']
                    }),
                    listeners: {
                        select: function(){
                            this.ownerCt.pageSize = PAGELIMIT = this.getValue() * 1;
                            Store.reload({ params: { limit: this.ownerCt.pageSize } });
                        }
                    }
                }]
            })
        }, {
            title: Ext.app.Localize.get('Tarifs'),
            xtype: 'grid',
            id: 'tarifftab',
            height: 700,
            loadMask: true,
            border: false,
            store: Store,
            autoExpandColumn: 'descrcol',
            plugins: [ Edit ],
            sm: TariffModel,
            cm: new Ext.grid.ColumnModel({
                columns: [ TariffModel, Edit, {
                    header: 'ID',
                    dataIndex: 'recordid',
                    width: 60
                }, {
                    header: Ext.app.Localize.get('Linked') + ' (' + Ext.app.Localize.get('Tarif') + ')',
                    dataIndex: 'ownerdescr',
                    width: 190
                }, {
                    header: Ext.app.Localize.get('Category'),
                    dataIndex: 'catdescr',
                    width: 190
                }, {
                    header: Ext.app.Localize.get('Attribute'),
                    dataIndex: 'dictname',
                    width: 170
                }, {
                    header: 'RADIUS Code',
                    dataIndex: 'radiuscode',
                    width: 120,
                    renderer: function(value) {
                        switch(value) {
                            case 2: return 'Access-Acept';
                            case 3: return 'Access-Reject';
                            default: return value;
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'description',
                    id: 'descrcol'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: PAGELIMIT,
                store: Store,
                displayInfo: true,
                items: ['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: PAGELIMIT,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['100'],
                            ['500']
                        ],
                        fields: ['id']
                    }),
                    listeners: {
                        select: function(){
                            this.ownerCt.pageSize = PAGELIMIT = this.getValue() * 1;
                            Store.reload({ params: { limit: this.ownerCt.pageSize } });
                        }
                    }
                }]
            })
        }, {
            title: Ext.app.Localize.get('Shape'),
            xtype: 'grid',
            id: 'shapetab',
            height: 700,
            loadMask: true,
            border: false,
            store: Store,
            autoExpandColumn: 'descrcol',
            plugins: [ Edit ],
            sm: ShapeModel,
            cm: new Ext.grid.ColumnModel({
                columns: [ ShapeModel, Edit, {
                    header: 'ID',
                    dataIndex: 'recordid',
                    width: 60
                }, {
                    header: Ext.app.Localize.get('Linked') + ' (' + Ext.app.Localize.get('Shape') + ')',
                    dataIndex: 'shape',
                    width: 240
                }, {
                    header: Ext.app.Localize.get('Attribute'),
                    dataIndex: 'dictname',
                    width: 200
                }, {
                    header: 'RADIUS Code',
                    dataIndex: 'radiuscode',
                    width: 120,
                    renderer: function(value) {
                        switch(value) {
                            case 2: return 'Access-Acept';
                            case 3: return 'Access-Reject';
                            default: return value;
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'description',
                    id: 'descrcol'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: PAGELIMIT,
                store: Store,
                displayInfo: true,
                items: ['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: PAGELIMIT,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['100'],
                            ['500']
                        ],
                        fields: ['id']
                    }),
                    listeners: {
                        select: function(){
                            this.ownerCt.pageSize = PAGELIMIT = this.getValue() * 1;
                            Store.reload({ params: { limit: this.ownerCt.pageSize } });
                        }
                    }
                }]
            })
        }, {
            title: Ext.app.Localize.get('Accounts'),
            xtype: 'grid',
            id: 'accounttab',
            height: 700,
            loadMask: true,
            border: false,
            store: Store,
            autoExpandColumn: 'descrcol',
            plugins: [ Edit ],
            sm: AccModel,
            cm: new Ext.grid.ColumnModel({
                columns: [ AccModel, Edit, {
                    header: 'ID',
                    dataIndex: 'recordid',
                    width: 60
                }, {
                    header: Ext.app.Localize.get('Linked') + ' (' + Ext.app.Localize.get('Account login') + ')',
                    dataIndex: 'ownerdescr',
                    width: 200
                }, {
                    header: Ext.app.Localize.get('Attribute'),
                    dataIndex: 'dictname',
                    width: 200
                }, {
                    header: 'RADIUS Code',
                    dataIndex: 'radiuscode',
                    width: 120,
                    renderer: function(value) {
                        switch(value) {
                            case 2: return 'Access-Acept';
                            case 3: return 'Access-Reject';
                            default: return value;
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'description',
                    id: 'descrcol'
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: PAGELIMIT,
                store: Store,
                displayInfo: true,
                items: ['-', {
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: PAGELIMIT,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['100'],
                            ['500']
                        ],
                        fields: ['id']
                    }),
                    listeners: {
                        select: function(){
                            this.ownerCt.pageSize = PAGELIMIT = this.getValue() * 1;
                            Store.reload({ params: { limit: this.ownerCt.pageSize } });
                        }
                    }
                }]
            })
        }]
    });

    Edit.on('action', function(grid, record, rowIndex, e){
        AttributeForm({
            edit: true,
            record: record,
            success: function(){
                this.store.reload({
                    params: {
                        start: 0,
                        limit: !Ext.isDefined(grid.store.baseParams['limit']) ? PAGELIMIT : grid.store.baseParams['limit']
                    }
                })
            }.createDelegate(grid)
        })
    });
} // end showRADIUSAttributes()


/**
 * Show Window widget with form to create new attribute or edit existing
 * If need to edit attribute record than there must be object data with:
 *         record: record data object
 *         success: optional function to execute on success save
 * @param    object
 */
function AttributeForm(save)
{
    var save = save || {
        edit: false,
        record: {},
        success: function(){ }
    };

    if(!Ext.isDefined(save.record['data'])) {
        save.edit = false;
    }

    var attrEditWin = new Ext.Window({
        title: Ext.app.Localize.get('Attribute'),
        modal: true,
        layout:'fit',
        width: 500,
        height: 475,
        border:false,
        listeners: {
            beforeclose: function(){
                if(Ext.isIE){
                    this.items.first().remove(this.items.first().findById('attrlinking'));
                }
            }
        },
        items: [{
            xtype: 'form',
            id: 'attrform',
            border:false,
            frame:true,
            labelWidth:90,
            monitorValid: true,
            buttonAlign: 'center',
            listeners: {
                afterrender: function() {
                    if(save.edit) {
                        this.findById('attrdescr').setValue(save.record.data.description);
                        this.findById('radiuscode').setValue(save.record.data.radiuscode);
                        this.findById('attrvalue').setValue(save.record.data.value);
                        Ext.getCmp('devgrpcombo')[save.record.data.devgroupid > 0 ? "enable" : "disable"]();
                    }
                },
                onRender: function() {
                    this.getForm().waitMsgTarget = this.getEl();
                }
            },
            buttons: [
                {
                    xtype: 'button',
                    text: Ext.app.Localize.get('Save'),
                    formBind: true,
                    handler: function() {
                        this.ownerCt.ownerCt.getForm().submit({
                            url: 'config.php',
                            method:'POST',
                            waitTitle: Ext.app.Localize.get('Connecting'),
                            waitMsg: Ext.app.Localize.get('Sending data') + '...',
                            scope: {
                                window: this.ownerCt.ownerCt.ownerCt
                            },
                            success: function(form, action) {
                                var O = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
                                    if(Ext.isFunction(this.success)) {
                                        if (save.store)
                                            save.store.reload();
                                        else save.record.store.reload();
                                        this.success();
                                    }
                                }.createDelegate(save));
                                this.window.close();
                            },
                            failure: function(form, action) {
                                var O = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), O.errors.reason, function(){});
                            }
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: Ext.app.Localize.get('Cancel'),
                    handler: function() {
                        this.ownerCt.ownerCt.ownerCt.close();
                    }
                }
            ],
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 399 },
                { xtype: 'hidden', name: 'saveattribute', value: save.edit ? save.record.data.recordid : 0 },
				{ xtype: 'hidden', name: 'remulateonnaid', id: 'remulateonnaid', value: 0 },
                {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Description'),
                    id: 'attrdescr',
                    name: 'description',
                    allowBlank: false,
                    anchor:'-12'
                },
                {
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Module'),
                    id: 'modulecombo',
                    anchor:'-12',

                    displayField: 'descr',
                    valueField: 'id',
                    hiddenName: 'module',

                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    forceSelection:true,

                    editable: false,
                    allowBlank: false,

                    tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.descr, 36)]}</div></tpl>',
                    listeners: {
                        afterrender: function(combo){
                            combo.getStore().load();
                        },
                        select: function(combo, record) {
                            /**
                             * Activate needed fields
                             */
                            Ext.getCmp('nascombo').enable();
                            Ext.getCmp('radiuscode').enable();
                            Ext.getCmp('diccombo').enable();
                            //Ext.getCmp('tagged').enable();
							
							if(record.get('remulateonnaid') > 0) {
								Ext.getCmp('remulateonnaid').setValue(record.get('remulateonnaid'));	
							} else {
								Ext.getCmp('remulateonnaid').setValue(record.get('id'));
							}
							
                            /**
                             * Load nas combo data store
                             */
                            Ext.getCmp('nascombo').store.reload({ params: { module: this.getValue() } });

                            Ext.getCmp('devgrpcombo').store.reload({ params: { getdevgroups: this.getValue() } });
                            this.ownerCt.findById('tarcombo').store.reload({ params: { gettariffs: this.getValue() } });
                        }
                    },
                    store: new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({url: 'config.php',method: 'POST'}),
                        reader: new Ext.data.JsonReader(
                            {root: 'results'},
                            [
                                { name: 'id', type: 'int' },
                                { name: 'descr', type: 'string' },
								{ name: 'remulateonnaid', type: 'int' }
                            ]
                        ),
                        autoLoad: false,
                        baseParams: { async_call: 1, devision: 399, getmodules: 1 },
                        sortInfo: {
                            field: 'id',
                            direction: "ASC"
                        },
                        listeners: {
                            load: function(store) {
                                if(save.edit) {
                                    Ext.getCmp('nascombo').store.reload({
                                        params: {
                                            module: this.record.data.agentid
                                        }
                                    });
                                    Ext.getCmp('devgrpcombo').store.reload({
                                        params: {
                                            getdevgroups: this.record.data.agentid
                                        }
                                    });
                                    Ext.getCmp('tarcombo').store.reload({
                                        params: {
                                            gettariffs: this.record.data.agentid
                                        }
                                    });
                                    Ext.getCmp('modulecombo').setValue(this.record.data.agentid);
                                }
                            }.createDelegate(save)
                        }
                    })
                },
                {
                    xtype: 'container',
                    fieldLabel: 'NAS',
                    layout: 'hbox',
                    anchor:'-12',
                    items: [
                    {
                        xtype: 'combo',
                        id: 'nascombo',
                        fieldLabel: Ext.app.Localize.get('NAS'),

                        //width: 180,
                        disabled: (save.edit) ? false : true,

                        displayField: 'ip',
                        valueField: 'nasid',
                        hiddenName: 'nasid',

                        forceSelection:true,
                        enableKeyEvents:true,
                        resizable:true,
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        //value: '0',
                        tpl: '<tpl for="."><div class="x-combo-list-item">{ip}</div></tpl>',
                        itemSelector: 'div.x-combo-list-item',
                        //emptyText: Ext.app.Localize.get('All'),
                        loadingText: Ext.app.Localize.get('Receiving NAS list...'),
                        selectOnFocus:true,
                        store: new Ext.data.Store({
                            id: 'nasList',
                            name: 'nasList',
                            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
                            reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total', id: 'nasid' },
                                [
                                    { name: 'nasid', type: 'int'},
                                    {
                                        name: 'ip',
                                        type: 'string',
                                        // Для корректной сортировки по IP. Добиваем октет нулями и сортируем.
                                        sortType: function(v) {
                                            var parts = String(v).split('.');
                                            for(var i = 0, len = parts.length; i < len; i++){
                                                parts[i] = String.leftPad(parts[i], 3, '0');
                                            }
                                            return parts.join('.');
                                        }
                                    }
                                ]
                            ),
                            autoLoad: false,
                            baseParams:{ async_call: 1, devision: 1, getRnas: 1, alldata: 1 },
                            listeners: {
                                load: function(store) {
                                    store.insert(0, new store.recordType({
                                        nasid: '0',
                                        ip: "" + Ext.app.Localize.get('All').toString() + ""
                                    }));
                                    store.insert(0, new store.recordType({
                                        nasid: -1,
                                        ip: Ext.app.Localize.get('Group').toString()
                                    }));

                                    /*else{
                                        $this.setValue(-1);
                                    }*/

                                    var nas;
                                    if ((nas = Ext.getCmp('nascombo'))) {
                                        if (save.edit) {
                                            nas.setValue(save.record.data.nasid);
                                        }
                                        else {
                                            if (Ext.isEmpty(nas.getValue()) || nas.getValue() < 1) {
                                                //nas.setValue(0);
                                                // save.record.data.devgroupid
                                            }
                                        }
                                        Ext.getCmp('diccombo').store.reload({
                                            params: {
                                                getdictionary: nas.getValue()
                                            }
                                        });
                                    }
									
                                    if (!Ext.isEmpty(save.record.data) && save.record.data.devgroupid > 0){
                                        Ext.getCmp('nascombo').setValue(-1);
                                    }

                                }
                            },
                            sortInfo: {
                                field: 'ip',
                                direction: 'ASC'
                            }
                        }),
                        listeners: {
                            beforerender: function(combo){
                                combo.store.on('load', function(store){
                                    if (store.getCount()>0){
                                        var idx;
                                        if ((idx = store.find('nasid',this.data.nasid)) > -1){
                                            this.combo.setValue(this.data.nasid);
                                        }
                                    }
                                },{combo:combo,data:save.record});
                                combo.getStore().load();
                            }.createDelegate({data: save.record}),

                            // repair raw value after blur
                            blur:function() {
                                //var val = this.getRawValue();
                                //this.setRawValue.defer(1, this, [val]);
                            },

                            render:function() {
                                this.validate();
                            },

                            select: function(combo, record, index) {
                                //this.setRawValue(record.get('ip'));
                                if (combo.getValue() >= -1) {
                                    Ext.getCmp('devgrpcombo').clearInvalid();
									combo.ownerCt.ownerCt.findById('diccombo').enable();  // Выключение disabled Diccombo при смене nascombo from -1 to >-1
                                    combo.ownerCt.ownerCt.findById('diccombo').store.reload({
                                        params: {
                                            getdictionary: combo.getValue()
                                        }
                                    });
                                } else {
                                    combo.ownerCt.ownerCt.findById('diccombo').store.removeAll();
                                    combo.ownerCt.ownerCt.findById('diccombo').clearValue();
                                    combo.ownerCt.ownerCt.findById('diccombo').disable();

                                    Ext.getCmp('devgrpcombo').clearInvalid();
                                    Ext.getCmp('devgrpcombo').enable();
                                    Ext.getCmp('devgrpcombo').store.reload({ params: { getdevgroups: this.getValue() } });
                                }
                                combo.ownerCt.get(2)[combo.getValue() > -1 ? 'disable' : 'enable']();
                            }

                        }
                    },
                    { xtype: 'tbspacer', width: 5 },
                    {
                        xtype: 'combo',
                        id: 'devgrpcombo',
                        hiddenName: 'devgroupid',
                        valueField: 'groupid',
                        displayField: 'name',
                        mode: 'local',
                        triggerAction: 'all',
                        disabled: function(){
                            return (Ext.getCmp('nascombo').getValue()) ? true : false;
                        },
                        allowBlank: false,

                        flex: 1,

                        forceSelection:true,
                        enableKeyEvents:true,
                        resizable:true,
                        typeAhead: true,
                        editable: false,
                        //value: 0,
                        tpl: '<tpl for="."><div class="x-combo-list-item">{name}</div></tpl>',
                        itemSelector: 'div.x-combo-list-item',
                        emptyText: Ext.app.Localize.get('...'),
                        loadingText: Ext.app.Localize.get('Receiving groups list...'),
                        selectOnFocus:true,

                        listeners: {
                            beforerender: function(combo){
                                if (save.edit) {
                                    combo.store.on('load', function(store){
                                        if (store.getCount()>0){
                                            var idx;
                                            if ((idx = store.find('devgroupid',this.data.devgroupid)) > 0){
                                                this.combo.setValue(this.data.devgroupid);
                                            }
                                        }
                                    },{combo:combo,data:save.record});
                                    combo.getStore().load();
                                }
                            }.createDelegate({data: save.record}),

                            //render: function(combo){
                            //
                            //    combo.store.on('load', function(store){
                            //        if(this.edit) {
                            //            this.combo.setValue(this.record.data.devgroupid);
                            //        }
                            //        else {
                            //            this.combo.setValue(0);
                            //        }
                            //    }, {
                            //        edit: save.edit,
                            //        record: save.record,
                            //        combo: combo
                            //    });
                            //},
                            select: function(){
                                Ext.getCmp('diccombo').store.reload({
                                    params: {
                                        getdictionary: this.getValue()
                                    }
                                });
                                Ext.getCmp('diccombo').enable();
                            }
                        },
                        store: {
                            xtype: 'jsonstore',
                            timeoute: 380000,
                            url: 'config.php',
                            root: 'results',
                            fields: [
                                { name: 'groupid', type: 'int' },
                                { name: 'name', type: 'string' },
                                { name: 'desc', type: 'string' }
                            ],
                            autoLoad: false,
                            baseParams: { async_call: 1, devision: 399, getdevgroups: 0 },

                            listeners: {
                                load: function(store) {
                                    if (!Ext.isEmpty(save.record.data) && save.record.data.devgroupid > 0)
                                        Ext.getCmp('devgrpcombo').setValue(save.record.data.devgroupid);
                                }
                            }

                        }
                    }
                ]
            },
            {
                xtype: 'combo',
                id: 'radiuscode',
                hiddenName: 'radcode',
                fieldLabel: 'RADIUS Code',
                anchor:'-12',
                disabled: (save.edit) ? false : true,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                value: 2,
                triggerAction: 'all',
                editable: false,
                allowBlank: false,
                store: new Ext.data.ArrayStore({
                    fields: ['id', 'name'],
                    data: [ ['2', 'Access-Accept'], ['3', 'Access-Reject'] ]
                })
            },
            {
                xtype: 'container',
                layout: 'hbox',
                anchor: '-12',
                fieldLabel: Ext.app.Localize.get('Attribute'),
                pack: 'end',
                items: [
                    {
                        xtype: 'combo',
                        id: 'diccombo',
                        hiddenName: 'attrid',
                        width: 250,
                        disabled: (save.edit) ? false : true,
                        displayField: 'name',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 36)]} ({values.radiustype}, {values.type})</div></tpl>',
                        store: new Ext.data.Store({
                            autoLoad: false, //save.edit ? false : true,
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader(
                                {root: 'results'},
                                [
                                    { name: 'id', type: 'int' },
                                    { name: 'name', type: 'string' },
                                    { name: 'radiustype', type: 'string' },
                                    { name: 'type', type: 'string' },
                                    { name: 'tagged', type: 'int' }
                                ]
                            ),
                            baseParams: {
                                async_call: 1,
                                devision: 399,
                                getdictionary: 0
                            },
                            sortInfo: {
                                field: 'id',
                                direction: "ASC"
                            },
                            listeners: {
                                load: function(store) {
                                    if (save.edit) {
                                        Ext.getCmp('diccombo').setValue(save.record.data.attrid);
                                        if (store.getById(save.record.data.attrid).data.tagged) Ext.getCmp('tagged').enable();
                                    }
                                    else {
                                        if (Ext.getCmp('diccombo').getValue() < 1) {
                                            if (store.data.length > 0) {
                                                Ext.getCmp('diccombo').setValue(store.data.first().data.id);
                                            }
                                        }
                                    }
                                }
                            }
                        }),
                        listeners: {
                            afterrender: function(combo){
                                if (save.edit) {this.enable();}
                            },
                            select: function(combo, record, index) {
                                if (record.data.tagged == 1) {
                                    Ext.getCmp('tagged').enable();
                                }else{
                                    Ext.getCmp('tagged').disable();
                                    Ext.getCmp('tagged').setValue(0);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'tagged',
                        id: 'tagged',
                        width: 100,
                        disabled: (save.edit && save.record.data.tag > 0) ? false : true,
                        maskRe: new RegExp("[0-9]"),
                        style: 'margin-left:4px',
                        value: save.edit ? save.record.data.tag : 0
                    }
                ]
            },
            {
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Value'),
                id: 'attrvalue',
                name: 'attrvalue',
                anchor: '-12',
                height: 80
            },
            {
                xtype: 'container',
                //anchor: '-24',
                autoEl: 'div',
                id: 'attrlinking',
                fieldLabel: Ext.app.Localize.get('Linked'),
                items: {
                    xtype: 'container',
                    layout: 'table',
                    anchor: '100%',
                    layoutConfig: {
                        columns: 3,
                        tableAttrs: {
                            style: {
                                width: Ext.isIE ? 385 : '100%',
                                height: 177
                            }
                        }
                    },
                    items: [{
                        xtype: 'radio',
                        name: 'link',
                        inputValue: 1,
                        checked: (!save.edit || (save.edit && save.record.data.groupid == 0 && save.record.data.tarid == 0 && save.record.data.vgid < 1 && save.record.data.shape < 1)) ? true : false,
                        style: {
                            marginTop: '4px'
                        }
                    }, {
                        html: '<p>' + Ext.app.Localize.get('Module') + '</p>'
                    }, {
                        xtype: 'container',
                        width: 230,
                        items: [{
                            xtype: 'checkbox',
                            name: 'serviceforlist',
                            boxLabel: Ext.app.Localize.get('List'),
                            checked: save.edit ? (save.record.get('serviceforlist') ? true : false) : false
                        }, {
                            xtype: 'textfield',
                            name: 'service',
                            width: 230,
                            value: save.edit ? save.record.get('service') : '',
                            style: 'margin-top:6px'
                        }]
                    }, {
                        xtype: 'radio',
                        name: 'link',
                        inputValue: 2,
                        checked: (save.edit && save.record.data.groupid > 0) ? true : false,
                        style: {
                            marginTop: '4px'
                        }
                    }, {
                        html: '<span>' + Ext.app.Localize.get('Union') + '</span>'
                    }, {
                        xtype: 'combo',
                        id: 'unioncombo',
                        width: 230,
                        displayField: 'name',
                        valueField: 'id',
                        hiddenName: 'groupid',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader({
                                root: 'results'
                            }, [
                                { name: 'id', type: 'int' },
                                { name: 'name', type: 'string' }
                            ]),
                            autoLoad: true,
                            baseParams: {
                                async_call: 1,
                                devision: 399,
                                getunions: 1
                            },
                            sortInfo: {
                                field: 'id',
                                direction: "ASC"
                            },
                            listeners: {
                                load: function() {
                                    if(save.edit && save.record.data.groupid > 0) {
                                        Ext.getCmp('unioncombo').setValue(save.record.data.groupid);
                                    }
                                }
                            }
                        })
                    }, {
                        xtype: 'radio',
                        name: 'link',
                        inputValue: 3,
                        checked: (save.edit && save.record.data.tarid > 0) ? true : false,
                        style: {
                            marginTop: '4px'
                        }
                    }, {
                        html: '<span>' + Ext.app.Localize.get('Tarif') + '</span>'
                    }, {
                        xtype: 'combo',
                        id: 'tarcombo',
                        width: 230,
                        hiddenName: 'tarid',
                        displayField: 'name',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]} {[(values.id > 0) ? "(" + values.symbol + ")" : "" ]}</div></tpl>',
                        listeners: {
                            select: function() {
                                var F = this.ownerCt.ownerCt.ownerCt;
                                F.findById('catcombo').store.reload({ params: { getcategories: this.getValue() } });
                            }
                        },
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader({
                                root: 'results'
                            }, [
                                { name: 'id', type: 'int' },
                                { name: 'name', type: 'string' },
                                { name: 'symbol', type: 'string' }
                            ]),
                            baseParams: {
                                async_call: 1,
                                devision: 399,
                                gettariffs: 0
                            },
                            sortInfo: {
                                field: 'id',
                                direction: "ASC"
                            },
                            listeners: {
                                load: function() {
                                    if(save.edit && save.record.data.tarid > 0) {
                                        Ext.getCmp('tarcombo').setValue(save.record.data.tarid);
                                        Ext.getCmp('catcombo').store.reload({ params: { getcategories: save.record.data.tarid } });
                                    }
                                }
                            }
                        })
                    }, {
                        html: '&nbsp;',
                        width: 20
                    }, {
                        html: '<span>' + Ext.app.Localize.get('Category') + '</span>',
                        width: 100
                    }, {
                        xtype: 'combo',
                        id: 'catcombo',
                        hiddenName: 'catidx',
                        width: 230,
                        displayField: 'descr',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.descr, 32)]}</div></tpl>',
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader({
                                root: 'results'
                            }, [
                                { name: 'id', type: 'int' },
                                { name: 'descr', type: 'string' }
                            ]),
                            baseParams: {
                                async_call: 1,
                                devision: 399,
                                getcategories: 0
                            },
                            sortInfo: {
                                field: 'id',
                                direction: "ASC"
                            },
                            listeners: {
                                load: function(store) {
                                    store.insert(0, new store.recordType({
                                        id: -1,
                                        descr: Ext.app.Localize.get('Not linked')
                                    }));

                                    if(save.edit && save.record.data.catidx >= 0) {
                                        Ext.getCmp('catcombo').setValue(save.record.data.catidx);
                                    }
                                }
                            }
                        })
                    }, {
                        xtype: 'radio',
                        name: 'link',
                        inputValue: 4,
                        checked: (save.edit && save.record.data.vgid > 0) ? true : false,
                        style: {
                            marginTop: '4px'
                        }
                    }, {
                        html: '<span>' + Ext.app.Localize.get('Account') + '</span>'
                    }, {
                        xtype: 'container',
                        items: [{
                            xtype: 'hidden',
                            id: 'vgidinput',
                            name: 'vgid',
                            value: save.edit ? save.record.data.vgid : 0
                        }, {
                            html: '<a href="#" onclick="showAccounts({ filter: { getvgroups: Ext.getCmp(\'remulateonnaid\').getValue() }, callbackok: function(grid){ var record = grid.getSelectionModel().getSelected() || false; if(record){ var F = Ext.getCmp(' + '\'' + 'attrform' + '\'' + '); F.findById(' + '\'' + 'vgidinput' + '\'' + ').setValue(record.data.vgid); this.scope.innerHTML = record.data.login; } }, scope: this })">' + ((save.edit && save.record.data.vgid > 0) ? save.record.data.ownerdescr : Ext.app.Localize.get('Undefined')) + '</a>'
                        }]
                    }, {
                        xtype: 'radio',
                        name: 'link',
                        inputValue: 5,
                        checked: (save.edit && save.record.data.shape > 0) ? true : false,
                        style: {
                            marginTop: '4px'
                        }
                    }, {
                        html: '<span>' + Ext.app.Localize.get('Shape') + '</span>'
                    }, {
                        xtype: 'textfield',
                        name: 'shape',
                        value: save.edit ? save.record.data.shape : 0,
                        width: 100
                    }]
                }
            }]
        }]
    });

    attrEditWin.show();
} // end AttributeForm()
