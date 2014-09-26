Ext.define( 'OSS.store.agents.phone.Logic', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' }
    ],
    data: [
        { name: 'none', descr: "--" },
        { name: '&&', descr: OSS.Localize.get("AND") },
        { name: '||', descr: OSS.Localize.get("OR") }
    ]
});
