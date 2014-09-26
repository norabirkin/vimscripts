Ext.define('OSS.model.Settings.Payclasses', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'class_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'payments',
        type: 'string'
    }, {
        name: 'extern_code',
        type: 'string'
    }],
    idProperty: 'class_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payclasses'),
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
