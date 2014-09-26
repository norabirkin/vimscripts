Ext.define('OSS.model.tariffs.CategoryDiscount', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'count', type: 'int' },
        {name: 'rate', type: 'float'},
        {name: 'record_id',  type: 'int'},
        {name: 'object',  type: 'int'},
        {name: 'cat_idx',  type: 'int'},
        {name: 'tar_id',  type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/TarCatDiscounts'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
