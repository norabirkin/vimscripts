Ext.define('OSS.model.agent.internet.IgnoreNetwork', {
    extend: 'Ext.data.Model',
    fields: [
        { name: "ip", type: "string" },
        { name: "mask", type: "int" }
    ]
});
