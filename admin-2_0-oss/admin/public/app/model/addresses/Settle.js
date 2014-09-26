Ext.define( 'OSS.model.addresses.Settle', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'short', type: 'string' },
        { name: 'area_id', type: 'int' },
        { name: 'city_id', type: 'int' },
        { name: 'region_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addresssettles'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
