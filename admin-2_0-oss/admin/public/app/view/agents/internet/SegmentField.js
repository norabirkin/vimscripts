Ext.define( 'OSS.view.agents.internet.SegmentField', {
    extend: "OSS.ux.form.field.IPField",
    alias: "widget.segmentfield",
    name: "ip", 
    allowBlank: false,
    value: "127.0.0.0",
    fieldLabel: OSS.Localize.get("Segment"),
    validator: function() {
        var message = this.callParent(); 
        if (message !== true) {
            return message;
        }
        var form = this.up( "form" );
        var mask = form.down( "numberfield[name=mask]" ).getValue();
        var gateway = form.down( "ipfield[name=gateway]" ).getValue();
        try {
            if (this.getValue() != OSS.helpers.agents.IP.getNetworkAddress(gateway, mask)) {
                return OSS.Localize.get("Gateway doesn`t belong to network");
            }
        } catch (e) {
        }
        return true;
    }
});
