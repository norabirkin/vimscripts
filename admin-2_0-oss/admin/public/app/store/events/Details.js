/**
 * Хранилище для детализированной интформации о событии для раздела
 * "Отчеты/Журнал событий"
 */
Ext.define('OSS.store.events.Details', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'table',
        type: 'string'
    }, {
        name: 'field',
        type: 'string'
    }, {
        name: 'new',
        type: 'string'
    }, {
        name: 'old',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/eventDetails'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
