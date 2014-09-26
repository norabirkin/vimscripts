Ext.define( 'OSS.store.users.searchtemplates.Tariffs', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', mapping: 'tar_id', type: 'string' },
        { name: 'name', mapping: 'descr', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tariffs'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
