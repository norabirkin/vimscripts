Ext.define('OSS.model.addons.AddonsValuesAgreements', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'idx',  type: 'int'}, 
        { name: 'agrm_id', type: 'int' },
        { name: 'descr', type: 'string' },
        { name: 'str_value', type: 'string' },
        { name: 'values', type: 'auto'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/AddonsValuesAgreements'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
