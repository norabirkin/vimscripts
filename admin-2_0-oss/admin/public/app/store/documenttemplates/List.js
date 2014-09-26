Ext.define('OSS.store.documenttemplates.List', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.documenttemplates.List',
    requires: [ 'OSS.model.documenttemplates.List' ],
    proxy: {                        
        type: 'rest',  
        url: 'index.php/api/documenttemplates',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
