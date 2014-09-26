Ext.define( 'OSS.store.users.searchtemplates.Types', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 1, name: OSS.Localize.get('Legal person') },
        { id: 2, name: OSS.Localize.get('Physical person') }
    ]
});
