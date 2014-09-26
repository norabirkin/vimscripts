Ext.define('OSS.helpers.agents.IP', {
    singleton: true,
    validate: function( value ) {
        if (!(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test( value ))) {
            return false;
        }
        value = ( "" + value ).split(".");
        if (value.length < 4) {
            return false;
        }
        for (var i = 0; i < 4; i ++) {
            if ((parseInt( value[i] ) + "") !== (value[i] + "")) {
                return false;
            }
            if (value[i] < 0 || value[i] > 255) {
                return false;
            }
        }
        return true;
    },
    long2ip: function( proper_address ) {
          if ( !isNaN ( proper_address ) && ( proper_address >= 0 || proper_address <= 4294967295 ) ) {
              var output = Math.floor (proper_address / Math.pow ( 256, 3 ) ) +  '.' +
              Math.floor ( ( proper_address % Math.pow ( 256, 3 ) ) / Math.pow ( 256, 2 ) )  + '.' +
              Math.floor ( ( ( proper_address % Math.pow ( 256, 3 ) )  % Math.pow ( 256, 2 ) ) / Math.pow ( 256, 1 ) ) +  '.' +
              Math.floor ( ( ( ( proper_address % Math.pow ( 256, 3 ) ) % Math.pow ( 256, 2 ) ) % Math.pow ( 256, 1 ) ) / Math.pow ( 256, 0 ) );    
              return output;
          } else {
              throw "Invalid IP address";
          }
    },
    prefixSizeToMask: function( prefixSize ) {
        if (prefixSize < 0 || prefixSize > 32) {
            throw "Invalid prefix size";
        }
        return this.long2ip(Math.pow(2,32) - Math.pow(2, (32-prefixSize)));
    },
    getNetworkAddress: function( ip, prefixSize ) {
        if (!this.validate( ip )) {
            throw "Invalid IP address";
        }
        ip = ip.split( "." );
        var network = [];
        var mask = this.prefixSizeToMask(prefixSize);
        mask = mask.split( "." );
        for (var i = 0; i < 4; i ++) {
            network.push( ip[i] & mask[i] );
        }
        network = network.join( "." );
        if (!this.validate( network )) {
            throw "Invalid IP address";
        }
        return network;
    }
});
