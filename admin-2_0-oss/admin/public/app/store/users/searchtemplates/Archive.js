Ext.define( 'OSS.store.users.searchtemplates.Archive', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 0, name: OSS.Localize.get('No') },
        { id: 1, name: OSS.Localize.get('Yes') }
    ]
});
