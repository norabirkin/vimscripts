Ext.define('OSS.model.documenttemplates.TemplateFiles', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'file_name', type: 'string'}
    ],
    idProperty: 'file_name',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/templatefiles'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});