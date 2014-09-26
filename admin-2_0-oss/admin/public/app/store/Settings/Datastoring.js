Ext.define('OSS.store.Settings.Datastoring', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Options',
    model: 'OSS.model.Options',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'datastoring'),
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
