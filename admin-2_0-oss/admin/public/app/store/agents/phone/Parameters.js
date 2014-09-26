Ext.define( 'OSS.store.agents.phone.Parameters', {
    extend: "Ext.data.Store",
    fields: [
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' }
    ],
    data: [
        { name: 'direction', descr: OSS.Localize.get("Direction") }, 
        { name: 'duration', descr: OSS.Localize.get("Duration")}, 
        { name: 'numfrom', descr: OSS.Localize.get("Number A")}, 
        { name: 'numto', descr: OSS.Localize.get("Number B")},
        { name: 'trunk_in', descr: OSS.Localize.get("Incoming")},
        { name: 'trunk_out', descr: OSS.Localize.get("Outgoing")},
        { name: 'cause', descr: OSS.Localize.get("Cause")}
    ]
});
