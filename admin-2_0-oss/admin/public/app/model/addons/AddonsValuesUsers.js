Ext.define('OSS.model.addons.AddonsValuesUsers', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'descr', type: 'string' },
        { name: 'idx', type: 'int' },
        { name: 'str_value', type: 'string' },
        { name: 'values', type:'auto'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/AddonsValuesAccounts'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
