Ext.define('OSS.model.radiusattributes.Dictionary', {
    extend: "Ext.data.Model",
    fields: [
        { type: "string", name: 'name' }, 
        { type: "int", name: 'nas_id' }, 
        { type: "int", name: 'radius_type' }, 
        { type: "int", name: 'record_id' }, 
        { type: "int", name: 'replace_id' }, 
        { type: "bool", name: 'tagged' }, 
        { type: "bool", name: 'to_history' }, 
        { type: "int", name: 'value_type' }, 
        { type: "int", name: 'vendor'  }
    ],
    idProperty: 'record_id'
});
