Ext.define('OSS.model.users.UserDocuments', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name: 'on_fly', type: 'int' },
        { name: 'document_period', type: 'int' },
        { name: 'agrm_id', type: 'int' },
        { name: 'agrm_num', type: 'string' },
        { name: 'acc_name', type: 'string' },
        { name: 'creation_date', type: 'string' },
        { name: 'cur_id', type: 'int' },
        { name: 'doc_name', type: 'string' },
        { name: 'file_name', type: 'string' },
        { name: 'oper_id', type: 'int' },
        { name: 'oper_name', type: 'string' },      
        { name: 'order_date', type: 'date' , format: 'Y-m-d' },     
        { name: 'order_id', type: 'int' },
        { name: 'order_num', type: 'string' },
        { name: 'pay_date', type: 'date' , format: 'Y-m-d' },
        { name: 'payable', type: 'int' },
        { name: 'period', type: 'string' },     
        { name: 're_summ', type: 'float' },
        { name: 'receipt', type: 'string' },
        { name: 'save_path', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'tax_summ', type: 'float' },
        { name: 'template', type: 'string' },
        { name: 'uid', type: 'int' },
        { name: 'upload_ext', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/userForm/OrdersList'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
