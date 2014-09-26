Ext.define('OSS.model.account.ASNumbers', {
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
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/networking/GetNumbers'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
