/**
 * Фильтр списка учетных записей
 */
Ext.define('OSS.view.accounts.list.Filter', {
    extend: 'Ext.form.Panel',
    hidden: true,
    disabled: true,
    itemId: 'filter',
    region: 'west',
    frame: true,
    initComponent: function() {
        this.items = [{
            xtype: 'combo',
            name: 'agent_id',
            itemId: 'agent',
            labelAlign: 'top',
            width: 210,
            fieldLabel: OSS.Localize.get('Agent'),
            displayField: 'name',
            valueField: 'id',
            editable: false,
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<li data-qtip="{name}" class="x-boundlist-item">{id}. {[Ext.String.ellipsis(values.name, 25)]}</li>',
                '</tpl>'
            ),
            store: Ext.create('OSS.store.statistics.Agents', {
                listeners: {
                    load: Ext.bind(Ext.app.Application.instance.getController('Accounts').addAllAgentsItem, Ext.app.Application.instance.getController('Accounts'))
                }
            })
        }, {
            xtype: 'combo',
            name: 'tar_id',
            itemId: 'tariff',
            labelAlign: 'top',
            width: 210,
            fieldLabel: OSS.Localize.get('Tariff'),
            displayField: 'name',
            valueField: 'id',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<li data-qtip="{name}" class="x-boundlist-item">{id}. {[Ext.String.ellipsis(values.name, 20)]} ({symbol})</li>',
                '</tpl>'
            ),
            store: Ext.create('OSS.store.accounts.Tariffs', {
                listeners: {
                    load: Ext.bind(Ext.app.Application.instance.getController('Accounts').addAllTariffsItem, Ext.app.Application.instance.getController('Accounts'))
                }
            })
        }, {
            xtype: 'combo',
            name: 'blocked',
            labelAlign: 'top',
            width: 210,
            editable: false,
            fieldLabel: OSS.Localize.get('Status'),
            displayField: 'name',
            valueField: 'id',
            value: 0,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'string' }
                ],
                data: [
                    { id: 0, name: OSS.Localize.get('All') },
                    { id: 1, name: OSS.Localize.get('Blocked by balance') },
                    { id: 2, name: OSS.Localize.get('Blocked by client') },
                    { id: 3, name: OSS.Localize.get('Blocked by manager') },
                    { id: 5, name: OSS.Localize.get('Blocked by traffic') },
                    { id: 10, name: OSS.Localize.get('Turned off') }
                ]
            })
        }, {
            xtype: 'advsearch',
            layout: 'vbox',
            width: 210,
            getCheckBoxConfig: function() {
                return {
                    labelWidth: 191,
                    padding: '0 0 0 0'
                };
            },
            getComboBoxConfig: function() {
                return { width: 210 };
            }
        }];
        this.callParent(arguments);
    }
});
