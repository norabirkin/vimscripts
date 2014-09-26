Ext.define('OSS.store.Settings.License', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Options',
    model: 'OSS.model.Options',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'settings', 'license'),
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
