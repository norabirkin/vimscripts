Ext.define( 'OSS.store.statistics.Vgroups', {
    extend: 'Ext.data.Store',
    fields: [ 
        { name: 'vg_id', type: 'int' }, 
        { name: 'login', type: 'string' }
    ],
    pageSize: 10,
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgroup'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
