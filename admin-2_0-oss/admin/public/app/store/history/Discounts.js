Ext.define( 'OSS.store.history.Discounts', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'tar_name', type: 'string' }, 
        { name: 'costwithdisc', type: 'string' }, 
        { name: 'category', type: 'string' },
        { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/statistics?repnum=28'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
