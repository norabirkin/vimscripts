/**
 * Хранилище для полей "Приоритет изменения скорости" и "Приоритет скидок" в формах тарифа и категории тарифа
 */
Ext.define('OSS.store.tariffs.Priority', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    data: [{
        id: 0,
        name: i18n.get('less')
    }, {
        id: 3,
        name: i18n.get('most')
    }, {
        id: 1,
        name: i18n.get('by size')
    }, {
        id: 2,
        name: i18n.get('by time')
    }]
});
