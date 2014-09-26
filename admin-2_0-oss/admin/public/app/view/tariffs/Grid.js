Ext.define('OSS.view.tariffs.Grid', {
    extend: 'Ext.window.Window',
    alias: 'widget.tariffsgridwin',
    title: i18n.get('Tariffs'),
    height: 400,
    width: 500,
    layout: 'fit',
    resizable: false,
    modal: true,
    buttons: [{
        xtype: 'button',
        itemId: 'assign',
        text: i18n.get('Assign')
    }],
    items: [{
        xtype: 'gridpanel',
        columns: [{
            header: i18n.get('ID'),
            dataIndex: 'tarid'
        }, {
            header: i18n.get('Description'),
            dataIndex: 'descr',
            flex: 1
        }, {
            header: i18n.get('Write rent off'),
            dataIndex: 'type'
        }, {
            header: i18n.get('Rent'),
            dataIndex: 'rent'
        }, {
            header: i18n.get('Accounts'),
            dataIndex: 'vgroups'
        }],
        tbar: [{
            xtype: 'combo',
            valueField: 'id',
            displayField: 'name',
            name: 'tartype',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'id',
                        type: 'int'
                    },
                    {
                        name: 'name',
                        type: 'int'
                    }
                ],
                data: [{
                    id: -1,
                    name: i18n.get('All')
                }, {
                    id: 0,
                    name: i18n.get('Leased line')
                }, {
                    id: 1,
                    name: 'Dialup (' + i18n.get('by size') + ')'
                }, {
                    id: 2,
                    name: 'Dialup (' + i18n.get('by time') + ')'
                }, {
                    id: 3,
                    name: i18n.get('Telephony')
                }, {
                    id: 4,
                    name: 'IP ' + i18n.get('Telephony')
                }, {
                    id: 5,
                    name: i18n.get('Services')
               }]
            })
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'textfield',
            name: 'tarname'
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            text: i18n.get('Show')
        }],
        bbar: {
            xtype: 'pagingtoolbar'
        },
        store: Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'tarid',
                    type: 'int'
                },
                {
                    name: 'descr',
                    type: 'int'
                },
                {
                    name: 'type',
                    type: 'int'
                },
                {
                    name: 'actblock',
                    type: 'int'
                },
                {
                    name: 'dailyrent',
                    type: 'int'
                },
                {
                    name: 'unaval',
                    type: 'int'
                },
                {
                    name: 'rent',
                    type: 'int'
                },
                {
                    name: 'symbol',
                    type: 'int'
                },
                {
                    name: 'vgroups',
                    type: 'int'
                },
                {
                    name: 'additional',
                    type: 'int'
                }
            ],
            data: []
        })
    }]
});
