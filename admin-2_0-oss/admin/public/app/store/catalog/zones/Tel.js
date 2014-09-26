Ext.define('OSS.store.catalog.zones.Tel', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.catalog.zones.Tel',
    proxy: {
        extraParams: {
            catalog_type: 3
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
