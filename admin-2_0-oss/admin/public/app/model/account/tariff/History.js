Ext.define('OSS.model.account.tariff.History', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgrouptariffhistory'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    },
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'discount',
        type: 'float'
    }, {
        name: 'rate',
        type: 'float'
    }, {
        name: 'tar_id_new',
        type: 'int'
    }, {
        name: 'tar_id_old',
        type: 'int'
    }, {
        name: 'vg_id',
        type: 'int'
    }, {
         name: 'is_rasp',
         type: 'bool'
    }, {
         name: 'is_history',
         type: 'bool'
    }, {
        name: 'is_multi',
        type: 'bool'
    }, {
        name: 'tar_new_name',
        type: 'string'
    }, {
        name: 'tar_old_name',
        type: 'string'
    }, {
        name: 'mgr_name',
        type: 'string'
    }, {
         name: 'agent_id',
         type: 'int'
    }, {
        name: 'group_id',
        type: 'int'
    }, {
        name: 'change_time',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'rasp_time',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'time_to',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }]
});
