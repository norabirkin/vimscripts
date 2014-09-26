Ext.define('OSS.store.packets.List', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.packets.List',
    requires: [ 'OSS.model.packets.List' ],
    proxy: {                        
        type: 'rest',  
        url: 'index.php/api/packets',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
