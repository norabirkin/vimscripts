Ext.define('OSS.model.managers.Roles', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }],
    idProperty: 'record_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/roles'),
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
