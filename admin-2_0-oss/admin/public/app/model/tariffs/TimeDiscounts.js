/**
 * Модель для таблицы "Скидки по времени"
 */
Ext.define('OSS.model.tariffs.TimeDiscounts', {
    extend: 'Ext.data.Model',
    idProperty: 'dis_id',
    fields: [{
        name: 'dis_id',
        type: 'int'
    }, {
        name: 'tar_id',
        type: 'int'
    }, {
        name: 'cat_idx',
        type: 'int'
    }, {
        name: 'type',
        type: 'int'
    }, {
        name: 'use_weekend',
        type: 'int'
    }, {
        name: 'inline',
        type: 'string'
    }, {
        name: 'discount',
        type: 'float'
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
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/timeDiscounts'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
