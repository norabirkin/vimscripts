Ext.define('OSS.store.catalog.zones.IP', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.catalog.zones.IP',
    proxy: {
        extraParams: {
            catalog_type: 1
        },
        type: 'rest',
        url: Ext.Ajax.getRestUrl( 'api/catalogzones' ),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    },
    pageSize: 50
});
