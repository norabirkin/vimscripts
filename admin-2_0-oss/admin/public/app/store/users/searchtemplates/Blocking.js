Ext.define( 'OSS.store.users.searchtemplates.Blocking', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 0, name: OSS.Localize.get('Active') },
        { id: 1, name: OSS.Localize.get('Blocked by balance') },
        { id: 2, name: OSS.Localize.get('Blocked by client') },
        { id: 3, name: OSS.Localize.get('Blocked by manager') },
        { id: 5, name: OSS.Localize.get('Blocked by traffic') },
        { id: 10, name: OSS.Localize.get('Turned off') }
    ]
});
