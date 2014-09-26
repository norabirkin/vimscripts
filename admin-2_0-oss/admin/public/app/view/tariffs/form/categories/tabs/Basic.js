/**
 * Вкладка "Основные" панели вкладок формы категории тарифов
 */
Ext.define('OSS.view.tariffs.form.categories.tabs.Basic', {
    extend: 'Ext.form.Panel',
    itemId: 'categoryDataTab',
    height: 653,
    width: 979,
    bodyPadding: 10,
    title: i18n.get('Basic'),
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            defaults: {
                style: {
                    backgroundColor: '#f0f0f0'
                }
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'cat_idx',
                    value: 0
                },
                {
                    xtype: 'hidden',
                    name: 'tar_id',
                    value: 0
                },
                {
                    xtype: 'hidden',
                    name: 'usbox_count',
                    value: 0
                },
                {
                    xtype: 'fieldset',
                    itemId: 'common',
                    defaults: {
                        labelWidth: 140,
                        anchor: '100%'
                    },
                    title: i18n.get('Common'),
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: i18n.get('Tarification type'),
                        name: 'tar_type',
                        store: 'tariffs.TariffTypes',
                        displayField: 'name',
                        valueField: 'id'
                    }, {
                        xtype: 'container',
                        itemId: 'descAndCode',
                        height: 22,
                        margin: '0 0 5 0',
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: i18n.get('Description'),
                            name: 'descr',
                            margin: '0 5 0 0',
                            minWidth: 240,
                            labelWidth: 140,
                            flex: 1
                        }, Ext.create('OSS.view.tariffs.form.servicecode.Fieldset', {
                            labelWidth: 80
                        })]
                    }, {
                        xtype: 'container',
                        itemId: 'linkAndUuid',
                        margin: '0 0 5 0',
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'textfield',
                            labelWidth: 140,
                            name: 'link',
                            fieldLabel: i18n.get('Description url'),
                            flex: 1
                        }, {
                            xtype: 'fieldcontainer',
                            itemId: 'uuid',
                            margin: '0 0 0 5',
                            tartypes: [1,2,5],
                            width: 717,
                            defaults: {
                                margin: 0
                            },
                            layout: {
                                type: 'hbox'
                            },
                            fieldLabel: '',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.get('ID of external service'),
                                    tartypes: [1,2,5],
                                    name: 'uuid',
                                    licid: 'full',
                                    labelWidth: 120,
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 5',
                                    width: 40,
                                    hidden: true,
                                    text: 'CAS',
                                    margins: 0
                                }
                            ]
                        }]
                    }, {
                        xtype: 'textareafield',
                        name: 'descr_full',
                        resizable: true,
                        resizeHandles: 's',
                        fieldLabel: i18n.get('Full description'),
                        anchor: '100%'
                    }, Ext.create('OSS.view.tariffs.form.categories.Catalogs', {
                        fieldLabel: i18n.get('Catalog'),
                        tartypes: [0,1,2,3,4],
                        name: 'cat_id',
                        data: 'catalog',
                        labelWidth: 140,   
                        width: 300
                    })]
                },
                {
                    xtype: 'fieldset',
                    itemId: 'debiting',
                    defaults: {
                        flex: 1
                    },
                    layout: {
                        type: 'hbox'
                    },
                    title: i18n.get('Debiting settings'),
                    items: [
                        {
                            xtype: 'fieldset',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 130
                            },
                            title: i18n.get('Cost'),
                            flex: 1,
                            margins: '0 10 0 0',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [5],
                                    name: 'above',
                                    fieldLabel: i18n.get('Basical')
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    layout: {
                                        type: 'anchor'
                                    },
                                    fieldLabel: i18n.get('If blocked'),
                                    tartypes: [5],
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            width: 400,
                                            defaults: {
                                                margin: '0 5 0 0'
                                            },
                                            layout: {
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    tartypes: [5],
                                                    name: 'perm_above',
                                                    fieldLabel: ''
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('finance'),
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            width: 400,
                                            defaults: {
                                                margin: '0 5 0 0'
                                            },
                                            layout: {
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    tartypes: [5],
                                                    name: 'adm_block_above',
                                                    fieldLabel: ''
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('administrative'),
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            width: 400,
                                            defaults: {
                                                margin: '0 5 0 0'
                                            },
                                            layout: {
                                                type: 'hbox'
                                            },
                                            fieldLabel: '',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    tartypes: [5],
                                                    name: 'usr_block_above',
                                                    fieldLabel: ''
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: i18n.get('user'),
                                                    flex: 1
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [0,1,2,3,4],
                                    name: 'above',
                                    fieldLabel: i18n.get('Exceeding'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [3,4],
                                    name: 'perm_above',
                                    fieldLabel: i18n.get('Fact of call'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: i18n.get('Priority of discount'),
                                    tartypes: [0,1,2,3,4],
                                    name: 'dis_prior',
                                    editable: false,
                                    hiddenName: 'dis_prior',
                                    triggerAction: 'all',
                                    queryMode: 'local',
                                    value: 0,
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: 'tariffs.Priority',
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            itemId: 'method',
                            defaults: {
                                labelWidth: 120
                            },
                            title: i18n.get('Method'),
                            flex: 1,
                            items: [
                                {
                                    xtype: 'combo',
                                    tartypes: [5],
                                    editable: false,
                                    name: 'common',
                                    fieldLabel: i18n.get('Type'),
                                    anchor: '100%',
                                    hiddenName: 'charges_type',
                                    displayField: 'name',
                                    valueField: 'id',
                                    triggerAction: 'all',
                                    mode: 'local',
                                    value: 0,
                                    store: [
                                        [0, i18n.get('One time')],
                                        [1, i18n.get('Monthly')],
                                        [2, i18n.get('Daily')],
                                        [3, i18n.get('Daily') + ' ' + i18n.get('equal parts')]
                                    ]
                                },
                                Ext.create('OSS.view.tariffs.form.categories.Master', {
                                    labelWidth: 120
                                }),
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    margin: '5 0 5 0',
                                    tartypes: [0,1,2,3,4],
                                    name: 'includes',
                                    fieldLabel: i18n.get('Included (min)'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [3,4],
                                    name: 'free_seconds',
                                    fieldLabel: i18n.get('For free (sec)'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [3,4],
                                    name: 'round_seconds',
                                    fieldLabel: i18n.get('Round to (sec)'),
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    tartypes: [3,4],
                                    name: 'min_charge_dur',
                                    fieldLabel: i18n.get('Round start of call (sec)'),
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    defaults: {
                        anchor: '100%'
                    },
                    title: i18n.get('Control'),
                    itemId: 'control',
                    tartypes: [0,1,2,5],
                    items: [
                        {
                            xtype: 'checkboxfield',
                            tartypes: [0,1,2],
                            name: 'common',
                            inputValue: 1,
                            uncheckedValue: 0,
                            fieldLabel: '',
                            boxLabel: i18n.get('Include the traffic to the main group')
                        },
                        {
                            xtype: 'checkboxfield',
                            tartypes: [5],
                            inputValue: '1',
                            name: 'auto_assign',
                            fieldLabel: '',
                            boxLabel: i18n.get('Sign by default')
                        },
                        {
                            xtype: 'checkboxfield',
                            tartypes: [1,2,5],
                            inputValue: '1',
                            name: 'available',
                            fieldLabel: '',
                            boxLabel: i18n.get('Allow the user managing the service')
                        },
                        {
                            xtype: 'container',
                            itemId: 'wrap',
                            tartypes: [5],
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    defaults: {
                                        labelWidth: 120
                                    },
                                    title: i18n.get('External method'),
                                    flex: 1,
                                    margins: '0 10 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            tartypes: [5],
                                            name: 'script',
                                            licid: 'full',
                                            fieldLabel: i18n.get('On enable'),
                                            anchor: '100%'
                                        },
                                        {
                                            xtype: 'textfield',
                                            tartypes: [5],
                                            licid: 'full',
                                            name: 'script_off',
                                            fieldLabel: i18n.get('On disable'),
                                            anchor: '100%'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    itemId: 'tv',
                                    hidden: true,
                                    title: i18n.get('TV'),
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            inputValue: '1',
                                            licid: 'full',
                                            name: 'keep_turned_on',
                                            fieldLabel: i18n.get('Dont disable'),
                                            boxLabel: i18n.get('(HTV)'),
                                            anchor: '100%'
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: i18n.get('Category type'),
                                            name: 'dtv_type',
                                            editable: false,
                                            hiddenName: 'dtv_type',
                                            licid: 'full',
                                            displayField: 'name',
                                            valueField: 'id',
                                            triggerAction: 'all',
                                            queryMode: 'local',
                                            store: [
                                                [0, i18n.get('Not specified')], 
                                                [1, i18n.get('Channels Package')], 
                                                [2, i18n.get('Channel')], 
                                                [3, i18n.get('VAS')],
                                                [4, i18n.get('SVOD')],
                                                [5, i18n.get('VOD')]
                                            ],
                                            anchor: '100%'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);

        this.getForm().findFieldsForSetValues = Ext.bind(function() {
            var fields = this.getFields().filterBy(Ext.bind(
                this.conditionForSetValues,
                this
            ));
            if (fields.items.length > 0) {
                fields = fields.items;
            } else {
                fields = null;
            }
            return fields;
        }, this.getForm());
    }

});
