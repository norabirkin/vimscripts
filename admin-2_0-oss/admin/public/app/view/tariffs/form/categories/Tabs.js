/**
 * Панель вкладок категории тарифов
 */
Ext.define('OSS.view.tariffs.form.categories.Tabs', {
    extend: 'Ext.tab.Panel',
    hidden: true,
    region: 'center',
    itemId: 'categoryTabPanel',
    flex: 1,
    layout: 'fit',
    activeTab: 0,
    defaults: {
        overflowY: 'auto'
    },
    initComponent: function() {
        var objects = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'name',
                type: 'string'
            }],
            data: [{
                id: 1,
                name: i18n.get('Аgreement')
            }, {
                id: 0,
                name: i18n.get('(On) account entry')
            }]
        });
        this.items = [
        Ext.create('OSS.view.tariffs.form.categories.tabs.Basic'),
        Ext.create('OSS.view.tariffs.form.Discouts'), {
            xtype: 'panel',
            tartypes: [], //5
            itemId: 'cyberCryptTab',
            title: i18n.get('CerberCrypt Package')
        }, Ext.create('OSS.ux.grid.editor.row.CheckboxSelection', {
            tartypes: [5],
            itemId: 'discountsTab2',
            title: i18n.get('Discounts'),
            columns: [{
                header: i18n.get('Starting from quantity'),
                dataIndex: 'count',
                width: 250,
                editor: {
                    xtype: 'textfield'
                }
            }, {
                header: i18n.get('Ratio'),
                width: 200,
                dataIndex: 'rate',
                editor: {
                    xtype: 'textfield'
                }
            }, {
                xtype: 'storecolumn',
                header: i18n.get('Puts on'),
                flex: 1,
                dataIndex: 'object',
                store: objects,
                editor: {
                    xtype: 'combo',
                    editable: false,
                    queryMode: 'local',
                    store: objects
                }
            }],
            store: 'tariffs.CategoryDiscount'
        }), Ext.create('OSS.view.tariffs.form.categories.tabs.Directions', {
            tartypes: [0,1,2],
            title: i18n.get('Directions'),
            itemId: 'directionsTab',
            common: {
                columns: [{
                    dataIndex: 'descr',
                    header: i18n.get('Description'),
                    flex: 1
                }, {
                    dataIndex: 'port',
                    header: i18n.get('Port')
                }, {
                    dataIndex: 'proto',
                    header: i18n.get('Protocol')
                }, {
                    header: i18n.get('IP'),
                    renderer: function() {
                        var record = arguments[2];
                        return record.get('zone_ip') + ' / ' + record.get('prefix_size');
                    }
                }]
            },
            available: {
                store: 'tariffs.directions.available.IP'
            },
            assigned: {
                store: 'tariffs.directions.IP'
            }
        }), Ext.create('OSS.view.tariffs.form.categories.tabs.directions.Tel', {
            itemId: 'directionsOutTab',
            title: i18n.get('Directions (outgoing)'),
            available: {
                store: 'tariffs.directions.available.Outgoing'
            },
            assigned: {
                store: 'tariffs.directions.Outgoing'
            }
        }), Ext.create('OSS.view.tariffs.form.categories.tabs.directions.Tel', {
            itemId: 'directionsIncTab',
            title: i18n.get('Directions (incoming)'),
            available: {
                store: 'tariffs.directions.available.Incoming'
            },
            assigned: {
                store: 'tariffs.directions.Incoming'
            }
        }), {
            xtype: 'gridpanel',
            itemId: 'routesTab',
            tartypes: [4],
            title: i18n.get('Route weights'),
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'button',
                    iconCls: 'x-ibtn-add',
                    text: i18n.get('Add')
                }]
            }],
            columns: []
        }];
        this.callParent(arguments);
    }
});
