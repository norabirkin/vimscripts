Ext.define( 'OSS.model.agent.internet.Segment', {
    extend: "Ext.data.Model",
    fields: [ 
        { name: 'id', mapping: "segment_id", type: "int" },
        { name: 'agent_id', type: "int" },
        { name: "ignore_local", type: "int" },
        { name: "nat", type: "int" },
        { name: "ip", type: "string" },
        { name: "mask", type: "string" },
        { name: "masknum", type: "int" },
        { name: "nas_id", type: "int" },
        { name: "rnas", type: "string" },
        { name: "outer_vlan", type: "int" },
        { name: "vlan_name", type: "string" },
        { name: "vlan_id", type: "int" },
        { name: "gateway", type: "string" },
        { name: "device_group_id", type: "int" },
        { name: "device_group_name", type: "string" },
        { name: "guest", type: "int" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/segments'),
        reader: {
            type: 'json',
                root: 'results',
            totalProperty: 'total'
        }
    }
});
