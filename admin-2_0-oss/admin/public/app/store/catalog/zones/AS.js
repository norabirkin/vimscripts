Ext.define('OSS.store.catalog.zones.AS', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.catalog.zones.AS',
    
    proxy: {
        extraParams: {
            catalog_type: 2
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
