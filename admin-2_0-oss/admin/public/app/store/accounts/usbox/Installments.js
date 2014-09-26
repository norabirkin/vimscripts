Ext.define('OSS.store.accounts.usbox.Installments', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'plan_id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/installments'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
