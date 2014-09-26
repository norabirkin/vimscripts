Ext.define('OSS.model.addons.AddonsValuesVgroups', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'agent_id', type: 'int'},
        { name: 'idx', type: 'int'}, 
        { name: 'agent_name', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'str_value', type: 'string' },
        { name: 'values', type:'auto'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/AddonsValuesVgroups'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
