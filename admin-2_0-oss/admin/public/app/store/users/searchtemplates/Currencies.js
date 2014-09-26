Ext.define( 'OSS.store.users.searchtemplates.Currencies', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.searchtemplate.Currency',
    requires: 'OSS.model.searchtemplate.Currency',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/currencies'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
