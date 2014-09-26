Ext.define('OSS.model.users.UserAgreements', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name: 'agrm_id', type: 'int' },
        { name: 'agrm_num', type: 'string' },
        { name: 'balance', type: 'float' },
        { name: 'balance_acc', type: 'float' },
        { name: 'balance_status', type: 'int' },
        { name: 'block_amount', type: 'float' },
        { name: 'close_date', type: 'date' , format: 'Y-m-d'},
        { name: 'create_date', type: 'date' , format: 'Y-m-d', defaultValue: Ext.Date.format(new Date(), 'Y-m-d')},
        { name: 'credit', type: 'float' },
        { name: 'cur_id', type: 'int' },
        { name: 'is_archive', type: 'boolean' },
        { name: 'is_auto', type: 'boolean' },
        { name: 'oper_id', type: 'int' },
        { name: 'priority', type: 'int' },
        { name: 'oper_name', type: 'string' },
        { name: 'owner_id', type: 'int' },
        { name: 'payment_method', type: 'int' },
        { name: 'pay_code', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'uid', type: 'int' },
        { name: 'user_name', type: 'string' },
        { name: 'vgroups', type: 'int' },
        { name: 'b_check', type: 'string' },
        { name: 'b_limit', type: 'float' },
        { name: 'b_notify', type: 'int' },
        { name: 'friend_agrm_id', type: 'int' },
        { name: 'parent_agrm_id', type: 'int' },
        { name: 'parent_number', type: 'string' },
        { name: 'friend_number', type: 'string' },
        { name: 'balance_limit_exceeded', type: 'string' },
        { name: 'balance_strict_limit', type: 'float' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/userForm/AgreementsList'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
