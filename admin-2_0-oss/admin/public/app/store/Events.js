/**
 * Хранилище для таблицы событий раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.store.Events', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'dt',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'isclnt',
        type: 'int'
    }, {
        name: 'evt_descr',
        type: 'string'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'object',
        type: 'string'
    }, {
        name: 'more',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/events'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
