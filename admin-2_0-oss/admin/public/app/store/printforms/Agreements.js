Ext.define( 'OSS.store.printforms.Agreements', {
    extend: 'Ext.data.Store',
    requires:'OSS.model.printforms.Agreements',
    model:'OSS.model.printforms.Agreements',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agreements'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
