Ext.define('OSS.model.agent.phone.Replaces', {
    extend: "Ext.data.Model",
    fields: [
        { name: "id", mapping: "record_id", type: "int" },
        { name: "agent_id", type: "int" },
        { name: "l_trim", type: "int" },
        { name: "replace_what", type: "int" },
        { name: "old_number", type: "string" },
        { name: "new_number", type: "string" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/phonereplaces'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
