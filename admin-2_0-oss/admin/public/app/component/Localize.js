/**
 * Localize class
 *
 */
Ext.define("OSS.component.Localize", {
    extend: 'Ext.util.MixedCollection',
    
    singleton: true,
    
    requires: [
        'Ext.String',
        'Ext.Ajax',
        'Ext.util.MixedCollection'
    ],
    
    alternateClassName: [
       // This alternate name is deprecated, use i18n
       'OSS.Localize',
       'i18n'
    ],
    
    /**
     * Apply default configuration
     */
    config: {
        language: "ru",
        defaultGlue: " "
    },
    
    
    /**
     * Initialize component
     */
    constructor: function() {
        this.callParent(arguments);
        this.load();
    },
    
    
    /**
     * Pick up from global variables Localize data
     */
    load: function() {
        var localize = window.Localize || null;

        if(localize) {
            this.addAll(localize);
            Localize = null;
        }
    },
    
    
    /**
     * Localize passed data
     * @param Mixed
     * 
     *  i18n.get("Some data");
     *  i18n.get({
     *      msg: "Some data '%here'",
     *      params: {
     *          "%here": "Reg"
     *      }
     *  });
     *  i18n.get({
     *      msg: "Some data '%here'",
     *      params: {
     *          "%here": "Reg"
     *      }
     *  }, {
     *      msg: "Rainbow: {0} colors",
     *      params: [ 'seven' ]
     *  });
     */
    get: function() {
        var me = this,
            args = arguments,
            result = [],
            key,
            value,
            params;

        for(var i = 0, off = args.length; i < off; i++) {
            if(typeof args[i] == 'string') {
                result.push(me.superclass.get.call(this, args[i]) || args[i]);
            }
            else if(typeof args[i] == 'object') {
                key = args[i].msg || "";
                params = args[i].params || null;
                value = me.superclass.get.call(this, key) || key;

                if(Ext.isObject(params)) {
                    for (var k in params) {
                        value = value.replace(k, params[k]);
                    }
                }
                else if(Ext.isArray(params)) {
                    params.unshift(key);
                    value = Ext.String.format.apply(this, params);
                }

                result.push(value);
            }
        }

        return result.join(this.getDefaultGlue());
    }
});
