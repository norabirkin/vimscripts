Ext.define("OSS.view.agents.specific.UsBox", {
    extend: "OSS.view.agents.FormTabBase",
    licid: 'full',
    mixins: [ "OSS.view.agents.SpecificSettingsWithAgentOptions" ],
    title: OSS.Localize.get( "Specific settings" ),
    initComponent: function() {
        this.items = [
            {
                xtype: "fieldset",
                style: {
                    backgroundColor: '#f0f0f0'
                },
                margin: '10 10 10 10',
                items:[{
                    xtype: "checkbox",
                    inputValue: 1,
                    labelWidth: 300,
                    name: "ignorelocal",
                    fieldLabel: i18n.get("Assign services of the tariff which was scheduled")
                }]
            },
            { 
                xtype: "fieldset", 
                style: {
                    backgroundColor: '#f0f0f0'
                },
                margin: '0 10 10 10',
                title: OSS.Localize.get("D-TV"),
                items:[
                    { xtype: "checkbox", labelWidth: 300, name: "use_cas", fieldLabel: OSS.Localize.get("Module D-TV") },
                    { xtype: "checkbox", labelWidth: 300, name: "use_smartcards", fieldLabel: OSS.Localize.get("Использовать смарткарты") },
                    { xtype: "ipfield", labelWidth: 300, name: "cas_host", fieldLabel: OSS.Localize.get("Address") },
                    { xtype: "numberfield", minValue: 0, labelWidth: 300, name: "cas_port", fieldLabel: OSS.Localize.get("Port") },
                    { xtype: "textfield", labelWidth: 300, name: "operator_tag", fieldLabel: OSS.Localize.get("Operator") },
                    { xtype: "textfield", labelWidth: 300, name: "nationality", fieldLabel: OSS.Localize.get("Country") },
                    { xtype: "textfield", labelWidth: 300, name: "region", fieldLabel: OSS.Localize.get("Region") },
                    { xtype: "numberfield", minValue: 0, labelWidth: 300, name: "refresh_sec", fieldLabel: OSS.Localize.get("Period to refresh package list (sec-s)") },
                    { xtype: "textfield", labelWidth: 300, name: "city_code", fieldLabel: OSS.Localize.get("City code") },
                    { xtype: "textfield", labelWidth: 300, name: "channels_filter", fieldLabel: OSS.Localize.get("Channels filter") },
                    { xtype: "numberfield", minValue: 0, labelWidth: 300, name: "keep_turned_on_month", fieldLabel: OSS.Localize.get("Do not turn off required channels, months") },
                    { xtype: "textfield", labelWidth: 300, name: "middleware_login", fieldLabel: OSS.Localize.get("Login") },
                    { xtype: "textfield", labelWidth: 300, name: "middleware_password", fieldLabel: OSS.Localize.get("Password") },
                    { xtype: "textfield", labelWidth: 300, name: "middleware_http_endpoint", fieldLabel: OSS.Localize.get("HTTP endpoint") },
                    { 
                        xtype: "combobox", 
                        labelWidth: 300, 
                        width: 550,
                        name: "dtv_type", 
                        fieldLabel: OSS.Localize.get( "Type" ), 
                        valueField: "id",
                        displayField: "name",
                        value: 0,
                        queryMode: "local",
                        store: Ext.create( "Ext.data.Store", {
                            fields: [{ name: "id", type: "int" }, { name: "name", type: "string" }],
                            data: [
                                { id: 0, name: "Irdeto/irdeto" },
                                { id: 1, name: "DRE Crypt/dre" },
                                { id: 2, name: "CerberCrypt/cerbercrypt" },
                                { id: 3, name: OSS.Localize.get( "Hybrid television" ) + "/hybrid" }
                            ] 

                        })
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
