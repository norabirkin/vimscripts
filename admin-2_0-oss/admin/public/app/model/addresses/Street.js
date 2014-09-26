Ext.define( 'OSS.model.addresses.Street', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'postcode', type: 'int' },
        { name: 'short', type: 'string' },
        { name: 'city_id', type: 'int' },
        { name: 'region_id', type: 'int' },
        { name: 'settl_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressstreets'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
