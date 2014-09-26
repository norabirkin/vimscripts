Ext.define( 'OSS.store.users.Agreements', {
    extend: 'Ext.data.Store',
    requires:'OSS.model.users.Agreement',
    model:'OSS.model.users.Agreement',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agreements'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
