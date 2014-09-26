/**
 * Хранилище для таблицы CAS пакетов
 */
Ext.define('OSS.store.tariffs.CAS', {
    extend: 'Ext.data.Store',
    lazy: true,
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'tag',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/cas'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
