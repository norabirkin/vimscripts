Ext.define('OSS.view.documenttemplates.Form', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.documenttemplates_form',
    itemId: 'mainPanel',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'back',
                form: function() {
                    var panel = Ext.app.Application.instance.getController('DocumentTemplates').getDocumentForm();
                    if (!panel) {
                        return null;
                    } else {
                        return panel.down('form');
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-save',
                    itemId: 'saveDocumentBtn',
                    text: OSS.Localize.get('Save')
                }]
            }]
        }
    ],
    items: [{
        title: OSS.Localize.get('Properties'),
        xtype: 'form',
        style: 'padding: 5px;',
        border: false,
        itemId: 'topForm',
        layout: 'column',
        bodyStyle : 'background:none',
        items:[{
            xtype: 'hidden',
            name: 'doc_id',
            value: 0
        }, {
            xtype: 'hidden',
            name: 'nds_above'
        }, { 
            layout: 'vbox',
            columnWidth: 0.5,
            style: 'padding: 5px;',
            border: false,
            itemId: 'leftColumnCnt',
            fieldDefaults: {
                labelAlign: 'left'
            },
            items: [{
                xtype: 'fieldset',
                width: '100%',
                defaultBackground: true,
                defaults: {
                    anchor: '100%',
                    labelWidth: 200
                },
                title: OSS.Localize.get('Common settings'), 
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: i18n.get('Hidden for managers'),
                    name: 'hidden',
                    inputValue: '1',
                    uncheckedValue: true
                }, {
                    xtype: 'checkbox',
                    fieldLabel: i18n.get('Available for customers'),
                    name: 'client_allowed',
                    inputValue: '1',
                    uncheckedValue: true

                }, {
                    xtype: 'checkbox',
                    name: 'detail',
                    fieldLabel: OSS.Localize.get('Skip aggregated data'),
                    inputValue: '1',
                    uncheckedValue: true
                }, {
                    xtype: 'textarea',
                    name: 'name',
                    fieldLabel: OSS.Localize.get('Description')
                }, {
                    xtype: 'combobox',
                    name: 'cur_id',
                    fieldLabel: OSS.Localize.get('Currency'),
                    displayField: 'name',
                    valueField: 'id',
                    triggerAction: 'all',
                    store: 'currency.Grid',
                    tpl: '<tpl for="."><div class="x-boundlist-item">{[Ext.util.Format.ellipsis(values.name, 25)]} ({[values.symbol]})</div></tpl>'
                }, {
                    xtype: 'combobox',
                    name: 'doc_template',
                    fieldLabel: OSS.Localize.get('Template'),
                    displayField: 'file_name',
                    valueField: 'file_name',
                    triggerAction: 'all',
                    store: 'documenttemplates.TemplateFiles'
                }, {
                    xtype: 'combobox',
                    fieldLabel: i18n.get('Type of the exported document'),
                    name: 'upload_ext',
                    valueField: 'id',
                    displayField: 'name',
                    store: Ext.create( "Ext.data.Store", {
                        fields: [ 
                            { type: 'string', name: 'id' }, 
                            { type: 'string', name: 'name' }
                        ],
                        data: [
                            { id: 'application/octet-stream', name: OSS.Localize.get('Without changes') },
                            { id: 'application/msword', name: OSS.Localize.get('MS Word') },
                            { id: 'application/vnd.ms-excel', name: OSS.Localize.get('MS Excel') },
                            { id: 'text/html', name: OSS.Localize.get('HTML') }
                        ]
                    })
                }, {
                    xtype: 'textfield',
                    labelWidth: 200,
                    name: 'save_path',
                    fieldLabel: OSS.Localize.get('Path to save files')
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: OSS.Localize.get('Document class'),
                    layout: 'hbox',
                    items: [{
                        xtype: 'combobox',
                        name: 'on_fly',
                        itemId: 'classOfDocument',
                        flex: 1,
                        mode: 'local',
                        valueField: 'id',
                        displayField: 'name',
                        store: Ext.create( "Ext.data.Store", {
                            fields: [ 
                                { type: 'int', name: 'id' }, 
                                { type: 'string', name: 'name' }
                            ],
                            data: [
                                { id: 0, name: i18n.get('Accounting document') },
                                { id: 1, name: i18n.get('User document') },
                                { id: 2, name: i18n.get('Reporting document') },
                                { id: 3, name: i18n.get('Receipt') },
                                { id: 4, name: i18n.get('Application') },
                                { id: 5, name: i18n.get('Notification') },
                                { id: 6, name: i18n.get('Account') },
                                { id: 7, name: i18n.get('Report on payments') }
                            ]
                        })
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'combobox',
                        width: 210,
                        name: 'document_period',
                        fieldLabel: OSS.Localize.get('Interval generate'),
                        mode: 'local',
                        valueField: 'id',
                        displayField: 'name',
                        store: Ext.create( "Ext.data.Store", {
                            fields: [ 
                                { type: 'int', name: 'id' }, 
                                { type: 'string', name: 'name' }
                            ],
                            data: [
                                { id: 0, name: OSS.Localize.get('Month') },
                                { id: 1, name: OSS.Localize.get('Period') },
                                { id: 2, name: OSS.Localize.get('Day') }
                            ]
                        })
                    }]
                }, {
                    xtype: 'combobox',
                    name: 'payable',
                    fieldLabel: OSS.Localize.get('Payment type'),
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    store: Ext.create( "Ext.data.Store", {
                        fields: [ 
                            { type: 'int', name: 'id' }, 
                            { type: 'string', name: 'name' }
                        ],
                        data: [
                            { id: 0, name: OSS.Localize.get('without payment') }, 
                            { id: 1, name: OSS.Localize.get('post-payment') }, 
                            { id: 2, name: OSS.Localize.get('prepayment') }, 
                            { id: 3, name: OSS.Localize.get('prepayment') + ' + ' + OSS.Localize.get('services')} 
                        ]
                    })
                }]

            }]
        }, 
        { 
            layout: 'vbox',
            columnWidth: 0.5,
            style: 'padding: 5px;',
            border: false,
            fieldDefaults: {
                labelAlign: 'left'
            },
            itemId: 'rightColumnCnt',
            items: [{
                xtype: 'fieldset',
                width: '100%',
                layout: 'form',
                style: 'background-color: #f5f5f5;',
                //padding: 10,
                title: OSS.Localize.get('Grouped documents'),
                hidden: true,
                itemId: 'groupedOrdersCnt',
                items: [{
                    xtype: 'textfield',
                    labelWidth: 200,
                    name: 'group_path',
                    fieldLabel: OSS.Localize.get('Path to save grouped documents')
                },{
                    xtype: 'combobox',
                    name: 'file_naming',
                    fieldLabel: OSS.Localize.get('Document file naming'),
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    store: Ext.create( "Ext.data.Store", {
                        fields: [ 
                            { type: 'int', name: 'id' }, 
                            { type: 'string', name: 'name' }
                        ],
                        data: [
                            { id: 0, name: OSS.Localize.get('Document ID') },
                            { id: 1, name: OSS.Localize.get('Postal index') },
                            { id: 2, name: OSS.Localize.get('Agreement number') }
                        ]
                    })
                }]
            }, {
                xtype: 'fieldset',
                width: '100%',
                defaultBackground: true,
                title: OSS.Localize.get('Automatic generation of documents'),
                items: [{
                    xtype: 'radio',
                    inputValue: '-1',
                    name: 'group_type',
                    labelWidth: 200,
                    checked: true,
                    boxLabel: OSS.Localize.get('For no one')
                }, {
                    xtype: 'radio',
                    inputValue: '0',
                    name: 'group_type',
                    checked: false,
                    boxLabel: OSS.Localize.get('For all')
                }, {
                    xtype: 'fieldcontainer',
                    itemId: 'ugroupCnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        inputValue: '1',
                        name: 'group_type',
                        itemId: 'uGroupRadio',
                        checked: false,
                        boxLabel: OSS.Localize.get('User group'),
                        width: 200
                    }, {
                        xtype: 'container',
                        layout: 'fit',
                        flex: 1,
                        items: [{
                            xtype: 'combogrid1',
                            alias: 'widget.accountgroupsgrid',
                            name: 'user_group_id',
                            width: 100,
                            store: 'documenttemplates.AccountsGroups',
                            loadOnRender: false,
                            valueField: 'group_id',
                            displayField: 'name',
                            columns: [{
                                header: i18n.get('ID'),
                                dataIndex: 'group_id',
                                width: 50
                            }, {
                                header: i18n.get('Name'),
                                dataIndex: 'name',
                                flex: 1
                            }, {
                                header: i18n.get('Description'),
                                dataIndex: 'descr',
                                flex: 2
                            }]
                        }]
                    }]                                              
                }, {
                    xtype: 'fieldcontainer',
                    itemId: 'agroupCnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        inputValue: '2',
                        name: 'group_type',
                        itemId: 'aGroupRadio',
                        checked: false,
                        boxLabel: OSS.Localize.get('Accounts group'),
                        width: 200
                     }, {
                        xtype: 'combobox',
                        name: 'group_id',
                        anchor: '100%',
                        valueField: 'group_id',
                        displayField: 'name',
                        store: 'documenttemplates.AccountsGroups',
                        flex: 1
                    }]                                              
                }]
            }]
        }]
    }]
});
