Ext.define('OSS.view.agents.internet.radius.Dictionary', {
    extend: "Ext.panel.Panel",
    itemId: "dictionary",
    title: OSS.Localize.get("RADIUS-attributes dictionary"),
    statics: {
        editModeOnly: true
    },
    layout: 'border',
    border: false,
    items: [
        {
            xtype: 'gridpanel',
            region: "west",
            itemId: "rnas",
            store: "agents.internet.radius.Rnas",
            title: OSS.Localize.get( "Access servers" ),
            width: 300,
            hideHeaders: true,
            columns: [{ dataIndex: "rnas", flex: 1 }]
        },
        {
            xtype: "grid_with_edit_window", 
            region: "center",
            title: OSS.Localize.get("RADIUS-attributes dictionary"),
            externalToolbarContainer: true,
            toolbarClassName: 'OSS.view.agents.Toolbar',
            itemId: "attributes",
            store: "agents.internet.radius.Attributes",
            removeAllowed: function( record ) {
                return ( record.get("nas_id") > 0 );
            },
            winConfig: {
                width: 400,
                labelWidth: 150,
                title: {
                    create: OSS.Localize.get( "New attribute" ),
                    update: OSS.Localize.get( "Edit attribute" )
                },
                editForm: [
                    { fieldLabel: OSS.Localize.get( "Title" ), value: "Attribute", xtype: "textfield", name: 'name', maskRe: /[a-zA-Z0-9\-\_\#\:]+/, anchor: '100%'}, 
                    { fieldLabel: OSS.Localize.get( "Number / VSA" ), value: 0, xtype: "numberfield", name: 'radius_type', minValue: 0, maxValue: 65535, anchor: '100%' }, 
                    { fieldLabel: OSS.Localize.get( "Vendor" ), value: 0, xtype: "numberfield", name: 'vendor', anchor: '100%' },
                    { 
                        fieldLabel: OSS.Localize.get( "Type" ), 
                        xtype: "combobox",
                        anchor: '100%',
                        name: 'value_type',
                        displayField: "name",
                        valueField: "id",
                        value: 0,
                        store: "agents.dictionary.Types"
                    }, 
                    { 
                        fieldLabel: OSS.Localize.get( "Replace attribute" ), 
                        xtype: "combobox", 
                        name: 'replace_id',
                        anchor: '100%',
                        displayField: "name",
                        valueField: "id",
                        value: 0,
                        store: "agents.dictionary.Combo",
                        queryMode: "local"
                    }, 
                    { fieldLabel: OSS.Localize.get( "Tagged attribute" ), xtype: "checkbox", name: 'tagged', inputValue: true }, 
                    { fieldLabel: OSS.Localize.get( "Save to history" ), xtype: "checkbox", name: 'to_history', inputValue: true }
                ]
            },
            columns: [
                { header: OSS.Localize.get("Title"), dataIndex: 'name', flex: 1 }, 
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
        }
    ]
});
