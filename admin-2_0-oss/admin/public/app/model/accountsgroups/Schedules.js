Ext.define('OSS.model.accountsgroups.Schedules', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'acc_name', type: 'string'},
        { name: 'agent_id', type: 'int'},
        { name: 'agent_name', type: 'string'},
        { name: 'agent_type', type: 'int'},
        { name: 'agrm_id', type: 'int'},
        { name: 'agrm_num', type: 'string'},
        { name: 'change_date', type: 'date', dateFormat: 'Y-m-d'},
        { name: 'change_time', type: 'date', dateFormat: 'H:i:s'},
        { name: 'group_id', type: 'int'},
        { name: 'mgr_name', type: 'string'},
        { name: 'pay_code', type: 'string'},
        { name: 'record_id', type: 'int'},
        { name: 'request_by', type: 'string'},
        { name: 'tar_id_new', type: 'int'},
        { name: 'tar_id_old', type: 'int'},
        { name: 'tar_new_cur_id', type: 'int'},
        { name: 'tar_new_name', type: 'string'},
        { name: 'tar_new_symbol', type: 'string'},
        { name: 'tar_old_cur_id', type: 'int'},
        { name: 'tar_old_name', type: 'string'},
        { name: 'tar_old_symbol', type: 'string'},
        { name: 'uid', type: 'int'},
        { name: 'vg_id', type: 'int'},
        { name: 'vg_login', type: 'string'}
    ],
    idProperty: 'record_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/accountsgroupsschedule'), 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
