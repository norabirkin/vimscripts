Ext.define('OSS.model.radiusattributes.Categories', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'descr', type: 'string' },
        {name: 'oper_name', type: 'string'},
        {name: 'cat_id',  type: 'int'},
        {name: 'cat_idx',  type: 'int'},
        {name: 'oper_id',  type: 'int'},
        {name: 'tar_id',  type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/Tariffs/CategoriesList'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
