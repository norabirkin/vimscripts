Ext.define('OSS.view.accounts.item.Locks', {
    extend: 'OSS.ux.grid.editor.Window',
    itemId: 'locks',
    toolbarClassName: 'OSS.view.accounts.item.Toolbar',
    title: i18n.get('Locks'),
    disableEdit: true,
    removeAllowed: function(record) {
        return !record.get('is_history');
    },
    initComponent: function() {
        this.winConfig = {
            title: {
                create: i18n.get('Scheduling')
            },
            editForm: [{
                xtype:'datetime',
                fieldLabel: i18n.get('Date'),
                labelWidth: 100,
                name: 'change_time'
            }, {
                xtype: 'combo',
                width: 400,
                fieldLabel: i18n.get('Lock type'),
                labelWidth: 100,
                editable: false,
                valueField: 'id',
                displayField: 'name',
                name: 'blk_req',
                allowBlank: false,
                value: 0,
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }],
                    data: [{
                        id: 0,
                        name: i18n.get('Turn on account entry')
                    }, {
                        id: 3,
                        name: i18n.get('Administrative')
                    }, {
                        id: 10,
                        name: i18n.get('Turn off account entry')
                    }]
                })
            }]
        };
        this.store = Ext.create('OSS.store.accounts.Locks');
        this.columns = [{
            header: i18n.get('Blocking') + ' (' + i18n.get('Since') + ')',
            dataIndex: 'change_time',
            xtype: 'datecolumn',
            width: 125,
            format: 'Y-m-d H:i:s'
        }, {
            header: i18n.get('Lock removed'),
            dataIndex: 'time_to',
            xtype: 'datecolumn',
            width: 125,
            format: 'Y-m-d H:i:s'
        }, {
            header: i18n.get('Lock type'),
            xtype: 'storecolumn',
            sortable: false,
            dataIndex: 'block_type',
            flex: 1,
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: 0,
                    name: i18n.get('Turn on')
                }, {
                    id: 1,
                    name: i18n.get('Blocked by balance')
                }, {
                    id: 2,
                    name: i18n.get('Blocked by client')
                }, {
                    id: 3,
                    name: i18n.get('Administrative')
                }, {
                    id: 4,
                    name: i18n.get('Blocked by balance')
                }, {
                    id: 5,
                    name: i18n.get('Blocked by traffic amount')
                }, {
                    id: 10,
                    name: i18n.get('Turn off')
                }]
            })
        }, {
            header: i18n.get('Assigned by'),
            sortable: false,
            dataIndex: 'mgr_name',
            flex: 1
        }];
        this.bbar = {
            xtype: 'pagingtoolbar',
            store: this.store
        };
        this.callParent(arguments);
    }
});
