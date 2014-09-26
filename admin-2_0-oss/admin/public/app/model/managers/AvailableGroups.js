Ext.define('OSS.model.managers.AvailableGroups', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'descr',
        type: 'string'
    }, {
        name: 'mrgs_count',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'group_id',
        type: 'int'
    }],
    idProperty: 'group_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/managersgroups'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
