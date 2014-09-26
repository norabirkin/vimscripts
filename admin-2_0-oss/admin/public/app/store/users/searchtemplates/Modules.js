Ext.define( 'OSS.store.users.searchtemplates.Modules', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', mapping: 'descr', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
