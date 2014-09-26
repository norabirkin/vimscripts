Ext.define('OSS.store.Settings.Payments', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    fields: ['name', 'displayname', 'value'],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'settings'),
        extraParams: {
            'group': '3,7,9'            
        },
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
