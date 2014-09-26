Ext.define('OSS.model.paycards.Set', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'acc_name', type: 'string' }, 
        { name: 'acc_tpl', type: 'int' }, 
        { name: 'cards_count', type: 'int' }, 
        { name: 'created_by', type: 'int' }, 
        { name: 'cur_id', type: 'int' }, 
        { name: 'cur_name', type: 'string' }, 
        { name: 'expire_period', type: 'int' }, 
        { name: 'set_descr', type: 'string' }, 
        { name: 'set_id', type: 'int' }
    ]
});
