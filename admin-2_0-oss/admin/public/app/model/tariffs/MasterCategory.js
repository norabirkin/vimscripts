Ext.define('OSS.model.tariffs.MasterCategory', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'cat_idx',type: 'int'},
        {name: 'cat_id',type: 'int'},
        {name: 'descr',type: 'string'},
        {name: 'uuid',type: 'string'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/Tariffs/MasterCategory'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
