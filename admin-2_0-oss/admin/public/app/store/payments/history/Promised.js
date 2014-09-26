Ext.define( 'OSS.store.payments.history.Promised', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields:[
        {
            name: 'record_id', 
            type: 'int'
        },
        {
            name: 'agrm_id', 
            type: 'int'
        },
        {
            name: 'pay_id', 
            type: 'int'
        },
        {
            name: 'curr_id', 
            type: 'int'
        },
        {
            name: 'symbol',
            type: 'string'
        },
        {
            name: 'debt',
            type: 'float'
        },
        {
            name: 'amount',
            type: 'float'
        },
        {
            name: 'prom_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        },
        {
            name: 'prom_till',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/promised'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
