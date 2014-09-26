Ext.define('OSS.view.accounts.item.Networking', {
    extend: 'Ext.panel.Panel',

    layout: {
        type: 'fit'
    },
    itemId: 'networking',
    title: i18n.get('Network settings'),

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'container',
                itemId: 'mainCnt',
                layout: {
                    type: 'border'
                },
                items: [{
                    xtype: 'panel',
                    itemId: 'leftPanel',
                    minWidth: 320,
                    width: '25%',
                    activeItem: 0,
                    layout: {
                        type: 'card'
                    },
                    title: '',
                    region: 'west',
                    split: true,
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            xtype: 'back'
                        }, '-', {
                            xtype: 'button',
                            itemId: 'ipBtn',
                            text: i18n.get('IP address')
                        },
                        {
                            xtype: 'button',
                            itemId: 'macBtn',
                            text: i18n.get('MAC address')
                        },
                        {
                            xtype: 'button',
                            itemId: 'lasBtn',
                            text: i18n.get('Local autonomous system')
                        }]
                    }],
                    items: [
            /* First item: IP addresses form */
                    {
                        xtype: 'form',
                        title: i18n.get('IP address'),
                        layout: 'anchor',
                        items: [{
                            xtype: 'fieldset',
                            margin: 3,
                            defaults: {
                                anchor: '100%'
                            },
                            title: '',
                            items: [{
                                xtype: 'checkboxfield',
                                fieldLabel: '',
                                name: 'broadcast',
                                boxLabel: i18n.get('Exlude broadcast')
                            },
                            {
                                xtype: 'fieldcontainer',
                                defaults: {
                                    anchor: '100%'
                                },
                                layout: {
                                    type: 'anchor'
                                },
                                fieldLabel: i18n.get('Network'),
                                labelWidth: 70,
                                items: [{
                                    xtype: 'combo',
                                    fieldLabel: '',
                                    itemId: 'segmentsListCmb',
                                    name: 'segment_ip',
                                    displayField: 'ip',
                                    editable: false,
                                    valueField: 'ip',
                                    tpl: '<tpl for="."><div class="x-boundlist-item">{ip}/{masknum}</div></tpl>',
                                    store: 'agents.internet.NetworkManagement'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    defaults: {
                                        margin: '0 5 0 0'
                                    },
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    fieldLabel: i18n.get('Calculate by mask'),
                                    labelAlign: 'top',
                                    items: [{
                                        xtype: 'combobox',
                                        fieldLabel: '',
                                        labelAlign: 'top',
                                        value: 32,
                                        name: 'mask',
                                        editable: false,
                                        valueField: 'ip',
                                        displayField: 'value',
                                        store: 'accounts.Masks'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'x-ibtn-calculator',
                                        itemId: 'calcBtn'
                                    }]
                                }]
                            }]
                        },
                        {
                            xtype: 'gridpanel',
                            title: i18n.get('Available addresses'),
                            anchor: '100% -130',
                            itemId: 'availableGrid',
                            dockedItems: [{
                                xtype: 'toolbar', 
                                dock: 'top',
                                items: [{
                                    xtype: 'button',
                                    itemId: 'addSelectedBtn',
                                    text: i18n.get('Add selected'),
                                    iconCls: 'x-ibtn-add'
                                }]                            
                            },{
                                xtype: 'pagingtoolbar',
                                dock: 'bottom',
                                store: 'accounts.FreeNetworks'
                            }],
                            columns: [{
                                dataIndex: 'ip',
                                flex: 1,
                                text: i18n.get('Address')
                            },
                            {
                                dataIndex: 'mask',
                                text: i18n.get('Mask')
                            }],
                            store: 'accounts.FreeNetworks',
                            selType: 'rowmodel',
                            selModel: Ext.create('Ext.selection.CheckboxModel', {
                                mode: 'MULTI'
                            })
                        }]
                    },
                /* Second item: MAC addresses */
                    {
                        xtype: 'form',
                        title: i18n.get('MAC address'),
                        layout: 'anchor',
                        dockedItems: [{
                            xtype: 'toolbar', 
                            dock: 'top',
                            items: [{
                                xtype: 'button',
                                itemId: 'addMacBtn',
                                text: i18n.get('Add'),
                                iconCls: 'x-ibtn-add'
                            }]                            
                        }],
                        items: [{
                            xtype: 'fieldset',
                            margin: 3,
                            defaults: {
                                anchor: '100%',
                                labelWidth: 110
                            },
                            title: '',
                            items: [{
                                xtype: 'textfield',
                                name: 'macaddress',
                                fieldLabel: i18n.get('MAC address')
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    xtype: 'checkboxfield',
                                    fieldLabel: '',
                                    itemId: 'linkWithIP',
                                    width: 110,
                                    boxLabel: i18n.get('Link with IP')
                                },{
                                    xtype: 'tbspacer',
                                    width: 5
                                }, {
                                    xtype: 'ipcombo',
                                    disabled: true,
                                    name: 'ipaddress',
                                    itemId: 'IPComboList'
                                }]
                            }]
                        }]
                    },
                /* Third item: Local automatic system */
                    {
                        xtype: 'form',
                        title: i18n.get('Local autonomous system'),
                        layout: 'anchor',
                        dockedItems: [{
                            xtype: 'toolbar', 
                            dock: 'top',
                            items: [{
                                xtype: 'button',
                                itemId: 'addNumBtn',
                                text: i18n.get('Add'),
                                iconCls: 'x-ibtn-add'
                            }]                            
                        }],
                        items: [{
                            xtype: 'fieldset',
                            margin: 3,
                            items: [{
                                xtype: 'textfield',
                                anchor: '100%',
                                flex: 1,
                                name: 'as_num',
                                fieldLabel: i18n.get('Number')
                            }]
                        }]
                    }]
                },
                {
                    xtype: 'container',
                    activeItem: 0,
                    itemId: 'rightPanel',
                    layout: {
                        type: 'card'
                    },
                    region: 'center',
                    items: [
                    /* IP ADDRESSES */
                    {
                        xtype: 'gridpanel',
                        title: i18n.get('Assigned addresses'),
                        itemId: 'assignedGrid',
                        dockedItems: [{
                            xtype: 'toolbar', 
                            dock: 'top',
                            items: [{
                                xtype: 'button',
                                itemId: 'removeIP',
                                text: i18n.get('Remove selected'),
                                iconCls: 'x-ibtn-remove'
                            }]                            
                        },{
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            store: 'accounts.Networks'
                        }],
                        store: 'accounts.Networks',
                        columns: [{
                            dataIndex: 'network',
                            flex: 1,
                            text: i18n.get('IP address')
                        }, {
                            dataIndex: 'masknum',
                            width: 80,
                            text: i18n.get('Mask')
                        }],
                        selType: 'rowmodel',
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            mode: 'MULTI'
                        })
                    }, 
                    /* MAC ADDRESSES */
                    {
                        xtype: 'gridpanel',
                        title: i18n.get('MAC addresses'),
                        itemId: 'macsGrid',
                        dockedItems: [{
                            xtype: 'toolbar', 
                            dock: 'top',
                            items: [{
                                xtype: 'button',
                                itemId: 'removeMAC',
                                text: i18n.get('Remove selected'),
                                iconCls: 'x-ibtn-remove'
                            }]                            
                        },{
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            store: 'accounts.MacAddresses'
                        }],
                        columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'mac',
                            flex: 1,
                            text: i18n.get('MAC address')
                        }, {
                            xtype: 'gridcolumn',
                            dataIndex: 'network',
                            flex: 1,
                            text: i18n.get('IP address')
                        }],
                        store: 'accounts.MacAddresses',
                        selType: 'rowmodel',
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            mode: 'MULTI'
                        })
                    },
                    /* IP ADDRESSES */
                    {
                        xtype: 'gridpanel',
                        title: i18n.get('Local autonomous system'),
                        itemId: 'numbersGrid',
                        dockedItems: [{
                            xtype: 'toolbar', 
                            dock: 'top',
                            items: [{
                                xtype: 'button',
                                itemId: 'removeNumber',
                                text: i18n.get('Remove selected'),
                                iconCls: 'x-ibtn-remove'
                            }]                            
                        },{
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            store: 'accounts.ASNumbers'
                        }],
                        columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'as_num',
                            flex: 1,
                            text: i18n.get('Number')
                        }],
                        store: 'accounts.ASNumbers',
                        selType: 'rowmodel',
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            mode: 'MULTI'
                        })
                    }]
                }]
            }]
        });
        
        me.callParent(arguments);
    }

});
