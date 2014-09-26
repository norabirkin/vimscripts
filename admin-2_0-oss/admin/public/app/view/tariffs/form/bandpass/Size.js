/**
 * Таблица "В зависимости от объема" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.bandpass.Size', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelectionBase',
    itemId: 'size',
    title: i18n.get('According to size'),
    store: 'tariffs.bandpass.Size',
    region: 'east',
    width: 600,
    initComponent: function() {
        this.columns = [{
            header: i18n.get('Size') + ' ' + i18n.get('(Min)'),
            dataIndex: 'amount',
            width: 76,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0
            }
        }, {
            header: i18n.get('Shape') + ' ' + i18n.get('(Kbit/sec)'),
            dataIndex: 'shape_rate',
            flex: 1,
            width: 87,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0
            }
        }];
        this.callParent(arguments);
    }
});
