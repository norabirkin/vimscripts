Ext.define('OSS.model.Paycards', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ser_no', type: 'int' },
        { name: 'set_id', type: 'int' },
        { name: 'set_name', type: 'string' },
        { name: 'card_key', type: 'string' },
        { name: 'sum', type: 'int'},
        { name: 'symbol', type: 'string'},
        { name: 'create_date', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        { name: 'act_til', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        { name: 'expire_period', type: 'string'},
        { name: 'mod_person', type: 'int'},
        { name: 'mod_person_name', type: 'string'},
        { name: 'activate_date', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        { name: 'user_name', type: 'string'}
    ]
});