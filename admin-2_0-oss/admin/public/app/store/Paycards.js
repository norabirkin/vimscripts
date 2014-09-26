Ext.define('OSS.store.Paycards', {
    extend: 'OSS.ux.data.store.JAPI',
    
    requires: [
        'OSS.model.Paycards'
    ],
    
    model: 'OSS.model.Paycards',
    
    proxy: {
        type: 'rest',
        url: 'api/paycards', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
