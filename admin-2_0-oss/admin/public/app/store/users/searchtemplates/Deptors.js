Ext.define( 'OSS.store.users.searchtemplates.Deptors', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 1, name: OSS.Localize.get('No') },
        { id: 2, name: OSS.Localize.get('Disconnection') },
        { id: 3, name: OSS.Localize.get('Termination')}
    ]
});
