Ext.define( "OSS.helpers.agents.SpecificSettings", {
    constructor: function( config ) {
        this.initConfig(config); 

        this.tabsGetters = [];
        this.tabsGetters[1] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                'OSS.view.agents.internet.IgnoreNetworks' ,
                "OSS.view.agents.specific.Ethernet",
                "OSS.view.agents.internet.Interfaces",
                'OSS.view.agents.internet.NetworkManagement',
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[2] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                "OSS.view.agents.internet.IgnoreNetworks",
                this.getUlogSettings,
                'OSS.view.agents.internet.Interfaces',
                "OSS.view.agents.internet.NetworkManagement",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[3] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                "OSS.view.agents.internet.IgnoreNetworks",
                this.getTeeSettings,
                "OSS.view.agents.internet.Interfaces",
                "OSS.view.agents.internet.NetworkManagement",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[4] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                "OSS.view.agents.internet.IgnoreNetworks",
                this.getNetflowSettings,
                "OSS.view.agents.internet.NetworkManagement",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[5] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                "OSS.view.agents.internet.IgnoreNetworks",
                this.getSflowSettings,
                "OSS.view.agents.internet.NetworkManagement",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[6] = [
            [
                "OSS.view.agents.specific.Radius",
                "OSS.view.agents.internet.NetworkManagement",
                "OSS.view.agents.internet.radius.Nas",
                "OSS.view.agents.internet.radius.Dictionary",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[7] = [
            [
                this.getPCDRSettings
            ],
            [
                "OSS.view.agents.phone.Replaces",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[12] = [
            [
                "OSS.view.agents.Database"
            ],
            [
                this.getVoIPSettings
            ],
            [
                "OSS.view.agents.internet.radius.Nas",
                "OSS.view.agents.internet.radius.Dictionary",
                "OSS.view.agents.phone.Replaces",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[13] = [
            [
                "OSS.view.agents.specific.UsBox",
                'OSS.view.agents.Platforms'
            ]
        ];
        this.tabsGetters[14] = [
            [
                this.getSnmpDatabaseSettings,
                'OSS.view.agents.Platforms'
            ]
        ];

        this.optionsFields = [];
        this.optionsFields[7] = [
            'instantly_amount'
        ];
        this.optionsFields[6] = [
            "skip-empty-framed-ip",
            "dhcpd_port",
            "dhcpd_ip",
            "dhcp-domain-name",
            "dhcp-identifier",
            "dhcp-lease-time",
            "radius-nameserver",
            "radius-nameserver2",
            "radius_insert_mac_staff",
            'radius_keep_only_last_auth_info'
        ];
        this.optionsFields[13] = [
            "use_cas",
            "use_smartcards",
            "cas_host",
            "cas_port",
            "operator_tag",
            "nationality",
            "region",
            "refresh_sec",
            "city_code",
            "channels_filter",
            "keep_turned_on_month",
            "middleware_login",
            "middleware_password",
            "middleware_http_endpoint",
            "dtv_type"
        ];
    }, 
    config: {
        tabs: function( type, editMode ) {
            var specificSettings = this;
            return new function() {
                this.items = specificSettings.tabsGetters[ type ];
                this.each = function( func, scope ) {
                    for (var step = 1; step <= this.items.length; step ++) {
                        for (var i = 0; i < this.items[step - 1].length; i ++) {
                            var panel = this.getPanel( this.items[step - 1][i] );
                            if ( panel ) { 
                                panel.step = step;
                                Ext.bind( func, scope )( panel ); 
                            }
                        }
                    }
                };
                this.getPanel = function( item ) {
                    if (typeof item == "function") {
                        return Ext.bind( item, specificSettings )();
                    }
                    if (!Ext.ClassManager.get( item ).editModeOnly || editMode) {
                        return Ext.create( item );
                    }
                    return null;
                };
            };
        },
        getUlogSettings: function() {
            var form = Ext.create( "OSS.view.agents.specific.Ethernet" );
            form.down("fieldset").add( Ext.create("Ext.form.field.Number", { minValue: 0, labelWidth: 300, name: "nfport", fieldLabel: OSS.Localize.get("Netlink port") }) );
            return form;
        },
        getTeeSettings: function() {
            var form = Ext.create( "OSS.view.agents.specific.Ethernet" );
            form.down("fieldset").add( Ext.create("Ext.form.field.Number", { minValue: 0, labelWidth: 300, name: "nfport", fieldLabel: OSS.Localize.get("Divert port") }) );
            return form;
        },
        getNetflowSettings: function() {
            var form = Ext.create( "OSS.view.agents.specific.Ethernet" );
            form.down("fieldset").add( Ext.create("Ext.form.field.Number", { minValue: 0, labelWidth: 300, name: "local_as_num", fieldLabel: OSS.Localize.get("Local autonomous system") }) );
            form.add( this.getIPAndPortFieldSet() );
            return form;
        },
        getIPAndPortFieldSet: function() {
            return Ext.create("Ext.form.FieldSet", {
                style: {
                    backgroundColor: '#f0f0f0'
                },
                margin: '0 10 10 10',
                items: [{
                    xtype: "ipfield",
                    labelWidth: 300,
                    name: "nfhost",
                    fieldLabel: i18n.get("Listen IP")
                }, {
                    xtype: "numberfield",
                    labelWidth: 300,
                    minValue: 0,
                    name: "nfport",
                    fieldLabel: i18n.get("Listen port")
                }]
            });
        },
        getSflowSettings: function() {
            var form = Ext.create( "OSS.view.agents.specific.Ethernet" );
            form.add( this.getIPAndPortFieldSet() );
            return form;
        },
        getPCDRSettings: function() {
            var form = Ext.create("OSS.view.agents.specific.PCDR");
            this.addIdentifyOperatorCombo( form );
            return form;
        },
        addIdentifyOperatorCombo: function( form ) {
            form.down("fieldset").add( Ext.create("Ext.form.field.ComboBox", {
                labelWidth: 300,
                fieldLabel: OSS.Localize.get("Identify operator"),
                displayField: "name",
                name: "oper_cat",
                valueField: "id",
                value: 0,
                store: Ext.create("Ext.data.Store", {
                    fields: [ "id", "name" ],
                    data: [
                        { id: 0, name: OSS.Localize.get("Operator attribute") },
                        { id: 1, name: OSS.Localize.get("Catalogue ph. numbers") }
                    ]
                })
            }));
        },
        getVoIPSettings: function() {
            var form = Ext.create( "OSS.view.agents.specific.VoIP" );
            this.addIdentifyOperatorCombo( form );
            return form;
        },
        getSnmpDatabaseSettings: function() {
            var database = Ext.create( "OSS.view.agents.Database" );
            database.onSuccessfullValidation = Ext.bind( function() { this.fireEvent("alltabsvalid"); }, database );
            return database;
        }
    }
});
