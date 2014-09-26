/**
 * Модель для элемента таблицы "В зависимости от объема" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.model.tariffs.bandpass.Size', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'amount',
        type: 'int'
    }, {
        name: 'shape_rate',
        type: 'int'
    }, {
        name: 'remove',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/sizeShapes'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
