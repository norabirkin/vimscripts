Ext.define('OSS.model.usergroups.UsersAssigned', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'uid', type: 'int' }, 
        { name: 'name', type: 'string' },
        { name: 'group_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/usergroups/withGroup'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
