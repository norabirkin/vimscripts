/**
 * Change default logic for the Button
 */
/**
 * Change default functions
 */
Ext.define('OSS.overrides.Button', function() {
    return {
        override: 'Ext.button.Button',
        
        
        /**
         * Missed functional (4.1.1a)
         * State storing
         */
        getState: function() {
            if (this.enableToggle == true) {
                var config = {};
                config.pressed = this.pressed;
                return config;
            }
            return null;
        }
    };
}());
