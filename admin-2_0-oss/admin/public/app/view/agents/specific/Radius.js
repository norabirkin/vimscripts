Ext.define("OSS.view.agents.specific.Radius", {
    extend: "OSS.view.agents.FormTabBase",
    itemId: "radius",
    mixins: [ "OSS.view.agents.SpecificSettingsWithAgentOptions" ],
    title: OSS.Localize.get("Specific settings"),
    items: [
        {
            xtype: 'fieldset',
            layout: 'hbox',
            style: {
                backgroundColor: '#f0f0f0'
            },
            margin: '10 10 10 10',
            items: [{
                xtype: "container", 
                flex: 1,
                items: [
                    { xtype: "ipfield", labelWidth: 300, name: "nfhost", fieldLabel: OSS.Localize.get("Listen IP"), value: "0.0.0.0" },
                    { xtype: "numberfield", labelWidth: 300, name: "rauthport", fieldLabel: OSS.Localize.get("RADIUS authentication"), value: 1812 },
                    { xtype: "numberfield", labelWidth: 300, name: "raccport", fieldLabel: OSS.Localize.get("RADIUS accounting"), value: 1813 },
                    { 
                        xtype: "combobox", 
                        queryMode: "local",
                        displayField: "name", 
                        valueField: "id", 
                        labelWidth: 300, 
                        name: "remulate_on_naid",
                        value: 0,
                        fieldLabel: OSS.Localize.get("Module accounts manipulate"), 
                        store: "agents.internet.radius.EmulateAgents" 
                    },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "oper_cat", fieldLabel: OSS.Localize.get("Authorize no existing users to guest network") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "skip-empty-framed-ip", fieldLabel: (OSS.Localize.get("Do not send attribute") + " Framed-IP-Address") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "radius_insert_mac_staff", fieldLabel: OSS.Localize.get("Save MAC-address from RADIUS-requests") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "radius_keep_only_last_auth_info", fieldLabel: OSS.Localize.get("Keep only last auth info") }
                ]
            }, {
                xtype: "container", 
                flex: 1,
                items: [
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "rad_stop_expired", fieldLabel: OSS.Localize.get("Execute script_stop for the buzz sessions") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "restart_shape", fieldLabel: OSS.Localize.get("Execute script_stop when shape rate was changed") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "raddrpool", fieldLabel: OSS.Localize.get("Dynamic address pool") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "save_stat_addr", fieldLabel: OSS.Localize.get("Keep in mind static addresses") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "ignorelocal", fieldLabel: OSS.Localize.get("Exclude broadcast addresses") },
                    { xtype: "checkbox", labelWidth: 300, inputValue: 1, name: "failed_calls", fieldLabel: OSS.Localize.get("Ignore traffic for blocked accounts") },
                    { xtype: "numberfield", labelWidth: 300, name: "session_lifetime", fieldLabel: OSS.Localize.get("Dead session timeout"), value: 86400 },
                    { xtype: "numberfield", labelWidth: 300, name: "max_radius_timeout", fieldLabel: OSS.Localize.get("Session time to live"), value: 86400 },
                    { xtype: "textfield", labelWidth: 300, name: "eapcertpassword", fieldLabel: OSS.Localize.get("Certification EAP password"), inputType: 'password'}
                ]
            }]
        },
        { 
            xtype: "fieldset", 
            style: {
                backgroundColor: '#f0f0f0'
            },
            margin: '0 10 10 10',
            itemId: "dhcp",
            title: ("DHCP " + OSS.Localize.get("Server")),
            items: [
                { xtype: "numberfield", labelWidth: 300, name: "dhcpd_port", minValue: 0, fieldLabel: OSS.Localize.get("Port") },
                { xtype: "ipfield", labelWidth: 300, name: "dhcpd_ip", fieldLabel: OSS.Localize.get("Address") },
                { xtype: "textfield", labelWidth: 300, name: "dhcp-domain-name", fieldLabel: "dhcp-domain-name", hidden: true },
                { xtype: "textfield", labelWidth: 300, name: "dhcp-identifier", fieldLabel: "dhcp-identifier", hidden: true },
                { xtype: "textfield", labelWidth: 300, name: "dhcp-lease-time", fieldLabel: "dhcp-lease-time", hidden: true },
                { xtype: "textfield", labelWidth: 300, name: "radius-nameserver", fieldLabel: "radius-nameserver", hidden: true },
                { xtype: "textfield", labelWidth: 300, name: "radius-nameserver2", fieldLabel: "radius-nameserver2", hidden: true }
            ]
        }
    ],
    setValues: function( values ) {
        this.getForm().setValues( values );
    },
    getValues: function() {
        return this.getForm().getValues();
    }
});
