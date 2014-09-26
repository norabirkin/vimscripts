Ext.define('OSS.model.Settings.AgreementTemplates', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'value',
        type: 'string'
    }],
    idProperty: 'name',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agreementtemplates'),
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
