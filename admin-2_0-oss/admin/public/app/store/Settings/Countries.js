Ext.define('OSS.store.Settings.Countries', {
    extend: 'Ext.data.Store',
    fields: [
    { name: 'id', type: 'string', mapping: 'recordid' }, 
    { name: 'name', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api', 'settings', 'countries'),
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
