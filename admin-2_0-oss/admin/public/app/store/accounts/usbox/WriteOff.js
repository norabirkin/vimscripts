/**
 * Типы списания
 */
Ext.define('OSS.store.accounts.usbox.WriteOff', {
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
        name: i18n.get('daily')
    }, {
        id: 3,
        name: i18n.get('daily') + '<br/>' + i18n.get('equal parts')
    }, {
        id: 1,
        name: i18n.get('monthly')
    }]
});
