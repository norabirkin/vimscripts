Ext.define("OSS.view.Agents", {
    extend: "Ext.panel.Panel",
    requires: [
        'OSS.view.agents.common.KeepDetail',
        'OSS.view.agents.Common'
    ],
    alias: "widget.agents",
    layout: "card",
    border: false,
    frame: true,
    plain: true,
    title: OSS.Localize.get("Agents"),
    initComponent: function() {
        this.items = [{
            xtype: "gridpanel",
            store: "Agents",
            tbar: [{
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-add',
                    itemId: "create", 
                    text: i18n.get("Create agent") 
                }]
            }],
            columns: [
                {
                    header: "&nbsp",
                    itemId: "edit",
                    width: 30,
                    xtype: 'actioncolumn',
                    tooltip: OSS.Localize.get( 'Edit' ),
                    align: 'center',
                    getClass: function(p1, p2, record) {                
                        if (true) {
                            return 'x-ibtn-def x-ibtn-edit';
                        } else {
                            return '';
                        }
                    }
                },
                { dataIndex: "id", header: OSS.Localize.get("ID") },
                { 
                    header: OSS.Localize.get("Type"), 
                    width: 150 ,
                    renderer: function() {
                        var record = arguments[2];
                        var type = { id: record.get("type"), name: "" };
                        this.fireEvent( "typecolrender", type );
                        return type.name;
                    }
                },
                { dataIndex: "descr", header: OSS.Localize.get("Description"), flex: 1 },
                {
                    dataIndex: "na_ip",
                    licid: 'full',
                    header: OSS.Localize.get("IP")
                },
                {
                    dataIndex: "active", 
                    header: OSS.Localize.get("State"), 
                    renderer: function() {
                        var record = arguments[2];
                        var active = record.get("active");
                        if (active === 0) {
                            return OSS.Localize.get( "Off" );
                        } else {
                            return OSS.Localize.get( "On" );
                        }
                    }
                },
                {
                    dataIndex: "vgroups",
                    header: OSS.Localize.get("Accounts")
                },
                { 
                    dataIndex: "sessions", 
                    licid: 'full',
                    header: OSS.Localize.get("Sessions"),
                    renderer: function() {
                        var record = arguments[2];
                        var type = record.get("type");
                        if (type == 6 || type == 12) {
                            return record.get("sessions");
                        } else {
                            return "-";
                        }
                    }
                },
                {
                    xtype: "actioncolumn",
                    itemId: "remove",
                    header: '&nbsp',
                    width: 25,
                    tooltip: OSS.Localize.get( 'Remove' ),
                    getClass: function() { 
                        var dis = ( arguments[2].get("vgroups") === 0 ) ? "" : "-dis";
                        return 'x-ibtn-def' + dis + ' x-ibtn-delete'; 
                    }                       
                }
            ]
            //dockedItems: [{ xtype: 'pagingtoolbar', store: "Agents" }]
        }, {
            xtype: "tabpanel",
            id: "agentstabs",
            plain: true,
            items: [{
                xtype: "agents_common_settings"
            }]
        }];
        this.callParent(arguments);
    }
});
