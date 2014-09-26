Ext.define( 'OSS.model.agent.internet.Rnas', {
    extend: "Ext.data.Model",
    fields: [
        { name: "id", type: "int", mapping: "nas_id" },
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
