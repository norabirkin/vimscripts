Ext.define( 'OSS.store.history.Balance', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields: [
        {
            name: 'dt',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, 
        {
            name: 'agrm_id',
            type: 'int'
        }, 
        {
            name: 'uid',
            type: 'int'
        }, 
        {
            name: 'vg_id',
            type: 'int'
        }, 
        {
            name: 'cur_id',
            type: 'int'
        }, 
        {
            name: 'curr_symbol',
            type: 'string'
        }, 
        {
            name: 'vg_login',
            type: 'string'
        }, 
        {
            name: 'agrm_num',
            type: 'string'
        }, 
        {
            name: 'user_name',
            type: 'string'
        }, 
        {
            name: 'balance',
            type: 'float'
        }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/statistics?repnum=11'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
