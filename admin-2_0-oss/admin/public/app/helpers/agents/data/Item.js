Ext.define( "OSS.helpers.agents.data.Item", {
    constructor: function( config ) { this.initConfig(config); },
setValue: function( value ) {
        this.value = value;
    },
    config: {
        value: null
    }
});
