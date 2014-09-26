Ext.define( 'OSS.store.payments.history.Payments', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payments'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    },
    fields: [
        {
            name: 'agrm_id',
            type: 'int'
        }, 
        {
            name: 'amount',
            type: 'float'
        }, 
        {
            name: 'cur_symb',
            type: 'string'
        }, 
        {
            name: 'order_num',
            type: 'string'
        }, 
        {
            name: 'pay_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, 
        {
            name: 'local_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, 
        {
            name: 'receipt',
            type: 'string'
        }, 
        {
            name: 'record_id',
            type: 'int'
        }, 
        {
            name: 'uid',
            type: 'int'
        }, 
        {
            name: 'mgr_fio',
            type: 'string'
        }, 
        {
            name: 'comment',
            type: 'string'
        }, 
        {
            name: 'class_id',
            type: 'int'
        }, 
        {
            name: 'class_name',
            type: 'string'
        }, 
        {
            name: 'bso',
            type: 'string'
        },
        {
            name: 'from_agrm_number',
            type: 'string'
        },
        {
            name: 'payment_order_number',
            type: 'string'
        }
    ]
});
