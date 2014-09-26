/**
 * Типы каталогов
 */
Ext.define('OSS.store.catalog.Types', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'id',
        type: 'int'
    }],
    data: [{
        name: i18n.get("IP", 'catalogue'),
        id: 1
    }, {
        name: i18n.get("AS", 'catalogue'),
        id: 2
    }, {
        name: i18n.get("Phone catalogue"),
        id: 3
    }]
});
