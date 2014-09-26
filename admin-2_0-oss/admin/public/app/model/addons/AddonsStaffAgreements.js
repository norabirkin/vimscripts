Ext.define('OSS.model.addons.AddonsStaffAgreements', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'agentid',  type: 'int'}, 
        { name: 'agent', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'str_value', type: 'string'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addonsStaff'),
        reader: {
            type: 'json',
            root: 'results'
        },
        extraParams: {
            addonsType: 1
        }
    }
});
