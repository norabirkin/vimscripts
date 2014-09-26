Ext.define('OSS.view.AdditionalFieldsWidget', {
    extend: 'Ext.Window',
    alias: 'widget.additionalfieldswidget',
    height: 430,
    width: 710,
    activeItem: 0,
    resizable: false,
    layout: {
        type: 'card'
    },
    title: i18n.get('Additional fields'),
    config: {
        displayData: 0, // Параметр отвечает за открытую вкладку по-умолчанию.
        agrm_id: 0,
        user_id: 0,
        vg_id: 0
    },
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
        /* First panel with addons list */    
            {
                xtype: 'tabpanel',
                itemId: 'AddonsTabPanel',
                activeTab: 0,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    itemId: 'topToolbar',
                    items: [{
                        xtype: 'back',
                        itemId: 'backToAddonValuesBtn'
                    },'-',{
                        xtype: 'button',
                        itemId: 'addAddonBtn',
                        iconCls: 'x-ibtn-add',
                        text: i18n.get('Add')
                    }]
                }],
                defaults: {
                    layout: 'anchor',
                    border: false
                },
                items: [
                
                /* First tab: Users */    
                {
                    xtype: 'panel',
                    layout: 'fit',
                    title: i18n.get('Users'),
                    items: [{
                        xtype: 'gridpanel',
                        itemId: 'accountsTab',
                        store: 'addons.AddonsStaffUsers',
                        columns: [{
                            xtype: 'actioncolumn',
                            itemId: 'edit',
                            iconCls: 'x-ibtn-def x-ibtn-edit',
                            width: 26
                        }, {
                            xtype: 'gridcolumn',
                            width: 135,
                            dataIndex: 'descr',
                            text: i18n.get('Description')
                        }, {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'name',
                            text: i18n.get('Field')
                        }, {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'type',
                            text: i18n.get('Type'),
                            renderer: function (value) {
                                if(value == 0) {
                                    return i18n.get('Text');
                                } else if(value == 1) {
                                    return i18n.get('List');
                                } else {
                                    return i18n.get('Logical');
                                }
                                return value;
                            }
                        }, {
                            xtype: 'gridcolumn',
                            width: 240,
                            dataIndex: 'str_value',
                            text: i18n.get('Values')
                        }, {
                            xtype: 'actioncolumn',
                            itemId: 'delete',
                            iconCls: 'x-ibtn-def x-ibtn-delete',
                            width: 26
                        }]
                    }]
                }, 
                /* Second tab: Agreements */
                {
                    xtype: 'panel',
                    layout: 'fit',
                    title: i18n.get('Agreements'),
                    items: [{
                        xtype: 'gridpanel',
                        itemId: 'agreementsTab',
                        store: 'addons.AddonsStaffAgreements',
                        columns: [{
                            xtype: 'actioncolumn',
                            itemId: 'edit',
                            iconCls: 'x-ibtn-def x-ibtn-edit',
                            width: 26
                        }, {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'name',
                            text: i18n.get('Field')
                        }, {
                            xtype: 'gridcolumn',
                            width: 140,
                            dataIndex: 'descr',
                            text: i18n.get('Description')
                        }, {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'type',
                            text: i18n.get('Type'),
                            renderer: function (value) {
                                if(value == 0) {
                                    return i18n.get('Text');
                                } else if(value == 1) {
                                    return i18n.get('List');
                                } else {
                                    return i18n.get('Logical');
                                }
                                return value;
                            }
                        }, {
                            xtype: 'gridcolumn',
                            width: 240,
                            dataIndex: 'str_value',
                            text: i18n.get('Values')
                        }, {
                            xtype: 'actioncolumn',
                            itemId: 'delete',
                            iconCls: 'x-ibtn-def x-ibtn-delete',
                            width: 26
                        }]
                    }]
                }, 
            /* Third tab: Account entries (vgroups) */
                {
                    xtype: 'panel',
                    layout: 'fit',
                    title: i18n.get('Account entries'),
                    items: [{
                        xtype: 'gridpanel',
                        itemId: 'vgroupsTab',
                        scroll: true,
                           store: 'addons.AddonsStaffVgroups',
                        columns: [{
                            xtype: 'actioncolumn',
                            itemId: 'edit',
                            iconCls: 'x-ibtn-def x-ibtn-edit',
                            width: 26
                        }, {
                            xtype: 'gridcolumn',
                            width: 125,
                            dataIndex: 'agent_name',
                            text: i18n.get('Agent')
                        }, {
                            xtype: 'gridcolumn',
                            width: 140,
                            dataIndex: 'descr',
                            text: i18n.get('Description')
                        }, {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'name',
                            text: i18n.get('Field')
                        }, {
                            xtype: 'gridcolumn',
                            width: 95,
                            dataIndex: 'type',
                            text: i18n.get('Type'),
                            renderer: function (value) {
                                if(value == 0) {
                                    return i18n.get('Text');
                                } else if(value == 1) {
                                    return i18n.get('List');
                                } else {
                                    return i18n.get('Logical');
                                }
                                return value;
                            }
                        }, {
                            xtype: 'gridcolumn',
                            width: 156,
                            dataIndex: 'str_value',
                            text: i18n.get('Values')
                        }, {
                            xtype: 'actioncolumn',
                            itemId: 'delete',
                            iconCls: 'x-ibtn-def x-ibtn-delete',
                            width: 26
                        }]
                    }]
                }]
            }, 
        /* Second panel with addons values */
            {
                xtype: 'gridpanel',
                itemId: 'AddonsGrid',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        itemId: 'setupAddonsBtn',
                        text: i18n.get('Set up')
                    }]
                }],
                columns: [{
                    text: i18n.get('Name'),
                    width: 200,
                    dataIndex: 'name'                  
                },{
                    text: i18n.get('Description'),
                    width: 200,
                    dataIndex: 'descr'                  
                }, {
                    text: i18n.get('Value'),
                    width: 280,
                    dataIndex: 'str_value',
                    renderer: function (value, meta, record, rowIndex, colIndex) {
                        if(record.get('type') == 2) {
                            if(record.get('str_value') == 'true') {
                                return i18n.get('Yes');
                            } else {
                                return i18n.get('No');
                            }
                        } else {
                            return value;
                        }
                        
                    }
                }],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        clicksToEdit: 2,
                        saveBtnText: i18n.get( 'Update' ),
                        cancelBtnText: i18n.get( 'Cancel' )
                    })
                ]
            },     
        /* Third panel with addons editing form */    
            {
                xtype: 'panel',
                itemId: 'editingPanel',
                layout: 'anchor',
                items: [{
                    xtype: 'form',
                    itemId: 'editingForm',
                    frame: false,
                    layout: 'anchor',
                    dockedItems:[{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            xtype: 'back',
                            itemId: 'back'
                        },'-', {
                            xtype: 'button',
                            itemId: 'saveData',
                            text: i18n.get('Save'),
                            iconCls: 'x-ibtn-save'
                        }]
                    }],
                    items: [{
                        xtype: 'fieldset',
                        border: false,
                        defaultBackground: true,
                        margin: 0,
                        defaults: {
                            anchor: '100%',
                            labelWidth: 80
                        },
                        items: [{
                            xtype: 'hidden',
                            name: 'addonsType',
                            value: 0
                        }, {
                            xtype: 'textfield',
                            name: 'descr',
                            fieldLabel: i18n.get('Description')
                        }, {
                            xtype: 'textfield',
                            name: 'name',
                            fieldLabel: i18n.get('Field'),
                            allowBlank: false
                        }, {
                            xtype: 'combo',
                            itemId: 'agent',
                            fieldLabel: i18n.get('Agent'),
                            name: 'agent_id',
                            hidden: true,
                            disabled: true,
                            editable: false,
                            displayField: 'descr',
                            valueField: 'id',
                            hiddenName: 'agent_id',
                            store: 'Agents'
                        }, {
                            xtype: 'combo',
                            itemId: 'fieldType',
                            fieldLabel: i18n.get('Type'),
                            name: 'type',
                            editable: false,
                            readOnly: false,
                            hiddenName: 'type',
                            value: 0,
                            store: [
                                [0, i18n.get('Text')],
                                [1, i18n.get('List')],
                                [2, i18n.get('Logical')]
                            ]
                        }]
                    }]
                }, {
                    xtype: 'grid',
                    disabled: true,
                    scroll: true,
                    itemId: 'editingGrid',
                    dockedItems:[{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            xtype: 'button',
                            itemId: 'addParam',
                            text: i18n.get('Add'),
                            iconCls: 'x-ibtn-add'
                        }]
                    }],
                    columns: [{
                        header: i18n.get('Value'),
                        dataIndex: 'value',
                        flex: 1,
                        editor: {
                            xtype: 'textfield'
                        }
                    }, {
                        xtype: 'actioncolumn',
                        width: 27,
                        itemId: 'deleteParam',
                        dataIndex: 'idx',
                        iconCls: 'x-ibtn-def x-ibtn-delete'
                    }],
                    plugins: [
                        Ext.create('Ext.grid.plugin.RowEditing',{
                            clicksToEdit: 2,
                            saveBtnText: i18n.get( 'Update' ),
                            cancelBtnText: i18n.get( 'Cancel' )
                        })
                    ],
                    store: 'addons.ParamsGrid'
                }]
            }]
        });
        me.callParent(arguments);
    }

});
