Ext.define('OSS.model.ManagersGroupsList', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'personid',
        type: 'int'
    }, {
        name: 'fio',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/managergroups/?groupsonly=1'),
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
