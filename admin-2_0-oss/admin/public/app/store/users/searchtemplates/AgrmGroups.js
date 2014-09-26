Ext.define( 'OSS.store.users.searchtemplates.AgrmGroups', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', mapping: 'group_id', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agrmgroups'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
