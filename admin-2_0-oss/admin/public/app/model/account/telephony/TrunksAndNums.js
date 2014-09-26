Ext.define('OSS.model.account.telephony.TrunksAndNums', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'comment',
        type: 'string'
    }, {
        name: 'device',
        type: 'int'
    }, {
        name: 'number',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }, {
        name: 'time_from',
        type: 'string'
    }, {
        name: 'time_to',
        type: 'string'
    }, {
        name: 'vg_id',
        type: 'int'
    }, {
        name: 'type',
        type: 'int'
    }, {
        name: 'check_duplicate',
        type: 'boolean'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgrouptelephony'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
