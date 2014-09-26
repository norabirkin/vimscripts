Ext.define( 'OSS.model.addresses.Country', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addresscountries'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
