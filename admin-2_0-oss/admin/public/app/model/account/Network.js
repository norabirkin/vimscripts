Ext.define('OSS.model.account.Network', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'vg_id',
        type: 'int'
    }, {
        name: 'type',
        type: 'int'
    }, {
        name: 'as_num',
        type: 'int'
    }, {
        name: 'network',
        type: 'string'
    }, {
        name: 'netmask',
        type: 'string'
    }, {
        name: 'masknum',
        type: 'string'
    }, {
        name: 'hwaddr',
        type: 'string'
    }, {
        name: 'segment_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgroupnetworks'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
