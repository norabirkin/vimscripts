Ext.define('OSS.model.managers.AssignedRoleGroups', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'role_id', type: 'int' }, 
        { name: 'group_descr', type: 'string' },
        { name: 'group_name', type: 'string' }, 
        { name: 'user_group_id', type: 'int' },
        { name: 'rights', type: 'int' },
        { name: 'f_read', type: 'boolean' }, 
        { name: 'f_write', type: 'boolean' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/roles/GroupsList'),
        reader: {
            type: 'json',
            root: 'results'
        },
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});      