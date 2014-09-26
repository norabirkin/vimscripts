Ext.define("OSS.view.agents.specific.PCDR", {
    extend: "OSS.view.agents.FormTabBase",
    mixins: [ "OSS.view.agents.SpecificSettingsWithAgentOptions" ],
    title: OSS.Localize.get("Specific settings"),
    items: [
        {
            xtype: "fieldset",
            style: {
                backgroundColor: '#f0f0f0'
            },
            margin: '10 10 10 10',
            items: [{ 
                xtype: "combobox", 
                labelWidth: 300, 
                fieldLabel: OSS.Localize.get("Algorithm to identify call direction"),
                name: "tel_direction_mode",
                displayField: "name",
                valueField: "id",
                value: 0,
                store: Ext.create("Ext.data.Store", {
                    fields: [ "id", "name" ],
                    data: [
                        { id: 0, name: OSS.Localize.get("Default") },
                        { id: 1, name: OSS.Localize.get("Phone numbers") }
                    ]
                })
            },
            {
                xtype: "checkbox",
                labelWidth: 300,
                inputValue: 1,
                name: "failed_calls",
                fieldLabel: i18n.get("Take stock of broken calls")
            }]
        },
        {
            xtype: "fieldset",
            style: {
                backgroundColor: '#f0f0f0'
            },
            margin: '0 10 10 10',
            items: [
                {
                    xtype: "textfield",
                    labelWidth: 300,
                    name: "tel_src",
                    fieldLabel: i18n.get("Stream file")
                },
                {
                    xtype: "combobox", 
                    labelWidth: 300, 
                    fieldLabel: OSS.Localize.get("Speed"),
                    name: "com_speed",
                    displayField: "name",
                    valueField: "id",
                    value: 0,
                    store: Ext.create("Ext.data.Store", {
                        fields: [ "id", "name" ],
                        data: [
                            { id: 0, name: 1200 },
                            { id: 1, name: 2400 },
                            { id: 2, name: 4800 },
                            { id: 3, name: 9600 },
                            { id: 4, name: 19200 },
                            { id: 5, name: 38400 },
                            { id: 6, name: 57600 },
                            { id: 7, name: 115200 }
                        ]
                    })
                },
                { 
                    xtype: "combobox", 
                    labelWidth: 300, 
                    fieldLabel: OSS.Localize.get("Parity"),
                    displayField: "name",
                    name: "com_parity",
                    valueField: "id",
                    value: 0,
                    store: Ext.create("Ext.data.Store", {
                        fields: [ "id", "name" ],
                        data: [
                            { id: 0, name: "even parity" },
                            { id: 1, name: "odd parity" },
                            { id: 2, name: "no parity" }
                        ]
                    })
                },
                { 
                    xtype: "combobox", 
                    labelWidth: 300, 
                    fieldLabel: OSS.Localize.get("Data bits"),
                    name: "com_data_bits",
                    displayField: "name",
                    valueField: "id",
                    value: 0,
                    store: Ext.create("Ext.data.Store", {
                        fields: [ "id", "name" ],
                        data: [
                            { id: 0, name: 5 },
                            { id: 1, name: 6 },
                            { id: 2, name: 7 },
                            { id: 3, name: 8 }
                        ]
                    })
                },
                { 
                    xtype: "combobox", 
                    labelWidth: 300, 
                    fieldLabel: OSS.Localize.get("Stop bits"),
                    name: "com_stop_bits",
                    displayField: "name",
                    valueField: "id",
                    value: 0,
                    store: Ext.create("Ext.data.Store", {
                        fields: [ "id", "name" ],
                        data: [
                            { id: 0, name: 1 },
                            { id: 1, name: 2 }
                        ]
                    })
                },
                {
                    xtype: 'checkbox',
                    name: 'instantly_amount',
                    labelWidth: 300,
                    fieldLabel: i18n.get('Delayed tarification')
                }
            ]
        }
    ]
});
