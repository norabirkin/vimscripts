Ext.define('OSS.model.users.Operators', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name: 'uid', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/userForm/OperatorsList'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
