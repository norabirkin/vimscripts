Ext.define('OSS.model.payments.paymentsform.History', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'amount', type: 'float' },
        { name: 'cur_id', type: 'int' },
        { name: 'cur_symb', type: 'string' },
        { name: 'order_num', type: 'string' },
        { name: 'pay_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'receipt', type: 'string' },
        { name: 'comment', type: 'string' },
        { name: 'registries', type: 'string' },
        { name: 'mgr_fio', type: 'string' },
        { name: 'record_id', type: 'int' },
        { name: 'uid', type: 'int' },
        { name: 'class_id', type: 'int' },
        { name: 'class_name', type: 'string'},
        { name: 'local_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'agrm_id', type: 'int' },
        { name: 'period_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'rev_count', type: 'int' },
        { name: 'rev_no', type: 'int' },
        { name: 'from_agrm_id', type: 'int' },
        { name: 'cancel_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'bso_id', type: 'int' },
        { name: 'is_uprs', type: 'int' }
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
