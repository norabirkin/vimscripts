Ext.define('OSS.model.accountsgroups.Accounts', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'vg_id', type: 'int' },
        { name: 'userid', type: 'int' },
        { name: 'agrmid', type: 'int' },
        { name: 'agrm_num', type: 'string' },
        { name: 'user_name', type: 'string' },
        { name: 'login', type: 'string' }
    ]
});
