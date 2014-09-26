/**
 * Типы списания
 */
Ext.define('OSS.store.accounts.WriteOff', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    data: [{
        id: 2,
        name: ''
    }, {
        id: 1,
        name: i18n.get('daily')
    }, {
        id: 0,
        name: i18n.get('monthly')
    }]
});
