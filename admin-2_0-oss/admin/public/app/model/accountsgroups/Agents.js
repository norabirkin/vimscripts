Ext.define( "OSS.model.accountsgroups.Agents", {
    extend: 'Ext.data.Model',
    fields: [
        { name: "id", type: "int" },
        { name: "descr", type: "string" },
        { name: "type", type: "int" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
