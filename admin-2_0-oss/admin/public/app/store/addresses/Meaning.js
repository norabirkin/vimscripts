Ext.define( 'OSS.store.addresses.Meaning', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'short', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressmeanings'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
