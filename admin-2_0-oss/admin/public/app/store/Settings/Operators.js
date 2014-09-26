Ext.define('OSS.store.Settings.Operators', {
    extend: 'Ext.data.Store',
    fields: [
    { name: 'id', type: 'string', mapping: 'uid' }, 
    { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'operators'),
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
