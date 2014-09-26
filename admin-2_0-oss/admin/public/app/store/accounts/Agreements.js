Ext.define('OSS.store.accounts.Agreements', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.Agreement',
    model: 'OSS.model.Agreement',
    proxy: {
        extraParams: {
            is_closed: 10
        },
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agreements'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
