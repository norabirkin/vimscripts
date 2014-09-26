Ext.define( 'OSS.model.addresses.Region', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'short', type: 'string' },
        { name: 'country_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressregions'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
