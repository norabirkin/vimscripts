/**
 * Таблица "Скидки по времени" в категориях тарифа
 */
Ext.define('OSS.view.tariffs.form.discounts.Time', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    title: i18n.get('Time discounts'),
    itemId: 'time',
    store: 'tariffs.TimeDiscounts',
    height: '50%',
    region: 'north',
    initComponent: function() {
        this.columns = [{
            header: 'ID',
            dataIndex: 'dis_id',
            width: 45,
            sortable: false
        }, {
            xtype: 'datecolumn',
            header: i18n.get('Since'),
            format: 'H:i:s',
            width: 75,
            dataIndex: 'time_from',
            editor: {
                xtype: 'timefield',
                format: 'H:i:s',
                maskRe: /^[0-9:]$/,
                increment: 5,
                allowBlank: false
            }
        }, {
            xtype: 'datecolumn',
            header: i18n.get('Till'),
            dataIndex: 'time_to',
            format: 'H:i:s',
            width: 75,
            editor: {
                xtype: 'timefield',
                format: 'H:i:s',
                maskRe: /^[0-9:]$/,
                increment: 5,
                allowBlank: false
            }
        }, Ext.create('OSS.view.tariffs.form.column.WeekDays'),
        Ext.create('OSS.view.tariffs.form.column.UseWeekEnd'), {
            header: i18n.get('Discount'),
            dataIndex: 'discount',
            width: 70,
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
        }];
        this.callParent(arguments);
    }
});
