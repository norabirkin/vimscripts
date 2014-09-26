Ext.define( 'OSS.store.users.searchtemplates.Operators', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', mapping: 'uid', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/operators'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
