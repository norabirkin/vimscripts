/**
 * Тариф
 */
Ext.define('OSS.model.account.Tariff', {
    extend: 'Ext.data.Model',
    idProperty: 'tar_id',
    fields: [{
        name: 'tar_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'type',
        type: 'int'
    }, {
        name: 'act_block',
        defaultValue: -1,
        type: 'int'
    }, {
        name: 'daily_rent',
        defaultValue: 2,
        type: 'int'
    }, {
        name: 'unavailable',
        type: 'int'
    }, {
        name: 'rent',
        type: 'float'
    }, {
        name: 'symbol',
        type: 'string'
    }, {
        name: 'ext_vg_count',
        type: 'int'
    }, {
        name: 'additional',
        type: 'int'
    }, {
        name: 'cur_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tariffs'),
        licid: 'tariffs',
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
