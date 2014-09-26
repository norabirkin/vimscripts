Ext.define( 'OSS.store.statistics.Agreements', {
    extend: 'Ext.data.Store',
    fields: [ 
        { name: 'agrm_id', type: 'int' },
        { name: 'agrm_num', type: 'string' }
    ],
    pageSize: 10,
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agreements'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
