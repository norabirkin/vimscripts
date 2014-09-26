Ext.define('OSS.view.agents.phone.Replaces', {
    requires: [
        'OSS.view.searchtemplate.Grid',
        'OSS.store.agents.phone.Parameters',
        'OSS.store.agents.phone.Conditions',
        'OSS.store.agents.phone.Logic'
    ],
    extend: "Ext.panel.Panel",
    itemId: "phonereplaces",
    title: OSS.Localize.get("Phone replaces"),
    statics: { editModeOnly: true },
    layout: 'border',
    initComponent: function() {
       this.tbar = Ext.create('OSS.view.agents.Toolbar');
       this.items = [
           {
                region: "north",
                xtype: "grid_with_edit_window",
                columns: [
                    { dataIndex: "old_number", header: OSS.Localize.get( "Internal ATS number" ) + " / " + OSS.Localize.get( "Internal ATS number template" ), flex: 1 },
                    { 
                        header: OSS.Localize.get( "Telephone subscriber number" ), 
                        flex: 1,
                        renderer: function() {
                            var record = arguments[2];
                            if (record.get("l_trim") < 0) {
                                return record.get("new_number");
                            } else {
                                return OSS.Localize.get("Group substitution");
                            }
                        }
                    },
                    { 
                        dataIndex: "replace_what", 
                        header: OSS.Localize.get( "Substitute" ),
                        width: 150,
                        renderer: function() {
                            var data = {
                                record: arguments[2],
                                value: ""
                            };
                            this.fireEvent( "replacewhatcolumnrender", data );
                            return data.value;
                        }
                    },
                    { 
                        dataIndex: "l_trim", 
                        header: OSS.Localize.get( "Prefix length to cut" ), 
                        width: 150,
                        renderer: function() {
                            var record = arguments[2];
                            if (record.get("l_trim") < 0) {
                                return "";
                            } else {
                                return record.get("l_trim");
                            }
                        } 
                    },
                    { 
                        header: OSS.Localize.get( "Prefix" ), 
                        flex: 1,
                        renderer: function() {
                            var record = arguments[2];
                            if (record.get("l_trim") < 0) {
                                return "";
                            } else {
                                return record.get("new_number");
                            }
                        }
                    }
                ],
                winConfig: {
                    title: {
                        create: OSS.Localize.get( "Create" ),
                        update: OSS.Localize.get( "Edit phone replace" )
                    },
                    editForm: [
                        { labelWidth: 150, fieldLabel: OSS.Localize.get( "Internal ATS number" ), name: "old_number", xtype: "textfield" },
                        { labelWidth: 150, fieldLabel: OSS.Localize.get( "Telephone subscriber number" ), name: "new_number", xtype: "textfield" },
                        { 
                            labelWidth: 150,
                            fieldLabel: OSS.Localize.get( "Substitute" ), 
                            name: "replace_what", 
                            xtype: "combobox",
                            queryMode: "local",
                            displayField: "name",
                            valueField: "id",
                            store: "agents.phone.ReplaceWhatDescrs"
                        },
                        { itemId: "group_substitution", labelWidth: 150, fieldLabel: OSS.Localize.get( "Group substitution" ), xtype: "checkbox" },
                        { labelWidth: 150, hidden: true, fieldLabel: OSS.Localize.get( "Prefix length to cut" ), name: "l_trim", xtype: "numberfield" }
                    ]
                },
                store: 'agents.phone.Replaces'
            },
            Ext.create('OSS.view.searchtemplate.Grid', {
                region: "center",
                title: OSS.Localize.get('Billing mediation'),
                store: 'agents.phone.BillingMediation',
                getParametersStore: function() { return Ext.create( 'OSS.store.agents.phone.Parameters' ); },
                getConditionsStore: function() { return Ext.create( 'OSS.store.agents.phone.Conditions' ); },
                getLogicStore: function() { return Ext.create( 'OSS.store.agents.phone.Logic' ); }
            })
        ];
        this.callParent( arguments );
    }
})
