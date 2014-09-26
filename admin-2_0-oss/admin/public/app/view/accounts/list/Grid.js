/**
 * Таблица учетных записей
 */
Ext.define('OSS.view.accounts.list.Grid', {
    extend: 'Ext.panel.Panel', 
    region: 'center', 
    layout: 'card', 
    itemId: 'wrap',
    plain: true,
    border: false,
    initComponent: function() {
        this.items = [{
            xtype: 'grid',
            itemId: 'accounts',
            border: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", { checkOnly: true }),
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: i18n.get('Actions'),
                    itemId: 'actions',
                    menu: [{
                        itemId: 'create',
                        text: i18n.get('Create account entry')
                    }, {
                        text: i18n.get('Blocks'),
                        itemId: 'status',
                        menu: [{
                            itemId: 'turn_off',
                            text: i18n.get('Turn off')
                        }, {
                            itemId: 'turn_on',
                            text: i18n.get('Turn on')
                        }]
                    }, {
                        text: i18n.get('Remove selected'),
                        itemId: 'remove-accounts'
                    }, '-', {
                        text: i18n.get('Account entry templates'),
                        hidden: true,
                        itemId: 'templates'
                    }]
                }, { 
                    xtype: 'tbseparator'
                }, {
                    xtype: 'combo',
                    name: 'agent_type',
                    itemId: 'agentTypeCmb',
                    width: 140,
                    value: 0,
                    store: [
                        [0, i18n.get('All')],
                        [1, i18n.get('Leased line')],
                        [2, i18n.get('Telephony')],
                        [3, i18n.get('IP') + ' ' + i18n.get('Telephony')],
                        [4, i18n.get('Services')]
                    ]
                }, {
                    xtype: 'combo',
                    name: 'property',
                    displayField: 'name',
                    valueField: 'id',
                    width: 170,
                    queryMode: 'local',
                    value: 'login',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            { name: 'id', type: 'string' },
                            { name: 'name', type: 'string' }
                        ],
                        data: [{
                            id: 'name',
                            name: i18n.get('Person full name')
                        }, {
                            id: 'agrm_num',
                            name: i18n.get('Agreement')
                        }, {
                            id: 'pay_code',
                            name: i18n.get('Paycode')
                        }, {
                            id: 'login',
                            name: i18n.get('Login')
                        }, {
                            id: 'ip',
                            name: i18n.get('IP address')
                        }, {
                            id: 'phone',
                            name: i18n.get('Phone')
                        }, {
                            id: 'descr',
                            name: i18n.get('Description')
                        }, {
                            id: 'address',
                            name: i18n.get('Address')
                        }, {
                            id: 'card_key',
                            name: i18n.get('Smartcard serial')
                        }, {
                            id: 'equip_serial',
                            name: i18n.get('Equipment serial')
                        }, {
                            id: 'equip_mac',
                            name: i18n.get('Equipment MAC-address')
                        }, {
                            id: 'equip_chipid',
                            name: i18n.get('Equipment ChipID')
                        }]
                    })
                }, {
                    xtype: 'searchtext',
                    itemId: 'search',
                    width: 210,
                    parentContainerType: 'toolbar',
                    searchButton: 'find'
                }, {
                    xtype: 'find'
                }]
            }, {
                xtype: 'pagingtoolbar', 
                store: 'Accounts',
                dock: 'bottom'
            }],
            store: 'Accounts',
            columns:[{
                itemId: 'edit',
                width: 20,
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get('Edit'),
                iconCls: 'x-ibtn-def x-ibtn-edit'
            }, {
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get( 'Payments' ), 
                itemId: 'payments',
                iconCls: 'x-ibtn-def x-ibtn-money',
                width: 20
            }, {
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get( 'Rent charges' ), 
                itemId: 'rent_charges',
                iconCls: 'x-ibtn-def x-ibtn-chart',
                width: 20
            }, {
                header: i18n.get('Login'),
                dataIndex: 'login'
            }, {
                header: i18n.get('CC card'),
                itemId: 'ccard',
                dataIndex: 'cu_id',
                hidden: true
            }, {
                header: i18n.get('Agreement'),
                dataIndex: 'agrm_num',
                flex: 1
            }, {
                header: i18n.get('Balance'),
                dataIndex: 'balance',
                renderer: function(value, meta, record) {
                    if (value < 0) {
                        meta.style += 'color:red;';
                    }
                    return Ext.String.format('{0} {1}', Ext.util.Format.number(value, '0.00'), record.get('symbol'));
                }
            }, {
                header: i18n.get('Promised payment'),
                dataIndex: 'pp_debt',
                hidden: true,
                renderer: function(value, meta, record) {
                    return Ext.String.format('{0} {1}', Ext.util.Format.number(value, '0.00'), record.get('symbol'));
                }
            }, {
                header: i18n.get('Creation date'),
                hidden: true,
                dataIndex: 'creation_date',
                renderer: function(value) {
                    return Ext.Date.format(value, 'd.m.Y H:i');
                }
            }, {
                header: i18n.get('Date to turn on'),
                dataIndex: 'block_date',
                renderer: function(value) {
                    if (Ext.isEmpty(value) || Ext.Date.format(value, 'Y') <= 1900) {
                        return '-';
                    }
                    return Ext.Date.format(value, 'd.m.Y H:i');
                }
            }, {
                header: i18n.get('Date to turn off'),
                dataIndex: 'acc_off_date',
                renderer: function(value) {
                    if (Ext.isEmpty(value) || Ext.Date.format(value, 'Y') <= 1900) {
                        return '-';
                    }
                    return Ext.Date.format(value, 'd.m.Y H:i');
                }
            }, {
                dataIndex: 'blocked',
                renderer: function(value, metaData) {
                    var type;
                    if (value) {
                        metaData.tdCls = 'x-ibtn-def x-ibtn-user-blocked';
                    } else {
                        metaData.tdCls = 'x-ibtn-def x-ibtn-user';
                    }
                    switch (value) {
                        case 1:
                        case 4:
                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by balance') + ' (' + i18n.get('Blocking') + ': ' + value + ')"';
                            type = i18n.get('B');
                            break;

                        case 10:
                            metaData.tdAttr = 'data-qtip="' + i18n.get('Turned off') + ' (' + i18n.get('Blocking') + ': ' + value + ')"';
                            type = 'O';
                            break;

                        case 3:
                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by manager') + ' (' + i18n.get('Blocking') + ': ' + value + ')"';
                            type = 'A';
                            break;

                        case 5:
                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by traffic') + ' (' + i18n.get('Blocking') + ': ' + value + ')"';
                            type = 'T';
                            break;

                        case 2:
                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by user') + ' (' + i18n.get('Blocking') + ': ' + value + ')"';
                            type = i18n.get('U');
                            break;
                    }
                    return '&nbsp;&nbsp;&nbsp;' + (type || '');
                }
            }, {
                header: OSS.Localize.get('Date'),
                tooltip: OSS.Localize.get('Date state was changed'),
                dataIndex: 'blockdate',
                width: 105,
                renderer: function(value) {
                    return Ext.Date.format(value, 'd.m.Y H:i');
                }
            }, {
                header: i18n.get('Tariff'),
                dataIndex: 'tar_name',
                flex: 2
            }]
        }];
        this.callParent(arguments);
    }
});
