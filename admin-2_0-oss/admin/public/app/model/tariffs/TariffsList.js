Ext.define('OSS.model.tariffs.TariffsList', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'descr', type: 'string' },
        {name: 'tar_id',  type: 'int'},
        {name: 'type', type: 'int'}, 
        {name: 'daily_rent', type: 'int'},
        {name: 'act_block', type: 'int'},
        {name: 'rent', type: 'int'},
        {name: 'ext_vg_count', type: 'int'},
        {name: 'additional', type: 'int'},
        {name: 'symbol', type: 'string'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/Tariffs'),
        licid: 'tariffs',
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
