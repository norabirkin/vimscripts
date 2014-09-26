Ext.define('OSS.model.users.Agreement', {
    extend: 'Ext.data.Model',
    fields: [
        { type: 'int', name: 'agrm_id' }, 
        { type: 'string', name: 'agrm_num' },
        { type: 'int', name: 'oper_id' },
        { type: 'string', name: 'pay_code' },
        { type: 'string', name: 'balance' },
        { type: 'string', name: 'symbol' }
    ]
});
