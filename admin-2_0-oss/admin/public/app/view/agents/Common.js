Ext.define( 'OSS.view.agents.Common', {
    extend: "OSS.view.agents.FormTabBase",
    alias: "widget.agents_common_settings",
    itemId: "common",
    title: OSS.Localize.get("Common settings"),
    initComponent: function() {
        this.items = [
            { xtype: "hidden", name: "id" },
            {
                xtype: "fieldset",
                style: {
                    backgroundColor: '#f0f0f0'
                },
                margin: '10 10 10 10',
                title: OSS.Localize.get("Module type / Description"),
                itemId: 'type_and_description',
                items: [
                    { 
                        xtype: "combobox",
                        name: "type",
                        fieldLabel: OSS.Localize.get("Type"),
                        store: "agents.Types",
                        queryMode: "local",
                        labelWidth: 300,
                        displayField: "name",
                        valueField: "id"
                    },
                    {
                        xtype: "textfield",
                        allowBlank: false,
                        labelWidth: 300,
                        fieldLabel: OSS.Localize.get("Name"),
                        name: "service_name"
                    },
                    {
                        xtype: "textfield",
                        allowBlank: false,
                        labelWidth: 300,
                        fieldLabel: OSS.Localize.get("Description"),
                        name: "descr"
                    }
                ]
            },
            {
                xtype: "fieldset",
                style: {
                    backgroundColor: '#f0f0f0'
                },
                margin: '0 10 10 10',
                itemId: "options",
                licid: 'full',
                title: OSS.Localize.get("Options"),
                items: [
                    {
                        xtype: "numberfield",
                        labelWidth: 300,
                        itemId: "timeout",
                        fieldLabel: OSS.Localize.get("Timeout to store data"),
                        name: "flush"
                    },
                    Ext.create( "OSS.view.agents.common.KeepDetail" )
                ]
            }
        ];
        this.callParent( arguments );
    }
});
