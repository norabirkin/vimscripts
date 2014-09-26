Ext.define('OSS.store.printingformsstat.List', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.printingformsstat.List',
    requires: [ 'OSS.model.printingformsstat.List' ],
    proxy: {                        
        type: 'rest',  
        url: 'index.php/api/printingforms',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
