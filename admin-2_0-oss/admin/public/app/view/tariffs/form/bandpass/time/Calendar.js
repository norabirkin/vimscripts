/**
 * Редактор поля "Календарь" для таблицы "В зависимости от дня и времени" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.bandpass.time.Calendar', {
    extend: 'Ext.form.field.Checkbox',
    uncheckedValue: 0,
    inputValue: 1,
    getModelData: function() {
        var me = this,
            data = null;
        if (!me.disabled && !me.isFileUpload()) {
            data = {};
            data[me.getName()] = me.getSubmitValue();
        }
        return data;
    }
});
