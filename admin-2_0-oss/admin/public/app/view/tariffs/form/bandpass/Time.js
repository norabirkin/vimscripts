/**
 * Таблица "В зависимости от дня и времени" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.bandpass.Time', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelectionBase',
    title: i18n.get('According to day and time'),
    store: 'tariffs.bandpass.Time',
    region: 'center',
    initComponent: function() {
        this.columns = [{ 
            xtype: 'datecolumn',
            format: 'H:i:s',
            width: 75,
            header: i18n.get('Since'), 
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
            format: 'H:i:s',
            header: i18n.get('Till'), 
            dataIndex: 'time_to', 
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
            header: i18n.get('Shape') + ' ' + i18n.get('(Kbit/sec)'),
            dataIndex: 'shape_rate',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0
            },
            width: 150
        }];
        this.callParent(arguments);
    }
});
