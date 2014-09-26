Ext.define( "OSS.store.users.searchtemplates.Logic", {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' }
    ],
    data: [
        { name: 'AND', descr: OSS.Localize.get("AND") },
        { name: 'OR', descr: OSS.Localize.get("OR") }
    ]
});
