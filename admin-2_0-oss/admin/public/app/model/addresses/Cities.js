Ext.define( 'OSS.model.addresses.Cities', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'short', type: 'string' },
        { name: 'area_id', type: 'int' },
        { name: 'region_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addresscities'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
