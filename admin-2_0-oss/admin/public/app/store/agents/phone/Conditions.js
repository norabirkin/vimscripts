Ext.define( 'OSS.store.agents.phone.Conditions', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' }
    ],
    data: [
        { name: '=', descr: OSS.Localize.get("equal") },
        { name: '>', descr: OSS.Localize.get("more than") },
        { name: '<', descr: OSS.Localize.get("less than") },
        { name: '!=', descr: OSS.Localize.get("not equal") },
        { name: '~', descr: OSS.Localize.get("match") },
        { name: '!~', descr: OSS.Localize.get("not match") }
    ]
});
