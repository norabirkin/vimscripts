Ext.define("OSS.store.radiusattributes.Dictionary", {
    extend: "Ext.data.Store",
    requires: ['OSS.model.radiusattributes.Dictionary'],
    model: 'OSS.model.radiusattributes.Dictionary',
    proxy: {
        type: 'rest',
        url: 'index.php/api/radiusattributes',
        reader: {
            type: 'json',
                root: 'results'
        }
    }
});
