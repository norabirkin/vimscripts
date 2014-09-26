Ext.define('OSS.model.payments.paymentsform.Accounts', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'agrm_id', type: 'int' },
        { name: 'agrm_num', type: 'string' },
        { name: 'balance', type: 'float' },
        { name: 'close_date', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'create_date', type: 'date', dateFormat: 'Y-m-d'},
        { name: 'oper_name', type: 'string'},
        { name: 'pay_code', type: 'string'},
        { name: 'ppdebt', type: 'float'},
        { name: 'formatted_balance', type: 'string'},
        { name: 'symbol', type: 'string'},
        { name: 'name', type: 'string'},
        { name: 'uid', type: 'int'},
        { name: 'category', type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payments/showPaymentsAccountsList'), 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
