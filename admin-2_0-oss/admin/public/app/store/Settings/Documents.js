Ext.define('OSS.store.Settings.Documents', {
    extend: 'Ext.data.Store',
    fields: [
    { name: 'id', type: 'string', mapping: 'doc_id' }, 
    { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'documents'),
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
