Ext.define( 'OSS.model.radiusattributes.RnasList', {
    extend: "Ext.data.Model",
    fields: [
        { name: "nas_id", type: "int"},
        { name: "agent_id", type: "int" },
        { name: "is_new", type: "int" },
        { name: "device_id", type: "int" },
        { name: "secret", type: "string" },
        { name: "device_name", type: "string" },
        { name: "rnas", type: "string" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/rnas'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
