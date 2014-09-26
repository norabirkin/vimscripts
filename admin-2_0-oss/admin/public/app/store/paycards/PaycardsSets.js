Ext.define( 'OSS.store.paycards.PaycardsSets', {
    extend: 'OSS.ux.data.store.JAPI',
    requires:'OSS.model.paycards.Set',
    model:'OSS.model.paycards.Set',
    proxy: {
        type: 'rest',
        url: 'api/paycardssets',
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    },
    pageSize: 100
});