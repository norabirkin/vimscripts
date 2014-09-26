Ext.define( 'OSS.view.agents.internet.radius.Nas', {
    //extend: "OSS.grid.panel.WithEditWindow",
    extend: "OSS.ux.grid.editor.row.CheckboxSelection",
    actions: [{
        iconCls: 'x-ibtn-def x-ibtn-remove',
        text: i18n.get('Remove device'),
        disabled: true,
        itemId: 'removeDevice'
    }, {
        iconCls: 'x-ibtn-def x-ibtn-add',
        text: i18n.get('Add device'),
        disabled: true,
        itemId: 'addDevice'
    }],
    toolbarClassName: 'OSS.view.agents.Toolbar',
    itemId: "nas",
    title: OSS.Localize.get("Access servers"),
    confirmRemove: true,
    deleteConfirm: {
        title: OSS.Localize.get("Confirm access servers remove"), 
        msg: OSS.Localize.get("Do you realy want to remove selected NAS?")
    },
    statics: {
        editModeOnly: true
    },
    tbar: [
        { 
            xtype: 'tbtext', 
            text: OSS.Localize.get( "Search" ), 
            style: {
                padding: '0px 10px 0px 0px'
            }
        },
        { itemId: "ip", xtype: "textfield" },
        { xtype: 'button', text: OSS.Localize.get( 'Find' ), itemId: "find", iconCls: 'x-ibtn-search' }
    
    ],
    bbar: { xtype: 'pagingtoolbar', store: "agents.internet.Rnas" },
    onNewNodeCreated: function( node ) {
        node.set( "rnas", "127.0.0.0" );
        this.callParent( [node] );
    },
    columns: [
        { dataIndex: "id", header: "ID" },
        { dataIndex: "rnas", header: "IP", flex: 1, editor: {xtype: "ipfield", allowBlank: false} },
        { dataIndex: "secret", header: OSS.Localize.get( "Secret" ), editor: {xtype: "textfield"} },
        { 
            dataIndex: "device_name", 
            header: OSS.Localize.get( "Device" ), 
            renderer: function( value, meta ) {
                if ( !value || value == "" ) { 
                    meta.style = "color: #828282; font-style: italic;";
                    return OSS.Localize.get( "Not assigned" ); 
                }
                return value;
            }
        }
    ],
    columnClickCanInitRowEditing: function( column ) {
        if (column.getItemId() == 'add_or_remove') {
            return false;
        }
        return true;
    },
    store: "agents.internet.Rnas",
    winConfig: {
        title: {
            create: OSS.Localize.get( "New access server" ),
            update: OSS.Localize.get( "Edit access server" )
        },
        editForm: [
            { name: "rnas", xtype: "textfield", fieldLabel: OSS.Localize.get("IP") },
            { name: "secret", xtype: "textfield", fieldLabel: OSS.Localize.get("Secret") },
            { name: "device_name", xtype: "displayfield", fieldLabel: OSS.Localize.get("Device") }
        ]
    }
});
