Ext.define('OSS.store.catalog.Tree', {
    extend: 'Ext.data.TreeStore',
    model: 'OSS.model.catalog.Tree',
    requires: [ 'OSS.model.catalog.Tree' ],
    proxy: {                        
        type: 'ajax',   
        url: 'index.php/api/catalogs'
    }
});
