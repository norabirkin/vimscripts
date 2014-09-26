Ext.define('OSS.model.Account', {
    extend: 'Ext.data.Model',
    idProperty: 'vg_id',
    fields: [
        { name: 'vg_id', type: 'int' },
        { name: 'uid', type: 'int' },
        { name: 'agrm_id', type: 'int' },
        { name: 'blk_req', type: 'int' },
        { name: 'blocked', type: 'int' },
        { name: 'canmodify', type: 'int' },
        { name: 'agent_type', type: 'int' },
        { name: 'cu_id', type: 'int' },
        { name: 'dirty', type: 'int' },
        
        'user_name', 
        'agrm_num', 
        'symbol', 
        'descr', 
        'login', 
        'agent_name', 
        'tar_name', 
        
        { name: 'balance', type: 'float' },
        { name: 'pp_debt', type: 'float' },
        
        { name: 'block_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'acc_on_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'acc_off_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'creation_date', type: 'date', dateFormat: 'Y-m-d H:i:s' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgroup'),
        licid: 'accounts',
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
