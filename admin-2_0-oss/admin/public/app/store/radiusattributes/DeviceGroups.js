Ext.define( "OSS.store.radiusattributes.DeviceGroups", {
    extend: "Ext.data.Store",
    requires: 'OSS.model.radiusattributes.DeviceGroups',
    model: 'OSS.model.radiusattributes.DeviceGroups',
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            root: 'results'
        },
        url: Ext.Ajax.getRestUrl('api/devicegroups')
    }
});
