Ext.define('OSS.store.Settings.AgreementTemplates', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Settings.AgreementTemplates',
    lazy: true,
    model: 'OSS.model.Settings.AgreementTemplates',
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
