/**
 * Типы договоров
 */
Ext.define('OSS.store.agreements.Types', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'id',
        type: 'int'
    }],
    data: [{
        id: -1,
        name: ''
    }, {
        id: 0,
        name: i18n.get('Advance')
    }, {
        id: 1,
        name: i18n.get('Credit')
    }, {
        id: 2,
        name: i18n.get('Mixed')
    }]
});
