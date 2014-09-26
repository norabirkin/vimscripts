Ext.define( 'OSS.store.SearchTemplates', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.SearchTemplate',
    model: 'OSS.model.SearchTemplate',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('/api/searchtemplates'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
