Ext.define('OSS.view.Settings', {
    extend: 'Ext.tab.Panel',
    
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.RowEditing',
        'OSS.view.settings.MixedValue'
    ],
    
    alias: 'widget.osssettings',
    
    activeTab: 1,
    plain: true,
    frame: true,
    
    items: [{
        xtype: 'grid',
        itemId: 'commons',
        title: i18n.get("Common"),
        enableColumnHide: false,
        enableColumnMove: false,
        features: [{ 
            ftype: 'grouping',
            enableGroupingMenu: false,
            enableNoGroups: false,
            groupHeaderTpl: '{[values.rows[0].data.gdescr]}'
        }],
        viewConfig: {
            enableTextSelection: true,
            markDirty:false
        },
        plugins: [{
            ptype: 'cellediting', 
            clicksToEdit: 1
        }],
        columns: [{
            header: i18n.get( 'Option' ),
            dataIndex: 'descr',
            sortable: false,
            flex: 2
        }, { 
            xtype: "settings.mixedvalue",
            sortable: false
        }],
        store: 'Settings.Common',
        bbar: [{
            xtype: 'button',
            iconCls: 'x-ibtn-reload',
            itemId: 'reload'
        }]
    }, {
        xtype: 'panel',
        title: i18n.get( "optiongroup_payment" ),
        layout: 'anchor',
        itemId: 'paymentsTab',
        defaults: {
            anchor: '100% 50%'
        },
        items: [{
            xtype: 'form',
            url: Ext.Ajax.getRestUrl('api', 'settings', 'savePaymentOptions'),
            itemId: 'paymentsForm',
            layout: 'column',
            autoScroll: true,
            frame: true,
            defaults: {
                xtype: 'fieldset',
                width: 500,
                style: {
                    marginRight: '4px'
                }
            },
            tbar: [{
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-save', 
                    itemId: 'savePayments',
                    text: OSS.Localize.get( 'Save' )
                }]
            }],
            items: [{
                title: i18n.get( 'optiongroup_payment' ),
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 220,
                    anchor: '100%'
                },
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: i18n.get( 'option_payments_cash_now' ),
                    name: 'payments_cash_now',
                    inputValue: '1',
                    uncheckedValue: 0
                }, {
                    fieldLabel: i18n.get( 'option_payment_format' ),
                    name: 'payment_format'
                }, {
                    fieldLabel: i18n.get( 'option_pay_import' ),
                    name: 'pay_import'
                }, {
                    fieldLabel: i18n.get( 'option_payment_script_path' ),
                    name: 'payment_script_path'
                }, {
                    xtype: 'numberfield',
                    name: 'option_tax_value',
                    fieldLabel: i18n.get( 'option_tax_value' ),
                    minValue: 0,
                    allowDecimal: false
                }]
            }, {
                title: i18n.get( 'optiongroup_print' ),
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 220,
                    anchor: '100%'
                },
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: i18n.get( 'option_print_sales_mebius' ),
                    name: 'print_sales_mebius',
                    inputValue: '1',
                    uncheckedValue: 0
                }, {
                    fieldLabel: i18n.get( 'option_print_sales_ocfiz' ),
                    name: 'print_sales_ocfiz'
                }, {
                    fieldLabel: i18n.get( 'option_print_sales_ocur' ),
                    name: 'print_sales_ocur'
                }, {
                    xtype: 'textareafield',
                    itemId: 'ticketText',
                    fieldLabel: i18n.get( 'option_print_sales_template' ),
                    maxLength: 1023,
                    name: 'print_sales_template',
                    plugins: [
                        //Ext.create('OSS.Field.plugin.Qtip', {
                        //    tpl: '<tpl for=".">{#}. {.}</br></tpl>',
                        //    data: [ 
                        //            i18n.get( 'Manager name' ) + ': %fio', 
                        //            i18n.get( 'Agreement' ) + ': %agrm', 
                        //            i18n.get( 'Adress' ) + ': %addr', 
                        //            i18n.get( 'Balance' ) + ': %balance',
                        //            i18n.get( 'Credit' ) + ': %credit',
                        //            i18n.get( 'User login' ) + ': %ulogin'
                        //    ]
                        //})
                    ]
                }]
            }, { 
                title: 'Cyberplat',
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 220,
                    anchor: '100%'
                },
                items: [{
                    fieldLabel: i18n.get( 'option_cyberplat_agreement_regexp' ),
                    name: 'cyberplat_agreement_regexp'
                }]
            }]
        }, {
            xtype: 'grid',
            itemId: 'paymentsCat',
            title: i18n.get( 'Payment categories' ),
            selType: 'cellmodel',
            plugins: [{
                ptype: 'cellediting', 
                clicksToEdit: 1
            }],
            columns: [{
                header: i18n.get( 'Name' ),
                flex: 2,
                dataIndex: 'name',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                header: i18n.get( 'Description' ),
                flex: 2,
                dataIndex: 'descr',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                header: i18n.get( 'External code' ),
                flex: 1,
                dataIndex: 'extern_code',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                xtype: 'actioncolumn',
                itemId: 'delete',
                header: '&nbsp',
                width: 25,
                dataIndex: 'class_id',
                getClass: function(value, meta, record) {
                    if (value == 0) {
                        return 'x-ibtn-def-dis x-ibtn-delete';
                    }
                    return 'x-ibtn-def x-ibtn-delete';
                }                        
            }],
            store: 'Settings.Payclasses',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                itemId: 'searchTbar',
                items: [{
                    xtype: 'button',
                    text: OSS.Localize.get( 'Operations' ),
                    itemId: 'actions',
                    menu:[{
                        iconCls: 'x-ibtn-add', 
                        itemId: 'addPayclassBtn',
                        text: OSS.Localize.get( 'Add new payment category' )
                    }]
                }]
            }, { 
                xtype: 'toolbar', 
                dock: 'bottom',
                items: [{
                    xtype: 'button',
                    iconCls: 'x-ibtn-reload',
                    itemId: 'reload'
                }]
            }]
        }]
    }, {
        xtype: 'grid',
        title: i18n.get( "Templates for auto-numeration of agreements" ), 
        itemId: 'templateAgreementNumbers',
        selType: 'cellmodel',
        plugins: [{
            ptype: 'cellediting', 
            clicksToEdit: 1
        }],
        columns: [{
            header: i18n.get( 'Template' ),
            flex: 2,
            dataIndex: 'value',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            header: i18n.get( 'Description' ),
            flex: 2,
            dataIndex: 'descr',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            xtype: 'actioncolumn',
            itemId: 'delete',
            header: '&nbsp',
            width: 25,
            dataIndex: 'name',
            getClass: function(value, meta, record) {
                return 'x-ibtn-def x-ibtn-delete';
            }                        
        }],
        store: 'Settings.AgreementTemplates',
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            itemId: 'searchTbar',
            items: [{
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-add', 
                    itemId: 'addAgrmTemplateBtn',
                    text: OSS.Localize.get( 'Add new template' )
                }]
            }]
        }, { 
            xtype: 'toolbar', 
            dock: 'bottom',
            items: [{
                xtype: 'button',
                iconCls: 'x-ibtn-reload',
                itemId: 'reload'
            }]
        }]
    }]
});
