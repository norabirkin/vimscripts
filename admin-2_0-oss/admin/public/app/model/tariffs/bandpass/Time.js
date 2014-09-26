/**
 * Модель для элемента таблицы "В зависимости от дня и времени" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.model.tariffs.bandpass.Time', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'time_from',
        dateFormat: 'H:i:s',
        defaultValue: '00:00:00',
        type: 'date'
    }, {
        name: 'time_to',
        dateFormat: 'H:i:s',
        defaultValue: '00:00:00',
        type: 'date'
    }, {
        name: 'inline',
        type: 'string'
    }, {
        name: 'use_weekend',
        type: 'int'
    }, {
        name: 'shape_rate',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/timeShapes'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
