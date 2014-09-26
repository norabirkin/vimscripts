Ext.define('OSS.model.addons.ParamsGrid', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'idx', type: 'int' },
        { name: 'value', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/addonsStaff/Values'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
