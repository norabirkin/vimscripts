/**
 * Таблица "Скидки по объему" в категориях тарифа
 */
Ext.define('OSS.view.tariffs.form.discounts.Size', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    title: i18n.get('Size discounts'),
    itemId: 'size',
    height: '50%',
    region: 'center',
    store: 'tariffs.discounts.Size',
    columns: [{
        header: 'ID',
        dataIndex: 'dis_id',
        width: 50
    }, {
        header: i18n.get('Size') + ' ' + i18n.get('(Min)'),
        flex: 1,
        dataIndex: 'amount',
        width: 100,
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0
        }
    }, {
        header: i18n.get('Discount'),
        dataIndex: 'discount',
        width: 85,
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0
        }
    }, {
        xtype: 'storecolumn',
        header: i18n.get('Type'),
        dataIndex: 'type',
        store: 'tariffs.discounts.Type',
        width: 70,
        editor: {
            xtype: 'combo',
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            store: 'tariffs.discounts.Type'
        }
    }, {
        header: i18n.get('Bonus') + ' (руб.)',
        dataIndex: 'bonus',
        width: 85,
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0
        }
    }]
});
