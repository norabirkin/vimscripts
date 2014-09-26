Ext.define('OSS.model.account.telephony.Trunk', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'comment',
        type: 'string'
    }, {
        name: 'number',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }, {
        name: 'device',
        type: 'int',
        defaultValue: 2
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
        url: Ext.Ajax.getRestUrl('api/vgrouptelephonytrunks'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
