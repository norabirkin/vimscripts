Ext.define( 'OSS.store.history.Locks', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields: [
        {
            name: 'timefrom',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, 
        {
            name: 'timeto',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, 
        {
            name: 'block_type',
            type: 'int'
        }, 
        {
            name: 'agrm_num',
            type: 'string'
        }, 
        {
            name: 'vg_login',
            type: 'string'
        }, 
        {
            name: 'manager_name',
            type: 'string'
        }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/statistics?repnum=12'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
