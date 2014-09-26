Ext.define('OSS.model.agent.internet.radius.Attribute', {
    extend: "Ext.data.Model",
    fields: [
        { type: "string", name: 'name' }, 
                { type: "int", name: 'nas_id' }, 
                { type: "int", name: 'radius_type' }, 
                { type: "int", mapping: 'record_id', name: 'id' }, 
                { type: "int", name: 'replace_id' }, 
                { type: "bool", name: 'tagged' }, 
                { type: "bool", name: 'to_history' }, 
                { type: "int", name: 'value_type' }, 
                { type: "int", name: 'vendor'  }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/radiusattributes'),
        reader: {
            type: 'json',
                root: 'results'
        }
    }
});
