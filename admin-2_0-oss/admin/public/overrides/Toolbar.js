/**
 * Override main class Toolbar
 */
Ext.define('OSS.overrides.Toolbar', function() {
    return {
        override: 'Ext.toolbar.Toolbar',
        
        /**
         * Write extra params to the grid store
         * @param {Object} params
         */
        refreshGrid: function( params ) {
            var fields = this.query("field"),
                i,
                value,
                name,
                j,
                store = this.up("gridpanel").getStore();
            
            if (params === undefined) {
                params = {};
            }
            
            for ( j in store.proxy.extraParams ) {
                if ( !(j in params) ) { 
                    params[j] = store.proxy.extraParams[j];
                }
            }
            
            for ( i = 0; i < fields.length; i ++ ) {
                if ( typeof fields[i].getToolbarValue == 'function' ) { 
                    value = fields[i].getToolbarValue(); 
                }
                else { 
                    value = fields[i].getValue();
                }
                if ( fields[i].xtypesMap.datefield ) { 
                    value = Ext.Date.format( value, fields[i].format );
                }
                if ( fields[i].xtypesMap.checkbox ) { 
                    value = value ? 1 : 0;
                }
                name = fields[i].getName();
                if ( name in params ) { 
                    delete(params[name]);
                }
                if ( value !== undefined && value !== null && value !== "" ) {
                    params[name] = value;
                }
            }
            if ( typeof store.loadIfNeccessary == "function" ) {
                store.setExtraParams( params );
                store.loadIfNeccessary(); 
            } else {
                store.proxy.extraParams = params;
                store.load(); 
            }
        }
    };
}());
