Ext.define('OSS.model.account.telephony.Number', {
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
        type: 'date'
    }, {
        name: 'time_to',
        type: 'date'
    }, {
        name: 'vg_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgrouptelephonynumbers'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
