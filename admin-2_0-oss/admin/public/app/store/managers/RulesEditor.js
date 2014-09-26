/**
 * Хранилище элементов редактора правил
 */
Ext.define('OSS.store.managers.RulesEditor', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'value', type: 'boolean' },
        { name: 'name', type: 'string' }
    ],
    data: [{
        value: true,
        name: i18n.get('Accept')
    }, {
        value: false,
        name: i18n.get('Reject')
    }]
});
