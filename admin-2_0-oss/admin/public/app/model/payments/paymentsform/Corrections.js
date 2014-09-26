Ext.define('OSS.model.payments.paymentsform.Corrections', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'amount', type: 'float' },
        { name: 'cur_id', type: 'int' },
        { name: 'cur_symb', type: 'string' },
        { name: 'order_num', type: 'string' },
        { name: 'pay_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'receipt', type: 'string' },
        { name: 'comment', type: 'string' },
        { name: 'mgr_fio', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'rev_no', type: 'int' },
        { name: 'rev_count', type: 'int' },
        { name: 'agrm_id', type: 'int' },
        { name: 'agrm_num', type: 'string' },
        { name: 'from_agrm_id', type: 'int' },
        { name: 'bso_id', type: 'int' },
        { name: 'from_agrm_number', type: 'string' },
        { name: 'cancel_date', type: 'date', dateFormat: 'Y-m-d H:i:s' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payments'), 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
