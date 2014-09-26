/**
 * Хранилище типов скидки
 */
Ext.define('OSS.store.tariffs.discounts.Type', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    data: [{
        id: 1,
        name: ''
    }, {
        id: 0,
        name: '%'
    }]
});
