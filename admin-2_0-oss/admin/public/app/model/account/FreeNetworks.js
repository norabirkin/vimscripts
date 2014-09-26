Ext.define('OSS.model.account.FreeNetworks', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'ip',
        type: 'string'
    }, {
        name: 'mask',
        type: 'string'
    }, {
        name: 'segment_id',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/networking/FreeSegments'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
