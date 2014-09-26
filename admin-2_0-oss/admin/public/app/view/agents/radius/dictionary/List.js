Ext.define( "OSS.view.agents.radius.dictionary.List", {
    extend: "OSS.ux.grid.editor.Window",
    region: "center",
    title: OSS.Localize.get("RADIUS-attributes dictionary"),
    itemId: "attributes",
    store: "agents.internet.radius.Attributes",
    winConfig: {
        width: 400,
        labelWidth: 150,
        title: {
            create: OSS.Localize.get( "New attribute" ),
            update: OSS.Localize.get( "Edit attribute" )
        },
        editForm: [
            { fieldLabel: OSS.Localize.get("Name"), xtype: "textfield", name: 'name', anchor: '100%' }, 
            { fieldLabel: OSS.Localize.get("Number"), xtype: "numberfield", name: 'radius_type', anchor: '100%' }, 
            { fieldLabel: OSS.Localize.get("Vendor"), xtype: "numberfield", name: 'vendor', anchor: '100%' },
            { 
                fieldLabel: OSS.Localize.get("Value"), 
                xtype: "combobox",
                anchor: '100%',
                name: 'value_type',
                displayField: "name",
                valueField: "id",
                store: "agents.dictionary.Types"
            }, 
            { 
                fieldLabel: OSS.Localize.get("Replace id"), 
                xtype: "combobox", 
                name: 'replace_id',
                anchor: '100%',
                displayField: "name",
                valueField: "id",
                store: "agents.dictionary.Combo",
                queryMode: "local"
            }, 
            { fieldLabel: "Tagged attribute", xtype: "checkbox", name: 'tagged', inputValue: true }, 
            { fieldLabel: "save to history", xtype: "checkbox", name: 'to_history', inputValue: true }
        ]
    },
    columns: [
        { header: OSS.Localize.get("Name"), dataIndex: 'name', flex: 1 }, 
        { header: OSS.Localize.get("Number / VSA"), dataIndex: 'radius_type' }, 
        { header: OSS.Localize.get("Vendor"), dataIndex: 'vendor' },
        { 
            header: OSS.Localize.get("Type"), 
            dataIndex: 'value_type',
            renderer: function( value ) {
                var data = { value: value }
                this.fireEvent( "rendertypecol", data );
                return data.value;
            }
        }
    ]
});
