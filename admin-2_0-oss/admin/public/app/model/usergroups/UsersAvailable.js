Ext.define('OSS.model.usergroups.UsersAvailable', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'uid', type: 'int' }, 
        { name: 'name', type: 'string' },
        { name: 'group_id', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/usergroups/withoutGroup'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
