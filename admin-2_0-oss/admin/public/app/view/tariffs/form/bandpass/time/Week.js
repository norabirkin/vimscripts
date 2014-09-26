/**
 * Поле выбора дней недели для таблицы "В зависимости от дня и времени" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.bandpass.time.Week', {
    extend: 'Ext.form.field.ComboBox',
    editable: false,
    multiSelect: true,
    delimiter: ',',
    store: 'tariffs.bandpass.Days',
    valueField: 'name',
    displayField: 'descr',
    setValue: function(value, doSelect) {
        if (typeof value == 'string' && value !== '') {
            value = value.split(this.delimiter);
        }
        this.callParent([value, doSelect]);
    }
});
