Ext.define('OSS.model.managers.AssignedRolesForGroup', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'role_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'role_name',
        type: 'string'
    }],
    idProperty: 'role_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/grouproles'),
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