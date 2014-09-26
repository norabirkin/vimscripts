Ext.define('OSS.store.Settings.Payclasses', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Settings.Payclasses',
    model: 'OSS.model.Settings.Payclasses',
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
