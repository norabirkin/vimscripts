/**
 * Комбогрид выбора тарифа
 */
Ext.define('OSS.view.accounts.item.common.right.tariff.Combogrid', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: 'widget.tarcmbgrid',
    fieldLabel: i18n.get('Tariff'),
    initComponent: function() {
        this.store = Ext.app.Application.instance.
            getController(
                'OSS.controller.accounts.Item'
            ).tariff.fetchStore();
        this.callParent(arguments);
    },
    width: 700,
    displayField: 'descr',
    valueField: 'tar_id',
    columns: [{
        header: i18n.get('ID'),
        width: 40,
        dataIndex: 'tar_id'
    }, {
        header: i18n.get('Description'),
        dataIndex: 'descr',
        flex: 1
    }, {
        xtype: 'storecolumn',
        header: i18n.get('Write rent off'),
        dataIndex: 'daily_rent',
        value: -1,
        store: Ext.create('Ext.data.Store', {
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'name',
                type: 'string'
            }],
            data: [{
                id: -1,
                name: ''
            }, {
                id: 0,
                name: i18n.get('monthly')
            }, {
                id: 1,
                name: i18n.get('daily')
            }]
        })
    }, {
        header: i18n.get('Rent'),
        dataIndex: 'rent',
        renderer: function() {
            var record = arguments[2];
            return Ext.app.Application.instance.
                getController(
                    'OSS.controller.accounts.Item'
                ).
                formatPrice(
                    record.get('rent'),
                    record.get('symbol')
                );
        }
    }, {
        header: i18n.get('Accounts'),
        dataIndex: 'ext_vg_count'
    }]
});
