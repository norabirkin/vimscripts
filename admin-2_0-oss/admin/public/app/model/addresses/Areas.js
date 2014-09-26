Ext.define( 'OSS.model.addresses.Areas', {
    extend: 'OSS.model.addresses.Item',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'region_id', type: 'int' },
        { name: 'short', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressareas'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
