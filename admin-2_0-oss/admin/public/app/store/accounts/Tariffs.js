Ext.define( 'OSS.store.accounts.Tariffs', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', mapping: 'tar_id', type: 'int' },
        { name: 'name', mapping: 'descr', type: 'string' },
        { name: 'symbol', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tariffs'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
