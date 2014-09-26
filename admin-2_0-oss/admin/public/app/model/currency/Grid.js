Ext.define('OSS.model.currency.Grid', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'code_okv',
        type: 'int'
    }, {
        name: 'id',
        type: 'int',
        mapping: 'cur_id'
    }, {
        name: 'is_def',
        type: 'boolean'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'symbol',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/currencies'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});