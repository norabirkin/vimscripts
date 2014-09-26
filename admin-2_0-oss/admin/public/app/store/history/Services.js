Ext.define( 'OSS.store.history.Services', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields: [
        { name: 'dt', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'period', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'agrm_id', type: 'int' },
        { name: 'vg_id', type: 'int' },
        { name: 'agent_id', type: 'int' },
        { name: 'agent_type', type: 'int' },
        { name: 'agent_descr', type: 'string' },
        { name: 'tar_descr', type: 'string' },
        { name: 'cat_descr', type: 'string' },
        { name: 'curr_symbol', type: 'string' },
        { name: 'user_name', type: 'string' },
        { name: 'agrm_num', type: 'string' },
        { name: 'vg_login', type: 'string' },
        { name: 'tar_id', type: 'int' },
        { name: 'volume', type: 'float' },
        { name: 'amount', type: 'float' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/statistics?repnum=6&repdetail=0'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
