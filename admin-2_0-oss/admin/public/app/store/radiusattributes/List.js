Ext.define('OSS.store.radiusattributes.List', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.radiusattributes.List',
    requires: [ 'OSS.model.radiusattributes.List' ],
    proxy: {                        
        type: 'rest',  
        url: 'index.php/api/radiusattributeslist',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
