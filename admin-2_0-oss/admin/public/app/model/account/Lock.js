Ext.define('OSS.model.account.Lock', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'block_type',
        type: 'int'
    }, {
        name: 'change_time',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'time_to',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'mgr_descr',
        type: 'string'
    }, {
        name: 'is_history',
        type: 'bool'
    }, {
        name: 'mgr_name',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }, {
        name: 'request_by',
        type: 'int'
    }, {
        name: 'vg_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgrouplocks'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
