Ext.define('OSS.model.Addresses', {
    extend: 'Ext.data.Model',
    fields: [
        { name: "code", type: "string" },
        { name: "value", type: "string" },
        { name: "full_value", type: "string" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addressSearch'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
