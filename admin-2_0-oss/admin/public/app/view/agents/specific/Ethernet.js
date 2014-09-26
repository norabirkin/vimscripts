Ext.define("OSS.view.agents.specific.Ethernet", {
    extend: "OSS.view.agents.FormTabBase",
    itemId: "ethernet",
    mixins: ["OSS.view.agents.FormTab"],
    title: OSS.Localize.get("Specific settings"),
    items: [{
        xtype: "fieldset",
        style: {
            backgroundColor: '#f0f0f0'
        },
        margin: '10 10 10 10',
        items: [{
            xtype: "checkbox",
            inputValue: 1,
            labelWidth: 300,
            name: "failed_calls",
            fieldLabel: i18n.get("Ignore traffic for blocked accounts")
        }, {
            xtype: "checkbox",
            inputValue: 1,
            labelWidth: 300,
            name: "ignorelocal",
            fieldLabel: i18n.get( "Ignore local traffic" )
        }]
    }]
});
