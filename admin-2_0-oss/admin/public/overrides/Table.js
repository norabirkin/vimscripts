Ext.define('OSS.overrides.view.Table', function(){ return {
    override: 'Ext.view.Table',
    doStripeRows: function( startRow ) {
        if (startRow != -1) { this.callParent(arguments); }
    }
}}());
