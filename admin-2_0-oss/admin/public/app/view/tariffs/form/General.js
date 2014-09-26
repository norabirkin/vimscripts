/**
 * Вкладка "Основные настройки" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.General', {
    extend: 'Ext.panel.Panel',
    itemId: 'wrap',
    autoScroll: true,
    title: i18n.get('General settings'),
    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [Ext.create('OSS.view.tariffs.form.Back'), '-', {
                xtype: 'splitbutton',
                text: i18n.get('Actions'),
                handler: function(Btn) {
                    Btn.showMenu();
                },
                menu: {
                    items: [{
                        itemId: 'saveTariffDataBtn',
                        iconCls: 'x-ibtn-save',
                        text: i18n.get('Save settings')
                    }]
                }
            }]
        }];
        this.items = [{
            xtype: 'form',
            itemId: 'general',
            border: false,
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'used',
                    value: 0
                },
                {
                    xtype: 'hidden',
                    name: 'tar_type',
                    value: 0
                },
                {
                    xtype: 'container',
                    itemId: 'left',
                    minWidth: 450,
                    padding: '10 0 10 10',
                    defaults: {
                        anchor: '100%',
                        style: {
                            backgroundColor: '#f0f0f0'
                        }
                    },
                    layout: {
                        type: 'anchor'
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: 'fieldset',
                            itemId: 'common',
                            defaults: {
                                labelWidth: 150,
                                anchor: '100%'
                            },
                            title: i18n.get('Common'),
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    height: 22,
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    fieldLabel: i18n.get('Tariff ID'),
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'tar_id',
                                            value: 0,
                                            submitValue: true,
                                            width: 80,
                                            fieldLabel: ''
                                        },
                                        {
                                            xtype: 'checkboxfield',
                                            name: 'unavailable',
                                            inputValue: '1',
                                            boxLabel: i18n.get('Hide in assignment lists'),
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    height: 22,
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    fieldLabel: i18n.get('Tariff plan type'),
                                    items: [
                                        {
                                            xtype: 'combo',
                                            editable: false,
                                            itemId: 'tarTypeField',
                                            anchor: '100%',
                                            name: 'type',
                                            hiddenName: 'type',
                                            displayField: 'name',
                                            valueField: 'id',
                                            store: 'tariffs.TariffTypes',
                                            allowBlank: false,
                                            margins: '0 15 0 0',
                                            width: 240
                                        },
                                        {
                                            xtype: 'checkboxfield',
                                            fieldLabel: '',
                                            name: 'additional',
                                            inputValue: '1',
                                            boxLabel: i18n.get('Addit. tariff'),
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: i18n.get('Currency'),
                                    editable: false,
                                    name: 'cur_id',
                                    data: 'currency',
                                    hiddenName: 'cur_id',
                                    displayField: 'name',
                                    valueField: 'id',
                                    mode: 'local',
                                    triggerAction: 'all',
                                    store: 'users.searchtemplates.Currencies',
                                    listeners: {
                                        select: function(combo, record) {
                                            combo.setValue(record[0].get('id'));
                                        }
                                    },
                                    allowBlank: false,
                                    width: 396,
                                    anchor: ''
                                },
                                Ext.create('OSS.view.tariffs.form.servicecode.Fieldset', {
                                    labelWidth: 150
                                }),
                                {
                                    xtype: 'textareafield',
                                    name: 'descr',
                                    fieldLabel: i18n.get('Description'),
                                    anchor: '100%',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'link',
                                    fieldLabel: i18n.get('Description url'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'textareafield',
                                    fieldLabel: i18n.get('Detailed description'),
                                    name: 'descr_full',
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            itemId: 'debiting',
                            defaults: {
                                labelWidth: 170,
                                anchor: '100%'
                            },
                            title: i18n.get('Debiting settings'),
                            anchor: '100% -268',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    itemId: 'rent',
                                    title: i18n.get('Rent amount'),
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            width: 255,
                                            name: 'rent',
                                            fieldLabel: i18n.get('Basical'),
                                            anchor: 'null'
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            itemId: 'blocked',
                                            defaults: {
                                                anchor: '100%',
                                                height: 22
                                            },
                                            layout: {
                                                type: 'anchor'
                                            },
                                            fieldLabel: i18n.get('If blocked'),
                                            items: [
                                                {
                                                    xtype: 'fieldcontainer',
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'hbox'
                                                    },
                                                    fieldLabel: '',
                                                    items: [
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'block_rent',
                                                            width: 150
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: i18n.get('finance'),
                                                            flex: 1,
                                                            margins: '0 0 0 15'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldcontainer',
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'hbox'
                                                    },
                                                    fieldLabel: '',
                                                    items: [
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'adm_block_rent',
                                                            width: 150,
                                                            fieldLabel: ''
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: i18n.get('administrative'),
                                                            flex: 1,
                                                            margins: '0 0 0 15'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldcontainer',
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'hbox'
                                                    },
                                                    fieldLabel: '',
                                                    items: [
                                                        {
                                                            xtype: 'numberfield',
                                                            width: 150,
                                                            name: 'usr_block_rent',
                                                            fieldLabel: ''
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: i18n.get('user'),
                                                            flex: 1,
                                                            margins: '0 0 0 15'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    defaults: {
                                        minWidth: 200,
                                        width: 420,
                                        labelWidth: 160
                                    },
                                    title: i18n.get('Write-off method'),
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: i18n.get('Of rent'),
                                            editable: false,
                                            name: 'daily_rent',
                                            hiddenName: 'daily_rent',
                                            displayField: 'name',
                                            valueField: 'id',
                                            store: 'tariffs.TariffDailyRent'
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: i18n.get('Prepaid service'),
                                            editable: false,
                                            name: 'dynamic_rent',
                                            hiddenName: 'dynamic_rent',
                                            displayField: 'name',
                                            valueField: 'id',
                                            store: 'tariffs.TariffDynamicRent',
                                            allowBlank: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    itemId: 'stop',
                                    layout: {
                                        type: 'anchor'
                                    },
                                    fieldLabel: i18n.get('Stop write-off'),
                                    items: [
                                        {
                                            xtype: 'label',
                                            style: {
                                                color: '#a0a0a0'
                                            },
                                            text: i18n.get('If service blocked for a long time')
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 22,
                                            margin: '4 0 0 0',
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'block_rent_duration',
                                                    width: 100,
                                                    fieldLabel: ''
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('days-1'),
                                                    flex: 1,
                                                    margins: '0 0 0 15'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'anchor'
                                    },
                                    fieldLabel: i18n.get('Cost range'),
                                    items: [
                                        {
                                            xtype: 'label',
                                            style: {
                                                color: '#a0a0a0'
                                            },
                                            text: i18n.get('Coefficients relative to base tariff cost')
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 22,
                                            margin: '4 0 0 0',
                                            width: 400,
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'coef_low',
                                                    width: 100,
                                                    fieldLabel: ''
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: '-',
                                                    margins: '0 10 0 10'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'coef_high',
                                                    width: 100,
                                                    fieldLabel: ''
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    itemId: 'right',
                    minWidth: 400,
                    style: {
                        backgroundColor: '#f0f0f0'
                    },
                    width: 150,
                    title: i18n.get('More'),
                    margins: 10,
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: i18n.get('Service blocking'),
                            labelAlign: 'top',
                            anchor: '100%',
                            stateful: false,
                            editable: false,
                            name: 'act_block',
                            hiddenName: 'act_block',
                            displayField: 'name',
                            valueField: 'id',
                            store: 'tariffs.ActBlocks',
                            allowBlank: false
                        },
                        {
                            xtype: 'fieldset',
                            itemId: 'traffic',
                            defaults: {
                                anchor: '100%'
                            },
                            title: i18n.get('Traffic'),
                            items: [
                                {
                                    xtype: 'combobox',
                                    fieldLabel: i18n.get('Direction'),
                                    anchor: '100%',
                                    editable: false,
                                    name: 'traff_type',
                                    hiddenName: 'traff_type',
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: 'tariffs.TrafficTypes'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    itemId: 'limit',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    layout: {
                                        type: 'anchor'
                                    },
                                    fieldLabel: i18n.get('Limit'),
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            itemId: 'amount',
                                            height: 22,
                                            width: 400,
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'traff_limit',
                                                    minValue: 0,
                                                    fieldLabel: '',
                                                    flex: 1,
                                                    margins: '0 15 0 0'
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('(Mb)'),
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            itemId: 'per',
                                            height: 22,
                                            width: 400,
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'combobox',
                                                    itemId: 'monthOrDays',
                                                    editable: false,
                                                    displayField: 'name',
                                                    valueField: 'id',
                                                    value: 0,
                                                    fieldLabel: '',
                                                    store: Ext.create('Ext.data.Store', {
                                                        fields: [{
                                                            name: 'id',
                                                            type: 'int'
                                                        }, {
                                                            name: 'name',
                                                            type: 'string'
                                                        }],
                                                        data: [{
                                                            id: 0,
                                                            name: i18n.get('Month')
                                                        }, {
                                                            id: 1,
                                                            name: i18n.get('Days')
                                                        }]
                                                    }),
                                                    margins: '0 15 0 0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    disabled: true,
                                                    minValue: 0,
                                                    allowDecimals: false,
                                                    name: 'traff_limit_per',
                                                    fieldLabel: '',
                                                    flex: 1
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            itemId: 'passband',
                            title: i18n.get('Pass band'),
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'anchor'
                                    },
                                    fieldLabel: i18n.get('Limit'),
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            height: 22,
                                            width: 400,
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    name: 'shape',
                                                    fieldLabel: '',
                                                    flex: 1,
                                                    margins: '0 15 0 0'
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('(Kbit/sec)'),
                                                    flex: 1
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: i18n.get('Priority of changing speed'),
                                    displayField: 'name',
                                    valueField: 'id',
                                    name: 'shape_prior',
                                    editable: false,
                                    store: 'tariffs.Priority',
                                    labelAlign: 'top',
                                    anchor: '100%'
                                }
                            ]
                        } 
                    ]
                }
            ]
        }];
        this.callParent(arguments);
    }
});
