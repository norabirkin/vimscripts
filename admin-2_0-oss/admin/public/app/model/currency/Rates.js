Ext.define('OSS.model.currency.Rates', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    },{
        name: 'mon',
        type: 'object'
    },{
        name: 'tue',
        type: 'object'
    },{
        name: 'wed',
        type: 'object'
    },{
        name: 'thu',
        type: 'object'
    },{
        name: 'fri',
        type: 'object'
    },{
        name: 'sat',
        type: 'object'
    },{
        name: 'sun',
        type: 'object'
    },{
        name: 'cur_id',
        type: 'object'
    },{
        name: 'currentmonth',
        type: 'int'
    },{
        name: 'currentdate',
        type: 'int'
    }],
    proxy: {                        
        type: 'rest',  
        url: Ext.Ajax.getRestUrl('api/currenciesRates'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});