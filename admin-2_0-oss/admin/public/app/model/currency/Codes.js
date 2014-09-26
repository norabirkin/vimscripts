Ext.define('OSS.model.currency.Codes', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'code_name',
        type: 'string'
    }, {
        name: 'countries',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }],
    proxy: {                        
        type: 'rest',  
        url: Ext.Ajax.getRestUrl('api/currenciesCodes'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
