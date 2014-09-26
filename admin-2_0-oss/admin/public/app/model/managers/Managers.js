Ext.define('OSS.model.managers.Managers', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'descr',
        type: 'string'
    }, {
        name: 'fio',
        type: 'string'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'payments',
        type: 'boolean'
    }, {
        name: 'pay_class_id',
        type: 'int'
    }, {
        name: 'person_id',
        type: 'int'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'pass',
        type: 'string'
    }, {
        name: 'open_pass',
        type: 'bool'
    }, {
        name: 'office',
        type: 'string'
    }, {
        name: 'external_id',
        type: 'string'
    }, {
        name: 'cash_register_folder',
        type: 'string'
    }],
    idProperty: 'person_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/managers'),
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
