Ext.define('OSS.model.users.UserVgroups', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name: 'vg_id', type: 'int' },
        { name: 'user_name', type: 'string' },
        { name: 'agrm_id', type: 'int' },
        { name: 'agent_num', type: 'string' },
        { name: 'agent_id', type: 'int' },
        { name: 'agent_type', type: 'int' },
        { name: 'agent_name', type: 'string' },
        { name: 'balance', type: 'float' },
        { name: 'blk_req', type: 'int' },
        { name: 'block_date', type: 'date', format: 'Y-m-d H:i' },
        { name: 'blocked', type: 'int' },
        { name: 'creation_date', type: 'date', format: 'Y-m-d' },
        { name: 'login', type: 'string' },
        { name: 'tar_id', type: 'int' },
        { name: 'tar_name', type: 'string' },
        { name: 'acc_off_date', type: 'date', format: 'Y-m-d' },
        { name: 'acc_on_date', type: 'date', format: 'Y-m-d' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/userForm/VgroupsList'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
