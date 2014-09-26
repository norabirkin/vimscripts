Ext.define( 'OSS.helpers.Timeout', {
    constructor: function( config ) { this.initConfig(config); },
    config: {
        delay: 500,
        onDelayTimeExeeded: function() {},
        timeout: null,
        scope: {},
        run: function() {
            if (this.timeout != null) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = window.setTimeout( Ext.Function.bind( this.onDelayTimeExeeded, this.scope ), this.delay );
        }
    }
});
