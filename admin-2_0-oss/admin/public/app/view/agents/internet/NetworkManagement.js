Ext.define('OSS.view.agents.internet.NetworkManagement', {
    extend: "OSS.ux.grid.editor.Window",
    toolbarClassName: 'OSS.view.agents.Toolbar',
    
    requires: [ 'OSS.view.agents.internet.SegmentField' ],
    
    itemId: "segments",
    store: 'agents.internet.NetworkManagement',
    title: OSS.Localize.get( "Network management" ),
    statics: {
        editModeOnly: true
    },
    listeners: {
        windowcreated: function() {
            var mask = this.form.down( "numberfield[name=mask]" );
            mask.on( "change", this.getNetwork, this );
            this.form.down( "ipfield[name=gateway]" ).on( "change", this.getNetwork, this );
        }
    },
    getNetwork: function() {
        var gateway = this.form.getForm().getValues().gateway;
        var ip = this.form.down( "ipfield[name=ip]" );
        if ( OSS.helpers.agents.IP.validate(gateway) ) {
            if (OSS.helpers.agents.IP.validate(ip.getValue())) {
                this.form.down( "ipfield[name=ip]" ).validate();
            }
            //this.form.down( "ipfield[name=ip]" ).setValue( OSS.IpCalculation.getNetworkAddress(gateway, mask) );
        }
    }, 
    deleteConfirm: {
        title: "Confirmation",
        msg: "Do you realy want to delete this segment?"
    },
    validate: true,
    toolbar: [
        { 
            xtype: 'tbtext', 
            text: OSS.Localize.get( "Search" ), 
            style: {
                padding: '0px 10px 0px 0px'
            }
        },
        { 
            xtype: "combobox",
            itemId: "searchField",
            displayField: "descr",
            valueField: "name",
            queryMode: "local",
            value: "ip",
            store: Ext.create( "Ext.data.Store", {
                fields: [ { type: "string", name: "name" }, { type: "string", name: "descr" } ],
                data: [ { name: "ip", descr: OSS.Localize.get( "Segment" ) }, { name: "vlan", descr: OSS.Localize.get( "VLAN" ) } ]
            })
        },
        { itemId: "ip", xtype: "textfield" },
        { itemId: "vlan", xtype: "numberfield", hidden: true },
        { xtype: 'button', text: OSS.Localize.get( 'Find' ), itemId: "find", iconCls: 'x-ibtn-search' }
    
    ],
    bbar: { xtype: 'pagingtoolbar', store: 'agents.internet.NetworkManagement' },
    winConfig: {
        title: {
            create: OSS.Localize.get( "New segment" ),
            update: OSS.Localize.get( "Edit segment" )
        },
        editForm: [
            { name: "id", xtype: "hidden" },
            { name: "ignore_local", xtype: "checkbox", inputValue: 1, fieldLabel: OSS.Localize.get("Ignore") },
            { name: "nat", xtype: "checkbox", inputValue: 1, fieldLabel: OSS.Localize.get("NAT") },
            { name: "guest", xtype: "checkbox", inputValue: 1, fieldLabel: OSS.Localize.get("Guest") },
            { xtype: "segmentfield" },
            { name: "mask", value: 24, minValue: 0, maxValue: 32, xtype: "numberfield", fieldLabel: OSS.Localize.get("Mask") },
            { name: "gateway", xtype: "ipfield", allowBlank: false, fieldLabel: OSS.Localize.get("Gateway") },
            { 
                name: "vlan_id", 
                xtype: "combobox", 
                fieldLabel: OSS.Localize.get("VLAN"),
                displayField: "name",
                valueField: "record_id",
                store: "agents.internet.Vlans"
            },
            { 
                name: "nas_id", 
                xtype: "combobox", 
                fieldLabel: OSS.Localize.get("NAS"),
                queryMode: "local",
                store: "agents.internet.rnas.Combo",
                displayField: "rnas",
                valueField: "id",
                value: 0
            },
            { 
                name: "device_group_id", 
                xtype: "combobox", 
                fieldLabel: OSS.Localize.get("Group of devices"),
                store: "agents.internet.Devicegroups",
                displayField: "name",
                valueField: "group_id"
            }
        ]
    },
    columns: [ 
        { dataIndex: "id", header: OSS.Localize.get("ID") },
        { 
            dataIndex: "ignore_local", 
            header: OSS.Localize.get("Ignore"),
            renderer: function( value ) {
                if (value == 1) {
                    return OSS.Localize.get("Yes");
                } else {
                    return OSS.Localize.get("No");
                }
            }
        },
        { 
            dataIndex: "nat", 
            header: OSS.Localize.get("NAT"),
            renderer: function( value ) {
                if (value == 1) {
                    return OSS.Localize.get("Yes");
                } else {
                    return OSS.Localize.get("No");
                }
            }
        },
        { 
            dataIndex: "guest", 
            header: OSS.Localize.get("Guest"),
            renderer: function( value ) {
                if (value == 1) {
                    return OSS.Localize.get("Yes");
                } else {
                    return OSS.Localize.get("No");
                }
            }
        },
        { dataIndex: "ip", header: OSS.Localize.get("Network"), flex: 1 },
        { 
            dataIndex: "mask", 
            header: OSS.Localize.get("Mask"),
            renderer: function( value ) {
                return this.getPrefixSizeByIPMask( value );
            }
        },
        { dataIndex: "gateway", header: OSS.Localize.get("Gateway") },
        { dataIndex: "outer_vlan", header: OSS.Localize.get("VLAN") },
        { dataIndex: "vlan_name", header: OSS.Localize.get("VLAN name") },
        { 
            dataIndex: "nas_id", 
            header: OSS.Localize.get("NAS"),
            renderer: function() {
                var value = arguments[0];
                var record = arguments[2];
                if (value == 0) {
                    return OSS.Localize.get('All');
                } else if (value == -1) {
                    return OSS.Localize.get('Not use');
                } else if (value > 0) {
                    return record.get('rnas');
                } else {
                    return value;
                }
            }
        },
        { dataIndex: "device_group_name", header: OSS.Localize.get("Group of devices") }
    ],
    getIPMaskByPrefixSize: function( prefix_size ) {
        var store = Ext.create("OSS.store.agents.internet.IPAndPrefixSize");
        var record = store.findRecord("prefix_size", prefix_size);
        return record.get("ip");
    },
    getPrefixSizeByIPMask: function( ip ) {
        var store = Ext.create("OSS.store.agents.internet.IPAndPrefixSize");
        var record = store.findRecord("ip", ip);
        return record.get("prefix_size");
    }
});
