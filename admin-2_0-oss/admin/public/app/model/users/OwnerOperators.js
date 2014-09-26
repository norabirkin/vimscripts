Ext.define('OSS.model.users.OwnerOperators', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name: 'uid', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    idProperty: 'uid',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/userForm/OwnerOperatorsList'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
