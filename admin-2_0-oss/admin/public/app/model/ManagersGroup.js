Ext.define('OSS.model.ManagersGroup', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'descr',
        type: 'string'
    }, {
        name: 'fio',
        type: 'string'
    }, {
        name: 'istemplate',
        type: 'int'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'parenttemplate',
        type: 'int'
    }, {
        name: 'payments',
        type: 'int'
    }, {
        name: 'personid',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/managergroups/15'),
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
