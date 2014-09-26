Ext.define('OSS.model.managers.Paycategories', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'descr',
        type: 'string'
    }, {
        name: 'class_id',
        type: 'int'
    }, {
        name: 'extern_code',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }],
    idProperty: 'class_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payclasses'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});