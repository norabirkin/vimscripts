Ext.define( 'OSS.model.addresses.Porch', {
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
        url: Ext.Ajax.getRestUrl('api/addressporches'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
