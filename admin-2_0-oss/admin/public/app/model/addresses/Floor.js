Ext.define( 'OSS.model.addresses.Floor', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'building_id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'region_id', type: 'int' },
        { name: 'short', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressfloors'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
