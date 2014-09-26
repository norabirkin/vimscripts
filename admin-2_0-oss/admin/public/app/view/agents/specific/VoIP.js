Ext.define( "OSS.view.agents.specific.VoIP", {
    extend: "OSS.view.agents.FormTabBase",
    mixins: [ "OSS.view.agents.FormTab" ],
    title: OSS.Localize.get("Specific settings"),
    items: [{
        xtype: "fieldset",
        style: {
            backgroundColor: '#f0f0f0'
        },
        margin: '10 10 10 10',
        items: [{
            xtype: "numberfield",
            labelWidth: 300,
            name: "rauthport",
            fieldLabel: i18n.get("RADIUS authentication")
        }, {
            xtype: "numberfield",
            labelWidth: 300,
            name: "raccport",
            fieldLabel: i18n.get("RADIUS accounting")
        }, {
            xtype: "checkbox",
            labelWidth: 300,
            name: "failed_calls",
            fieldLabel: i18n.get("Save unsuccessful calls")
        }, {
            xtype: "numberfield",
            labelWidth: 300,
            name: "session_lifetime",
            fieldLabel: i18n.get("Timeout of dead session")
        }, {
            xtype: "numberfield",
            labelWidth: 300,
            name: "max_radius_timeout",
            fieldLabel: i18n.get("Call maximum duration")
        }, {
            xtype: "textfield",
            labelWidth: 300,
            name: "voip_card_user",
            fieldLabel: i18n.get("Activated card common User-Name")
        }]
    }]
});
