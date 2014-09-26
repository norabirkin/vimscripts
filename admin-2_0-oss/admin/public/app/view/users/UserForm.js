Ext.define('OSS.view.users.UserForm', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.user_form',
    activeTab: 0,
    user_id: 0,
    is_template: 0,
    user_name: '',
    plain: true,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'back',
                            form: function() {
                                return [
                                    Ext.app.Application.instance.getController('Users').getUserInformationForm(),
                                    Ext.app.Application.instance.getController('Users').getAgreementForm()
                                ];
                            },
                            grid: Ext.app.Application.instance.getController('Users').getUsersList
                        }, '-',
                        {
                            xtype: 'splitbutton',
                            text: i18n.get('Actions'),
                            itemId: 'actionsBtn',
                            handler: function(Btn) {
                                Btn.showMenu();
                            }, 
                            menu: {
                                items: [{
                                    itemId: 'addNewDocumentBtn',
                                    iconCls: 'x-ibtn-def x-ibtn-list',
                                    hidden: true,
                                    text: i18n.get('Generate document')
                                },
                                {
                                    itemId: 'saveUserBtn',
                                    iconCls: 'x-ibtn-save',
                                    text: i18n.get('Save')
                                }, 
                                {
                                    xtype: 'menuseparator',
                                    itemId: 'firstSeparator',
                                    hidden: false
                                },
                                {
                                    iconCls: 'x-ibtn-add',
                                    itemId: 'addAgreement',
                                    text: i18n.get('Add agreement')
                                },
                                {
                                    iconCls: 'x-ibtn-lock',
                                    itemId: 'blockVgBtn',
                                    hidden: true,
                                    disabled: true,
                                    text: i18n.get('Block account entries')
                                },
                                {
                                    iconCls: 'x-ibtn-unlock',
                                    itemId: 'unblockVgBtn',
                                    hidden: true,
                                    disabled: true,
                                    text: i18n.get('Activate account entries')
                                },
                                {
                                    iconCls: 'x-ibtn-remove',
                                    itemId: 'cancelAgrmBtn',
                                    hidden: true,
                                    disabled: true,
                                    text: i18n.get('Terminate contract')
                                },
                                {
                                    iconCls: 'x-ibtn-delete',
                                    itemId: 'removeAgrmBtn',
                                    hidden: true,
                                    disabled: true,
                                    text: i18n.get('Remove contract')
                                },
                                {
                                    xtype: 'menuseparator',
                                    itemId: 'secondSeparator',
                                    hidden: true
                                },
                                {
                                    itemId: 'createVgroupBtn',
                                    iconCls: 'x-ibtn-user-add',
                                    disabled: true,
                                    text: i18n.get('Create account entry')
                                },
                                {
                                    iconCls: 'x-ibtn-additional',
                                    itemId: 'showAddons',
                                    text: i18n.get('Additional fields')
                                }
                                /*
                                ,
                                {
                                    disabled: true,
                                    iconCls: 'x-ibtn-logs',
                                    text: i18n.get('Operations log')
                                },
                                {
                                    disabled: true,
                                    iconCls: 'x-ibtn-services',
                                    text: i18n.get('Service packets')
                                }*/]
                            }
                        }
                    ]
                }
            ],
            items: [
    /* First tab - registry information */        
                {
                    xtype: 'panel',
                    itemId: 'userInformationTab',
                    layout: {
                        type: 'fit'
                    },
                    title: i18n.get('Registry information'),
                    items: [
                        {
                            xtype: 'form',
                            itemId: 'userInformationForm',
                            autoScroll: true,
                            bodyPadding: 10,
                            border: false,
                            layout: 'anchor',
                            items: [
                                {
                                    xtype: 'hidden',
                                    name: 'uid',
                                    valeu: 0
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'is_template',
                                    valeu: 0
                                },
                                {
                                    xtype: 'fieldset',
                                    // This is not default sencha option
                                    // Comes from override of the fieldset
                                    // Use it if need to change default transparent background to them settings
                                    defaultBackground: true,
                                    frame: true,
                                    layout: 'column',
                                    title: i18n.get('Common settings'),
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            margin: '0 30 0 0',
                                            defaults: { anchor: '100%' },
                                            layout: 'anchor',
                                            fieldLabel: '',
                                            columnWidth: 0.3,
                                            items: [
                                                {
                                                    xtype: 'combo',
                                                    fieldLabel: i18n.get('Category'),
                                                    name: 'category',
                                                    editable: false,
                                                    hiddenName: 'category',
                                                    anchor: '100%',
                                                    valueField: 'id',
                                                    displayField: 'name',
                                                    value: 0,
                                                    store: 'users.Categories'
                                                },
                                                {
                                                    xtype: 'combo',
                                                    fieldLabel: i18n.get('Person type'),
                                                    mode: 'local',
                                                    editable: false,
                                                    triggerAction: 'all',
                                                    anchor: '100%',
                                                    valueField: 'id',
                                                    displayField: 'name',
                                                    name: 'type',
                                                    itemId: 'userType',
                                                    hiddenName: 'type',
                                                    value: 1,
                                                    store: 'users.UserTypes'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: i18n.get('Login'),
                                                    allowBlank: false,
                                                    name: 'login',
                                                    anchor: '100%'
                                                },
                                                {
                                                    xtype: 'hidden',
                                                    name: 'fake_pass'
                                                },
                                                {
                                                    xtype: 'fieldcontainer',
                                                    itemId: 'password',
                                                    layout: 'hbox',
                                                    anchor: '100%',
                                                    fieldLabel: i18n.get('Password'),
                                                    items: [Ext.create('OSS.ux.form.field.Password', {
                                                        patternSetting: 'user_pass_symb'
                                                    }), {
                                                        xtype: 'tbspacer',
                                                        width: 5
                                                    }, {
                                                        xtype: 'button',
                                                        disabled: true,
                                                        itemId: 'genPasswordBtn',
                                                        iconCls: 'x-ibtn-key'
                                                    }]
                                                },                                                
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: i18n.get('Identifier'),
                                                    name: 'uuid',
                                                    anchor: '100%'
                                                },
                                                {
                                                    xtype: 'checkboxfield',
                                                    hideLabel: true,
                                                    name: 'ip_access',
                                                    boxLabel: i18n.get('Check User IP to allow access'),
                                                    anchor: '100%'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            margin: '0 30 0 0',
                                            defaults: { anchor: '100%' },
                                            layout: 'anchor',
                                            itemId: 'namingsCtn',
                                            columnWidth: 0.7,
                                            items: [{
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [{
                                                    xtype: 'textfield',
                                                    itemId: 'companyNameCnt',
                                                    name: 'name',
                                                    flex: 1,
                                                    labelWidth: 100,
                                                    fieldLabel: i18n.get('Company name'),
                                                    anchor: '100%'
                                                }, {
                                                    xtype: 'tbspacer',
                                                    width: 5
                                                }, {
                                                    xtype: 'button',
                                                    iconCls: 'x-ibtn-users',    
                                                    disabled: true,
                                                    width: 24,
                                                    tooltip: i18n.get('Similar users'),
                                                    style: 'margin-top: 5px;'
                                                }]
                                            }, {
                                                xtype: 'fieldcontainer',
                                                itemId: 'naturalPersonCnt',
                                                hidden: true,
                                                layout: 'column',
                                                defaults: {
                                                    labelWidth: 60
                                                },
                                                items: [{
                                                    xtype: 'textfield',
                                                    columnWidth: 0.30,
                                                    fieldLabel: i18n.get('Second name'),
                                                    name: 'abonent_surname',
                                                    anchor: '100%',
                                                    labelWidth: 100,
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.33,
                                                    fieldLabel: i18n.get('First name'),
                                                    name: 'abonent_name',
                                                    anchor: '100%',
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.33,
                                                    name: 'abonent_patronymic',
                                                    fieldLabel: i18n.get('Middle name'),
                                                    anchor: '100%'
                                                }, {
                                                    xtype: 'container',
                                                    columnWidth: 0.04,
                                                    layout: 'hbox',
                                                    items: [{
                                                        xtype: 'tbspacer',
                                                        width: 5
                                                    },{
                                                        xtype: 'button',
                                                        iconCls: 'x-ibtn-users',    
                                                        disabled: true,
                                                        width: 24,
                                                        tooltip: i18n.get('Similar users')
                                                    }]
                                                }]                                                
                                            }, {
                                                xtype: 'fieldcontainer',
                                                itemId: 'phonesCnt',
                                                layout: 'column',
                                                defaults: {
                                                    labelWidth: 100
                                                },
                                                items: [{
                                                    xtype: 'textfield',
                                                    columnWidth: 0.5,
                                                    fieldLabel: i18n.get('Phone number'),
                                                    name: 'phone',
                                                    anchor: '100%',
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.5,
                                                    maxLength: 10,
                                                    labelWidth: 140,
                                                    fieldLabel: i18n.get('Mobile number'),
                                                    name: 'mobile',
                                                    anchor: '100%'
                                                }]                                                
                                            }, {
                                                xtype: 'fieldcontainer',
                                                itemId: 'emailAndFaxCnt',
                                                layout: 'column',
                                                defaults: {
                                                    labelWidth: 100
                                                },
                                                items: [{
                                                    xtype: 'textfield',
                                                    columnWidth: 0.5,
                                                    fieldLabel: i18n.get('Email'),
                                                    name: 'email',
                                                    anchor: '100%',
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.5,
                                                    labelWidth: 140,
                                                    fieldLabel: i18n.get('Fax number'),
                                                    name: 'fax',
                                                    anchor: '100%'
                                                }]                                                
                                            },  {
                                                xtype: 'fieldcontainer',
                                                itemId: 'descriptionCnt',
                                                layout: 'column',
                                                defaults: {
                                                    labelWidth: 100
                                                },
                                                items: [{
                                                    xtype: 'textareafield',
                                                    columnWidth: 0.5,
                                                    fieldLabel: i18n.get('Description'),
                                                    height: 50,
                                                    name: 'descr',
                                                    anchor: '100%',
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'fieldcontainer',
                                                    itemId: 'adressesCnt',
                                                    columnWidth: 0.5,
                                                    layout: 'anchor',
                                                    items: [{
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        itemId: 'firstAddress',
                                                        style: 'margin-bottom: 6px;',
                                                        items: [{
                                                            xtype: 'label',
                                                            text: i18n.get('Legal address'),
                                                            width: 145
                                                        }, {
                                                            xtype: 'button',
                                                            itemId: 'firstAddressBtn',
                                                            iconCls: 'x-ibtn-address',
                                                            menu: {
                                                                items: [{
                                                                    text: i18n.get('Change'),
                                                                    iconCls: 'x-ibtn-edit',
                                                                    itemId: 'addressLegalBtn'
                                                                }, {
                                                                    text: i18n.get('Copy to'),
                                                                    iconCls: 'x-ibtn-copy',
                                                                    menu: [{
                                                                        text: i18n.get('Postal address'),
                                                                        itemId: 'copyToSecondBtn'
                                                                    }, {
                                                                        text: i18n.get('Delivery address'),
                                                                        itemId: 'copyToThirdBtn'
                                                                    }, {
                                                                        text: i18n.get('All address values'),
                                                                        itemId: 'copyToAllBtn'
                                                                    }]
                                                                }, {
                                                                    text: i18n.get('Clear'),
                                                                    iconCls: 'x-ibtn-def x-ibtn-delete',
                                                                    itemId: 'clearFirstAddressBtn'
                                                                }]
                                                            }
                                                        }, {
                                                            xtype: 'tbspacer',
                                                            width: 5
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'address_code',
                                                            name: 'address_code_1',
                                                            value: null
                                                        }, {
                                                            xtype: 'textfield',
                                                            flex: 1,
                                                            readOnly: true,
                                                            name: 'address_1'
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'atype',
                                                            name: 'atype',
                                                            value: 0
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'address_full',
                                                            name: 'address_descr_1'
                                                        }]
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        itemId: 'secondAddress',
                                                        layout: 'hbox',
                                                        items: [{
                                                            xtype: 'label',
                                                            text: i18n.get('Postal address'),
                                                            width: 145
                                                        }, {
                                                            xtype: 'button',
                                                            itemId: 'secondAddressBtn',
                                                            iconCls: 'x-ibtn-address',
                                                            menu: {
                                                                items: [{
                                                                    text: i18n.get('Change'),
                                                                    iconCls: 'x-ibtn-edit',
                                                                    itemId: 'addressPostalBtn'
                                                                }, {
                                                                    text: i18n.get('Copy to'),
                                                                    iconCls: 'x-ibtn-copy',
                                                                    menu: [{
                                                                        text: i18n.get('Legal address'),
                                                                        itemId: 'copyToFirstBtn'
                                                                    }, {
                                                                        text: i18n.get('Delivery address'),
                                                                        itemId: 'copyToThirdBtn'
                                                                    }, {
                                                                        text: i18n.get('All address values'),
                                                                        itemId: 'copyToAllBtn'
                                                                    }]
                                                                }, {
                                                                    text: i18n.get('Clear'),
                                                                    iconCls: 'x-ibtn-def x-ibtn-delete',
                                                                    itemId: 'clearSecondAddressBtn'
                                                                }]
                                                            }
                                                        }, {
                                                            xtype: 'tbspacer',
                                                            width: 5
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'address_code',
                                                            name: 'address_code_2',
                                                            value: null
                                                        }, {
                                                            xtype: 'textfield',
                                                            flex: 1,
                                                            name: 'address_2',
                                                            readOnly: true
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'atype',
                                                            name: 'atype',
                                                            value: 1
                                                        }, {
                                                            xtype: 'hidden',
                                                            itemId: 'address_full',
                                                            name: 'address_descr_2'
                                                        }]
                                                    }]
                                                }]                                                
                                            }, {
                                                xtype: 'fieldcontainer',
                                                itemId: 'deliveryCnt',
                                                layout: 'column',
                                                defaults: {
                                                    labelWidth: 100
                                                },
                                                items: [{
                                                    xtype: 'combo',
                                                    columnWidth: 0.5,
                                                    name: 'bill_delivery',
                                                    hiddenName: 'bill_delivery',
                                                    fieldLabel: i18n.get('Invoice delivery'),
                                                    mode: 'local',
                                                    anchor: '100%',
                                                    valueField: 'id',
                                                    displayField: 'name',
                                                    editable: false,
                                                    store: 'users.UserBillsDelivery',
                                                    style: 'margin-right: 15px;'
                                                }, {
                                                    xtype: 'container',
                                                    columnWidth: 0.5,
                                                    itemId: 'thirdAddress',
                                                    layout: 'hbox',
                                                    items: [{
                                                        xtype: 'label',
                                                        text: i18n.get('Delivery address'),
                                                        width: 145
                                                    }, {
                                                        xtype: 'button',
                                                        itemId: 'thirdAddressBtn',
                                                        iconCls: 'x-ibtn-address',
                                                        menu: {
                                                            items: [{
                                                                text: i18n.get('Change'),
                                                                iconCls: 'x-ibtn-edit',
                                                                itemId: 'addressDeliveryBtn'
                                                            }, {
                                                                text: i18n.get('Copy to'),
                                                                iconCls: 'x-ibtn-copy',
                                                                menu: [{
                                                                    text: i18n.get('Legal address'),
                                                                    itemId: 'copyToFirstBtn'
                                                                }, {
                                                                    text: i18n.get('Postal address'),
                                                                    itemId: 'copyToSecondBtn'
                                                                }, {
                                                                    text: i18n.get('All address values'),
                                                                    itemId: 'copyToAllBtn'
                                                                }]
                                                            }, {
                                                                text: i18n.get('Clear'),
                                                                iconCls: 'x-ibtn-def x-ibtn-delete',
                                                                itemId: 'clearThirdAddressBtn'
                                                            }]
                                                        }
                                                    }, {
                                                        xtype: 'tbspacer',
                                                        width: 5
                                                    }, {
                                                        xtype: 'hidden',
                                                        itemId: 'address_code',
                                                        name: 'address_code_3',
                                                        value: null
                                                    }, {
                                                        xtype: 'textfield',
                                                        flex: 1,
                                                        name: 'address_3',
                                                        readOnly: true
                                                    }, {
                                                        xtype: 'hidden',
                                                        itemId: 'atype',
                                                        name: 'atype',
                                                        value: 2
                                                    }, {
                                                        xtype: 'hidden',
                                                        itemId: 'address_full',
                                                        name: 'address_descr_3'
                                                    }]
                                                }]                                                
                                            }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'card',
                                    itemId: 'userInformationByType',
                                    activeItem: 0,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            border: false,
                                            layout: 'auto',
                                            padding: 10,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    // This is not default sencha option
                                                    // Comes from override of the fieldset
                                                    // Use it if need to change default transparent background to them settings
                                                    defaultBackground: true,
                                                    layout: 'column',
                                                    title: i18n.get('Personal data'),
                                                    items: [{
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: { anchor: '100%' },
                                                            layout: {
                                                                type: 'anchor'
                                                            },
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'gen_dir_u',
                                                                    fieldLabel: i18n.get('Director'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'gl_buhg_u',
                                                                    fieldLabel: i18n.get('Chief accountant'),
                                                                    anchor: '100%'
                                                                }
                                                            ]
                                                        }, {
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: { anchor: '100%' },
                                                            layout: 'anchor',
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [{
                                                                xtype: 'textfield',
                                                                name: 'kont_person',
                                                                fieldLabel: i18n.get('Contact person'),
                                                                anchor: '100%'
                                                            },
                                                            {
                                                                xtype: 'textfield',
                                                                name: 'act_on_what',
                                                                fieldLabel: i18n.get('Operates on the basis'),
                                                                anchor: '100%'
                                                            }]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    // This is not default sencha option
                                                    // Comes from override of the fieldset
                                                    // Use it if need to change default transparent background to them settings
                                                    defaultBackground: true,
                                                    layout: 'column',
                                                    title: i18n.get('Bank details'),
                                                    items: [
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: 'anchor: \'100%\n',
                                                            layout: 'anchor',
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'bank_name',
                                                                    fieldLabel: i18n.get('Bank name'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'branch_bank_name',
                                                                    fieldLabel: i18n.get('Branch of bank'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'bik',
                                                                    fieldLabel: i18n.get('BIK'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'settl',
                                                                    fieldLabel: i18n.get('Charge account'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'corr',
                                                                    fieldLabel: i18n.get('Correspondent account'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'inn_1',
                                                                    fieldLabel: i18n.get('ITN'),
                                                                    anchor: '100%'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: { anchor: '100%' },
                                                            layout: 'anchor',
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'ogrn',
                                                                    fieldLabel: i18n.get('OGRN'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'kpp',
                                                                    fieldLabel: i18n.get('KPP'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'okpo',
                                                                    fieldLabel: i18n.get('OKPO'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'okved',
                                                                    fieldLabel: i18n.get('OKVED'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'treasury_name',
                                                                    fieldLabel: i18n.get('Treasury name'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'treasury_account',
                                                                    fieldLabel: i18n.get('Treasury personal account'),
                                                                    anchor: '100%'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, {
                                            xtype: 'panel',
                                            border: false,
                                            layout: 'auto',
                                            padding: 10,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    // This is not default sencha option
                                                    // Comes from override of the fieldset
                                                    // Use it if need to change default transparent background to them settings
                                                    defaultBackground: true,
                                                    layout: 'column',
                                                    title: i18n.get('Passport data'),
                                                    items: [
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: { anchor: '100%' },
                                                            layout: 'anchor',
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'pass_sernum',
                                                                    fieldLabel: i18n.get('Seria'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'pass_no',
                                                                    fieldLabel: i18n.get('Number'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'datefield',
                                                                    format: 'Y-m-d',
                                                                    name: 'pass_issue_date',
                                                                    fieldLabel: i18n.get('Date of issue'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'pass_issue_place',
                                                                    fieldLabel: i18n.get('Place of issue'),
                                                                    anchor: '100%'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            margin: '0 40 0 0',
                                                            defaults: { anchor: '100%' },
                                                            layout: 'anchor',
                                                            fieldLabel: '',
                                                            columnWidth: 0.5,
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'pass_issue_dep',
                                                                    fieldLabel: i18n.get('Issued by'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'datefield',
                                                                    format: 'Y-m-d',
                                                                    name: 'birth_date',
                                                                    fieldLabel: i18n.get('Day of birth'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'birth_place',
                                                                    fieldLabel: i18n.get('Place of birth'),
                                                                    anchor: '100%'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    name: 'inn_2',
                                                                    fieldLabel: i18n.get('ITN'),
                                                                    anchor: '100%'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
    /* Second tab - agreements */
                {
                    xtype: 'panel',
                    itemId: 'userAgreementsTab',
                    layout: 'border',
                    title: i18n.get('Agreements'),
                    items: [{
                        xtype: 'panel',
                        region: 'west',
                        split: true, 
                        collapsible: false,
                        layout: {
                            type: 'border',
                            align: 'stretch'
                        },
                        width: '40%',
                        items: [
                /* Agreements list */
                        {
                            xtype: 'gridpanel',
                            height: '60%',
                            flex: 2,
                            region: 'north',
                            split: true, 
                            collapsible: false,
                            autoScroll: true,
                            itemId: 'agreementsGrid',
                            store: 'users.UserAgreements',
                            dockedItems: [{
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                dock: 'bottom',
                                store: 'users.UserAgreements'
                            }],
                            columns: [
                                {
                                    width: 150,
                                    dataIndex: 'oper_name',
                                    text: i18n.get('Operator'),
                                    hidden: true
                                },
                                {    
                                    dataIndex: 'agrm_num',
                                    flex: 1,
                                    text: i18n.get('Agreement number'),
                                    renderer: function(value) {
                                        if(!value) {
                                            return '<font color="#c0c0c0"><i>'+ i18n.get('Not specified') +'</i></font>';
                                        }
                                        return value;
                                    }
                                },
                                {
                                    width: 120,
                                    hidden: true,
                                    dataIndex: 'payment_method',
                                    text: i18n.get('Type'),
                                    renderer: function(value, meta, record) {
                                        if(value == 0) {
                                            return i18n.get('Advance');
                                        } else if (value == 1) {
                                            return i18n.get('Credit agreement');
                                        } else if (value == 2) {
                                            return i18n.get('Mixed');
                                        } else {
                                            return value;
                                        }
                                    }
                                },
                                {
                                    width: 110,
                                    dataIndex: 'pay_code',
                                    text: i18n.get('Pay code')
                                },
                                {
                                    width: 110,
                                    dataIndex: 'balance',
                                    text: i18n.get('Balance'),
                                    renderer: function(value, meta, record) {
                                        return value + ' ' + record.get('symbol');
                                    }
                                },
                                {
                                    width: 110,
                                    dataIndex: 'credit',
                                    text: i18n.get('Credit')
                                }
                            ]
                        },
                /* Vgroups list */        
                        {
                            xtype: 'gridpanel',
                            itemId: 'vgroupsGrid',
                            store: 'users.UserVgroups',
                            flex: 1,
                            region: 'center',
                            autoScroll: true,
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    disabled: true,
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldLabel: i18n.get('Agent'),
                                            labelWidth: 50
                                        },
                                        {
                                            xtype: 'combo',
                                            fieldLabel: i18n.get('Status'),
                                            labelWidth: 50
                                        },
                                        {
                                            xtype: 'splitbutton',
                                            text: i18n.get('Blocking'),
                                            menu: {
                                                xtype: 'menu',
                                                items: [
                                                    {
                                                        xtype: 'menuitem',
                                                        text: i18n.get('Block')
                                                    },
                                                    {
                                                        xtype: 'menuitem',
                                                        text: i18n.get('Unblock')
                                                    },
                                                    {
                                                        xtype: 'menuitem',
                                                        text: i18n.get('Turn on')
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    width: 360,
                                    displayInfo: true,
                                    dock: 'bottom',
                                    store: 'users.UserVgroups'
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'editVgroupBtn',
                                    iconCls: 'x-ibtn-def x-ibtn-edit',
                                    width: 26
                                },
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'showChargesBtn',
                                    iconCls: 'x-ibtn-def x-ibtn-chart',
                                    width: 26
                                },
                                {
                                    dataIndex: 'login',
                                    flex: 1,
                                    text: i18n.get('Login')
                                },
                                {
                                    dataIndex: 'tar_name',
                                    flex: 1,
                                    text: i18n.get('Tariff')
                                },
                                {    
                                    dataIndex: 'acc_on_date',
                                    hidden: true,
                                    format: 'd.m.Y H:i',
                                    width: 140,
                                    text: i18n.get('Turn on date'),
                                    renderer: function(value) {
                                        try {
                                            if(value.format('Y') <= 1900) {
                                                return '-';
                                            }
                                            return value.format('d.m.Y H:i');
                                        }
                                        catch(e) {
                                            return value
                                        }
                                    }
                                },
                                {
                                    dataIndex: 'acc_off_date',
                                    format: 'd.m.Y H:i',
                                    hidden: true,
                                    width: 140,
                                    text: i18n.get('Turn off date'),
                                    renderer: function(value) {
                                        try {
                                            if(value.format('Y') <= 1900) {
                                                return '-';
                                            }
                                            return value.format('d.m.Y H:i');
                                        }
                                        catch(e) {
                                            return value
                                        }
                                    }
                                },
                                {
                                    dataIndex: 'blocked',
                                    width: 32,
                                    renderer: function(value, metaData) {
                                        var type;
                                        if (value) {
                                            metaData.tdCls = 'x-ibtn-def x-ibtn-user-blocked';
                                        } else {
                                            metaData.tdCls = 'x-ibtn-def x-ibtn-user';
                                        }
                                        switch (value) {
                                        case 1:
                                        case 4:
                                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by balance') + ' (' + i18n.get('Blocking') + ':' + value + ')"';
                                            type = i18n.get('B');
                                            break;
                                        case 10:
                                            metaData.tdAttr = 'data-qtip="' + i18n.get('Turned off') + ' (' + i18n.get('Blocking') + ':' + value + ')"';
                                            type = 'O';
                                            break;
                                        case 3:
                                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by manager') + ' (' + i18n.get('Blocking') + ':' + value + ')"';
                                            type = 'A';
                                            break;
                                        case 5:
                                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by traffic') + ' (' + i18n.get('Blocking') + ':' + value + ')"';
                                            type = 'T';
                                            break;
                                        case 2:
                                            metaData.tdAttr = 'data-qtip="' + i18n.get('Blocked by user') + ' (' + i18n.get('Blocking') + ':' + value + ')"';
                                            type = i18n.get('U');
                                            break;
                                        }
                                        return '&nbsp;&nbsp;&nbsp;' + (type || '');
                                    }
                                },
                                {
                                    xtype: 'datecolumn',
                                    width: 140,
                                    hidden: true,
                                    format: 'd.m.Y H:i',
                                    dataIndex: 'block_date',
                                    text: i18n.get('Date'),
                                    renderer: function(value) {
                                        try {
                                            if(value.format('Y') <= 1900) {
                                                return '-';
                                            }
                                            return value.format('d.m.Y H:i');
                                        }
                                        catch(e) {
                                            return value
                                        }
                                    }
                                }
                            ]
                        }]
                    }, 
            /* Region center: form */    
                    {
                        xtype: 'tabpanel',
                        region: 'center',
                        items: [{
                            xtype: 'form',
                            itemId: 'agreementForm',
                            title: i18n.get('Agreement properties'),
                            padding: 10,
                            disabled: true,
                            layout: 'anchor',
                            items: [{
                                xtype: 'fieldset',
                                layout: 'column',
                                itemId: 'basic',
                                title: i18n.get('Basic'),
                                defaultBackground: true,
                                items: [{
                                    xtype: 'fieldset',
                                    itemId: 'inner',
                                    border: false,
                                    padding: 0,
                                    defaults: {
                                        labelWidth: 130,
                                        anchor: '90%'
                                    },
                                    layout: 'anchor',
                                    columnWidth: 0.5,
                                    items: [{
                                        xtype: 'hidden',
                                        value: 0,
                                        name: 'promissedExist'
                                    },{
                                        xtype: 'hidden',
                                        name: 'agrm_id',
                                        value: 0
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: i18n.get('Operator'),
                                        name: 'oper_id',
                                        hiddenName: 'oper_id',
                                        displayField: 'name',
                                        valueField: 'uid',
                                        allowBlank: false,
                                        triggerAction: 'all',
                                        store: 'users.Operators'
                                    }, {
                                        xtype: 'fieldcontainer',
                                        layout: 'hbox',
                                        itemId: 'number',
                                        fieldLabel: i18n.get('Agreement number'),
                                        items: [{
                                            xtype: 'textfield',
                                            allowBlank: false,
                                            flex: 1,
                                            name: 'agrm_num'
                                        }, {
                                            xtype: 'tbspacer',
                                            width: 5
                                        }, Ext.create('OSS.ux.button.DinamicMenu', {
                                            displayTpl: '<tpl for=".">{value} ({[Ext.util.Format.ellipsis(values.descr, 60)]})</tpl>',
                                            valueField: 'value',
                                            displayField: 'descr',
                                            store: Ext.app.Application.instance.getController('Settings').getSettingsAgreementTemplatesStore(),
                                            itemId: 'templates',
                                            iconCls: 'x-ibtn-list2'
                                        })]
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: i18n.get('Agreement type'),
                                        allowBlank: false,
                                        name: 'payment_method',
                                        store: [[0, i18n.get('Advance')],[1, i18n.get('Credit agreement')],[2, i18n.get('Mixed')]]
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.get('Agreement state'),
                                        disabled: true,
                                        name: 'balance_status'
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: i18n.get('Parent agreement'),
                                        name: 'owner_id',
                                        hiddenName: 'owner_id',
                                        displayField: 'name',
                                        valueField: 'uid',
                                        triggerAction: 'all',
                                        store: 'users.OwnerOperators',
                                        value: 0
                                    }]
                                },
                                {
                                    xtype: 'fieldset',
                                    border: false,
                                    style: 'margin-left: 10px;',
                                    defaults: {
                                        labelWidth: 130,
                                        anchor: '90%'
                                    },
                                    layout: 'anchor',
                                    columnWidth: 0.5,
                                    items: [{
                                        xtype: 'datefield',
                                        value: Ext.Date.clearTime(new Date()),
                                        fieldLabel: i18n.get('Date'),
                                        name: 'create_date'
                                    }, 
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.get('Pay code'),
                                        name: 'pay_code'
                                    },
                                    {
                                        xtype: 'textfield',
                                        disabled: true,
                                        licid: 'full',
                                        fieldLabel: i18n.get('Installment'),
                                        name: 'installments'
                                    },
                                    {
                                        xtype: 'datefield',
                                        disabled: true,
                                        fieldLabel: i18n.get('Date of terminate'),
                                        name: 'close_date'
                                    },{
                                        xtype: 'combobox',
                                        fieldLabel: i18n.get('Currency'),
                                        name: 'cur_id',
                                        hiddenName: 'cur_id',
                                        displayField: 'name',
                                        valueField: 'id',
                                        triggerAction: 'all',
                                        store: 'currency.Grid'
                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.get('Credit'),
                                        name: 'credit',
                                        itemId: 'creditField'
                                    }]
                                }]
                            },
                            {
                                xtype: 'fieldset',
                                title: i18n.get('Additional'),
                                defaultBackground: true,
                                items: [
                                Ext.create('OSS.view.Agreements', {
                                    labelWidth: 180,
                                    itemId: 'friend',
                                    name: 'friend_agrm_id',
                                    hiddenName: 'friend_agrm_id',
                                    fieldLabel: i18n.get('Invite friend')
                                }),
                                Ext.create('OSS.view.Agreements', {
                                    labelWidth: 180,
                                    itemId: 'parent',
                                    name: 'parent_agrm_id',
                                    hiddenName: 'parent_agrm_id',
                                    fieldLabel: i18n.get('Parent agreement')
                                }),
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    labelWidth: 180,
                                    name: 'priority',
                                    fieldLabel: i18n.get('Priority allocation'),
                                    width: 500
                                }]
                            }]
                        }, {
                            xtype: 'panel',
                            disabled: true,
                            licid: 'full',
                            title: i18n.get('Customer equipment')
                        }, {
                            xtype: 'panel',
                            licid: 'full',
                            disabled: true,
                            title: i18n.get('Promotions')
                        }]
                    }]
                },
                
    /* Third tab */        
                {
     
                    xtype: 'panel',
                    itemId: 'userDocumentsTab',
                    disabled: true,
                    //layout: 'card',
                    //activeItem: 0,
                    title: i18n.get('Documents'),
                    layout: 'border',
                    items: [{ 
                        xtype: 'form',
                        region: 'west',
                        split: true, 
                        collapsible: false,
                        minWidth: 400,
                        width: '40%',
                        frame: true,
                        items: [{
                            xtype: 'fieldset',
                            layout: 'anchor',
                            margin: 5,
                            padding: 10,
                            defaults: {
                                anchor: '100%',
                                labelWidth: 120
                            },
                            items: [{
                                xtype: 'hidden',
                                name: 'doc_per',
                                value: 0
                            }, {
                                xtype: 'hidden',
                                name: 'on_fly',
                                value: 0
                            }, {
                                xtype: 'templateslist',
                                allowBlank: false,
                                itemId: 'templatesList',
                                store: 'documenttemplates.UserDocuments'
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                hidden: true,
                                itemId: 'apCnt',
                                anchor: '100%',
                                fieldLabel: i18n.get('Sum'),
                                items: [{
                                    xtype: 'textfield',
                                    name: 'sum',
                                    flex: 1,
                                    disabled: true                
                                }, {
                                    xtype: 'tbspacer',
                                    width: 5
                                }, {
                                    xtype: 'checkbox',
                                    boxLabel: i18n.get('Fee amount'),
                                    name: 'apCbox',
                                    itemId: 'apCbox',
                                    hideLabel: true,
                                    inputValue: 1,
                                    checked: true
                                }]
                            }, {
                                xtype: 'datefield',
                                name: 'date',
                                fieldLabel: i18n.get('Date of issue'),
                                hidden: true
                            }, {
                                xtype: 'fieldcontainer',
                                hidden: true,
                                itemId: 'periodCnt',
                                fieldLabel: i18n.get('Period'),
                                layout: 'hbox',
                                items: [{
                                    xtype: 'combo',
                                    editable: false,
                                    name: 'period_year',
                                    flex: 1,
                                    value: Ext.Date.format(new Date(), 'Y'),
                                    store: [
                                        ['2010', '2010' ],
                                        ['2011', '2011' ],
                                        ['2012', '2012' ],
                                        ['2013', '2013' ],
                                        ['2014', '2014' ],
                                        ['2015', '2015' ],
                                        ['2016', '2016' ],
                                        ['2017', '2017' ],
                                        ['2018', '2018' ],
                                        ['2019', '2019' ],
                                        ['2020', '2020' ]
                                    ]
                                }, {
                                    xtype: 'tbspacer',
                                    width: 5
                                }, {
                                    xtype: 'combo',
                                    flex: 1,
                                    name: 'period_month',
                                    editable: false,
                                    value: Ext.Date.format(new Date(), 'm'),
                                    store: [
                                        ['01', i18n.get('January')],
                                        ['02', i18n.get('February')],
                                        ['03', i18n.get('March')],
                                        ['04', i18n.get('April')],
                                        ['05', i18n.get('May')],
                                        ['06', i18n.get('June')],
                                        ['07', i18n.get('July')],
                                        ['08', i18n.get('August')],
                                        ['09', i18n.get('September')],
                                        ['10', i18n.get('October')],
                                        ['11', i18n.get('November')],
                                        ['12', i18n.get('December')]
                                    ]
                                }]
                            }, {
                                xtype: 'fieldcontainer',
                                fieldLabel: i18n.get('Period'),
                                itemId: 'periodFromToCnt',
                                layout: 'hbox',
                                hidden: true,
                                defaults: {
                                    labelWidth: 30
                                },
                                items: [{
                                    xtype: 'datefield',
                                    flex: 1,
                                    name: 'period_since',
                                    fieldLabel: i18n.get('Since')
                                }, {
                                    xtype: 'tbspacer',
                                    width: 10
                                },{
                                    xtype: 'datefield',
                                    flex: 1,
                                    name: 'period_till',
                                    fieldLabel: i18n.get('Till')
                                }]
                            },
                            {
                                xtype: 'agreementsComboGrid',
                                allowBlank: false,
                                itemId: 'agreementsCG'
                            }, {
                                xtype: 'accountsComboGrid',
                                hidden: true,
                                itemId: 'accountsCG'
                            }]
                        }]
                    }, {
                        xtype: 'gridpanel',
                        region: 'center',
                        dockedItems: [{
                            xtype: 'pagingtoolbar',
                            store: 'users.UserDocuments'
                        }],
                        columns: [{
                            xtype: 'storecolumn',
                            header: i18n.get('Document type'),
                            dataIndex: 'on_fly',
                            flex: 1,
                            store: 'users.DocumentTypes'
                        }, {
                            header: i18n.get('Document name'),
                            dataIndex: 'doc_name',
                            flex: 1
                        }, {
                            header: i18n.get('Document template'),
                            dataIndex: 'template',
                            flex: 1
                        }, {
                            header: i18n.get('Period'),
                            dataIndex: 'period',
                            flex: 1
                        }, {
                            header: i18n.get('Sum'),
                            dataIndex: 're_summ',
                            flex: 1
                        }, {
                            header: i18n.get('Agreement'),
                            dataIndex: 'agrm_num',
                            flex: 1
                        }, {
                            header: i18n.get('Pay date'),
                            dataIndex: 'pay_date',
                            width: 110,
                            xtype: 'datecolumn',
                            format: 'd.m.Y H:i',
                            renderer: function(value) {
                                if(!Ext.isEmpty(value)) {
                                    return Ext.Date.format(value, 'd.m.Y H:i');
                                }
                            }
                        }, {
                            xtype: 'actioncolumn',
                            iconCls: 'x-ibtn-save',
                            itemId: 'saveDocumentBtn',
                            width: 27
                        }],
                        store: 'users.UserDocuments'
                    }]
                },
                {
                    xtype: 'panel',
                    hidden: true,
                    title: i18n.get('Helpdesk')
                }
            ]
        });

        me.callParent(arguments);
    }

});
