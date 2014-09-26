Ext.define( "OSS.helpers.agents.Data", {
    constructor: function( config ) { 
        var data = {};
        Ext.apply( data, Ext.create( "OSS.model.Agent" ).data );
        this.setData( data );
        this.initConfig(config); 
    },
    setData: function( data ) {
        if (!this.data) {
            this.data = {};
        }
        for (var i in data) {
            this.setParam( i, data[i] );
        }
    },
    reset: function() {
        var data = {};
        Ext.apply( data, Ext.create( "OSS.model.Agent" ).data );
        this.setData( data );
    },
    clear: function() {
        this.data = {};
    },
    setParam: function( name, value ) {
        this.data[ name ] = value;
        if (typeof this.handlers[ name ] == "function") {
            this.handlers[ name ]( value );
        }
    },
    config: { handlers: {} }
});
