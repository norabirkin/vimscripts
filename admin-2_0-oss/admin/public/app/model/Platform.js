/**
 * Модель платформы
 */
Ext.define('OSS.model.Platform', {
    extend: 'Ext.data.Model',
    idProperty: 'platform_id',
    fields: [{
        name: 'platform_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/platforms'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
