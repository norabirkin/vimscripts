Ext.define('OSS.store.catalog.zones.Classes', {
    extend: 'Ext.data.Store',
    model: "OSS.model.catalog.zones.Class",
    lazy: true,
    requires:[ "OSS.model.catalog.zones.Class" ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl( 'api/telclass' ),
        reader: {
            type: 'json',
            root: 'results'
        }
    }       
});
