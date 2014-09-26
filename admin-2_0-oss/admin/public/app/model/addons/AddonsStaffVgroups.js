Ext.define('OSS.model.addons.AddonsStaffVgroups', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'agent_id', type: 'int'}, 
        { name: 'agent_name', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'str_value', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addonsStaff'),
        reader: {
            type: 'json',
            root: 'results'
        },
        extraParams: {
            addonsType: 2
        }
    }
});
