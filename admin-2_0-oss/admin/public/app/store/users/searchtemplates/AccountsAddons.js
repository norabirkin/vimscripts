Ext.define( 'OSS.store.users.searchtemplates.AccountsAddons', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.users.searchtemplates.Parameter',
    model: 'OSS.model.users.searchtemplates.Parameter',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/accountsaddons'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

