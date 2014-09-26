Ext.define('OSS.model.account.MacAddress', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'network_id',
        type: 'int'
    }, {
        name: 'mac',
        type: 'string'
    }, {
        name: 'network',
        type: 'string'
    }, {
        name: 'segment_id',
        type: 'int'
    }, {
        name: 'vg_id',
        type: 'int'
    }, {
        name: 'record_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/vgroupmacaddress'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});