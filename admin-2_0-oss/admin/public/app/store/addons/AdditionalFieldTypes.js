Ext.define( "OSS.store.addons.AdditionalFieldTypes", {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 0, name: OSS.Localize.get("Text") },
        { id: 1, name: OSS.Localize.get("List") },
        { id: 2, name: OSS.Localize.get("Logical") }
    ]
});
