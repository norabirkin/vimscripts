Ext.define('OSS.store.promotions.List', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.promotions.List',
    requires: [ 'OSS.model.promotions.List' ],
    proxy: {                        
        type: 'rest',  
        url: 'index.php/api/promotions',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
