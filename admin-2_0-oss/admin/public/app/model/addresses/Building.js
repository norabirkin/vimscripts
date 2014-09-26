Ext.define( 'OSS.model.addresses.Building', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'block', type: 'string' },
        { name: 'city_id', type: 'int' },
        { name: 'conn_type', type: 'int' },
        { name: 'flats', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'postcode', type: 'int' },
        { name: 'record_id', type: 'int' },
        { name: 'region_id', type: 'int' },
        { name: 'settl_id', type: 'int' },
        { name: 'short', type: 'string' },
        { name: 'construction', type: 'string' },
        { name: 'ownership', type: 'string' },
        { name: 'street_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressbuildings'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
