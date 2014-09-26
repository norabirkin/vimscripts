Ext.define('OSS.store.agents.Types', {
    extend: 'Ext.data.Store',
    fields: [ { name: "id", type: "int" },{ name: "name", type: "string" } ],
    licid: 'agentType',
    data: [
        { name: "Ethernet / PCAP", id: 1 },
        { name: "Ethernet / ULOG", id: 2 },
        { name: "Ethernet / TEE", id: 3 },
        { name: "Netflow", id: 4 },
        { name: "Sflow", id: 5 },
        { name: "RADIUS", id: 6 },
        { name: "PCDR / PABX", id: 7 },
        { name: "VoIP", id: 12 },
        { name: i18n.get("Services"), id: 13 },
        { name: "Snmp", id: 14 }
    ]
});
