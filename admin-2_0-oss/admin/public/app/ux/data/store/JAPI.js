/**
 * Project common store to send data to the API
 */
Ext.define('OSS.ux.data.store.JAPI', {
    extend: 'Ext.data.Store',
    
    alias: 'store.japi',
    
    requires: [
        'Ext.data.Store'
    ],
    
    constructor: function(config) {
        this.callParent(arguments);
        
        if (this.getProxy()) {
            this.getProxy().url = Ext.Ajax.getRestUrl(this.getProxy().url);
        } 
        //<debug>
        else {
            Ext.Error.raise('Proxy is not configured for the store: ' + config.storeId);
        }
        //</debug>
    }
});
