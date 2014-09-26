Ext.define('OSS.store.tariffs.Categories', {
    lazy: true,
    extend: 'Ext.data.Store',
    validity: 'categories',
    fields: [{
        name: 'cat_idx',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tarcategory'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
