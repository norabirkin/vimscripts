Ext.define( 'OSS.store.addresses.meanings.Streets', {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'record_id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'short', type: 'string' }
    ]
});
