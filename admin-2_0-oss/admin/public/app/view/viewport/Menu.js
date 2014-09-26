Ext.define('OSS.view.viewport.Menu', {
    extend: 'Ext.Toolbar',
    
    requires: [
        'Ext.menu.Menu'
    ],
    
    alias: 'widget.ossmenu',
    ui: 'oss-app-menu',
    cls: 'x-toolbar-oss-app-menu-bg',
    style: {
        border: 0,
        padding: '0 5px 0 5px'
    },
    defaults: {
        border: false,
        ui: 'oss-app-menu',
        scale: 'medium'
    },
    items: [{
        text: i18n.get( 'Objects' ),
        itemId: "objects",
        iconCls: 'x-ibtn-gray-object',
        menu: {
            items: [
            {
                text: i18n.get( 'Users' ),
                rule: 'Accounts',
                itemId: 'users',
                controller: 'users'
            },
            {
                text: i18n.get('Account entries'),
                itemId: 'accounts',
                rule: 'Accounts.Agreements.Vgroups',
                controller: 'accounts'
            },
            {
                text: OSS.Localize.get( 'Groups' ),
                menu: {
                    items: [{
                        text: i18n.get( 'User groups' ),
                        itemId: 'userGroups',
                        controller: 'userGroups'
                    }, {
                        text: i18n.get( 'Account entry groups' ),
                        itemId: 'accountsgroups',
                        rule: 'Accounts.Agreements.Vgroups.Unions',
                        controller: 'accountsGroups'
                    }]
                }
            },
            {
                text: i18n.get( 'Managers' ),
                rule: 'Managers',
                controller: 'managers'
            },
            {
                text: i18n.get('Platforms'),
                itemId: 'platforms',
                controller: 'platforms'
            },
            {
                text: i18n.get( 'Agents' ),
                rule: 'Agents',
                itemId: "agents",
                controller: 'agents'
            },
            {
                text: i18n.get( 'Pre-paid cards' ),
                rule: 'CardSet.Card',
                licid: 'full',
                itemId: 'paycards',
                controller: 'paycards'
            },
            {
                text: i18n.get( 'Currency and rate' ),
                itemId: 'currency',
                controller: 'currency',
                rule: 'Currency'
            }
        ]
        }
    }, {
        xtype: 'tbseparator',
        border: true
    }, {
        text: i18n.get( 'Properties' ),
        iconCls: 'x-ibtn-gray-prop',
        menu: {
            items: [{
                text: OSS.Localize.get( 'Payment menu' ),
                rule: 'Payments',
                menu: {
                    items: [{
                        text: i18n.get( 'Payments' ),
                        controller: 'paymentsForm'
                    }]
                }
            }, {
                text: OSS.Localize.get( 'Tariffing' ),
                menu: {
                    items: [{
                        text: OSS.Localize.get( 'Tariffs' ),
                        itemId: 'tariffs',
                        rule: 'Tariffs',
                        controller: 'tariffs'
                    }, {
                        text: OSS.Localize.get( 'Matrix discounts' ),
                        licid: 'full',
                        itemId: 'matrixdiscounts',
                        controller: 'matrixDiscounts'
                    }]
                }
            },{
                text: i18n.get( 'Catalogues' ),
                licid: 'full',
                controller: 'catalogs',
                rule: 'Catalogs'
            },{
                text: i18n.get( 'RADIUS-attributes' ),
                rule: 'Agents.Internet.Radius.Attributes',
                controller: 'radiusAttributes'
            }]
        }
    }, {
        xtype: 'tbseparator',
        border: true
    }, {
        text: i18n.get( 'Actions' ),
        iconCls: 'x-ibtn-gray-wait',
        menu: {
            items: [{
                text: i18n.get('Generate'),
                menu: [{
                    text: i18n.get('Reports'),
                    controller: 'reports'
                }, {
                    text: i18n.get('Printing forms'),
                    controller: 'printingForms'
                }]
            }, {
                text: i18n.get( 'Recalculation' ),
                rule: 'Rent charge',
                controller: 'recalculation'
            }]
        }
    }, {
        xtype: 'tbseparator',
        border: true
    }, {
        text: i18n.get( 'Reports' ),
        iconCls: 'x-ibtn-gray-chart',
        menu: {
            items: [{
                text: i18n.get( 'Statistics' ),
                controller: 'statistics'
            }, {
                text: i18n.get( 'Printing forms' ),
                controller: 'printingFormsStat'
            }, {
                text: i18n.get('Events log'),
                controller: 'events'
            }, {
                text: i18n.get('Authorization log'),
                controller: 'authLog'
            }]
        }
    }, {
        xtype: 'tbseparator',
        border: true
    }, {
        text: i18n.get( 'Options' ),
        iconCls: 'x-ibtn-gray-tool',
        menu: {
            items: [{
                text: i18n.get( 'Settings' ),
                controller: 'settings'
            }, {
                text: i18n.get( 'Document templates' ),
                rule: 'Options.Document',
                controller: 'documentTemplates'
            }]
        }
    }, {
        xtype: 'tbseparator',
        licid: 'full',
        border: true
    }, {
        text: 'HelpDesk',
        licid: 'full',
        disabled: true,
        iconCls: 'x-ibtn-gray-info',
        menu: {
            items: []
        }
    }, '->', {
        iconCls: 'x-ibtn-gray-state',
        style: {
            padding: '5px 0px 0px 6px'
        },
        stateful: true,
        stateId: 'oss-headers-state',
        stateEvents: ['toggle'],
        enableToggle: true,
        itemId: 'hide'
    }, {
        xtype: 'tbspacer',
        width: 5
    }, {
        text: i18n.get( 'Logout' ),
        iconCls: 'x-ibtn-gray-exit',
        itemId: 'logout'
    }]
});
