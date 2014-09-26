Ext.define('OSS.view.tariffs.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.tariffswin',
    title: i18n.get('Tariffs'),
    width: 750,
    resizable: false,
    modal: true,
    tbar: [{
        xtype: 'button',
        text: i18n.get('Apply'),
        itemId: 'apply'
    }, {
        xtype: 'button',
        hidden: true,
        itemId: 'multitar',
        text: i18n.get('Multitarif')
    }],
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            frame: true,
            padding: '10',
            items:[{
                xtype: 'hidden',
                name: 'recordid',
                value: 0
            }, {
                xtype: 'hidden',
                name: 'ismulti',
                value: 0
            }, {
                xtype: 'combo',
                name: 'operid',
                hidden: true,
                fieldLabel: i18n.get('Operator'),
                labelWidth: 95,
                valueField: 'id',
                displayField: 'descr',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            type: 'int',
                            name: 'id'
                        },
                        {
                            type: 'int',
                            name: 'descr'
                        }
                    ],
                    data: []
               })
            },
            Ext.create('OSS.view.tariffs.Combogrid', {
                labelWidth: 95,
                name: 'tariff'
            }),
            {
                xtype: 'container',
                hidden: true,
                layout: 'hbox',
                padding: '0 0 5 0',
                itemId: 'tariff',
                items: [{
                    xtype: 'text',
                    text: i18n.get('Tarif') + ':',
                    width: 100
                }, {
                    xtype: 'button',
                    itemId: 'choose',
                    text: 'OK'
                }, {
                    xtype: 'combo',
                    name: 'tarid',
                    valueField: 'tarid',
                    displayField: 'descr',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                type: 'int',
                                name: 'tarid'
                            },
                            {
                                type: 'int',
                                name: 'descr'
                            },
                            {
                                type: 'int',
                                name: 'rent'
                            },
                            {
                                type: 'int',
                                name: 'dailyrent'
                            },
                            {
                                type: 'int',
                                name: 'actblock'
                            },
                            {
                                type: 'int',
                                name: 'symbol'
                            }
                        ],
                        data: []
                    })
                }]
            }, Ext.create('OSS.ux.form.field.date.WithTime', {
                fieldLabel: i18n.get('Date') + ' (' + i18n.get('Since') + ')',
                labelWidth: 95,
                defaultDate: function() {
                    return Ext.Date.parse(Ext.Date.format(new Date, 'Y-m-d 00:00:00'), 'Y-m-d 00:00:00');
                },
                name: 'change_time'
            }),
            Ext.create('OSS.ux.form.field.date.WithTime', {
                fieldLabel: i18n.get('Date') + ' (' + i18n.get('Till') + ')',
                labelWidth: 95,
                name: 'time_to',
                defaultDate: function() {
                    return null;
                }
            }),
            /*{
                xtype: 'container',
                layout: 'hbox',
                padding: '0 0 5 0',
                items: [{
                    xtype: 'text',
                    text: i18n.get('Date') + ' (' + i18n.get('Since') + '):',
                    width: 100
                }, {
                    xtype: 'datefield',
                    name: 'tardate',
                    value: new Date(),
                    width: 90
                }, {
                    xtype: 'combo',
                    name: 'tartimehour',
                    valueField: 'id',
                    displayField: 'id',
                    value: 0,
                    store: Ext.create('Ext.data.Store', {
                        fields: [{
                            type: 'int',
                            name: 'id'
                        }]
                    }),
                    width: 70
                }, {
                    xtype: 'tbtext',
                    text: ':',
                    style: 'padding: 4 0 0 1',
                    width: 5
                }, {
                    xtype: 'combo',
                    name: 'tartimemin',
                    valueField: 'id',
                    displayField: 'id',
                    value: 0,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                type: 'int',
                                name: 'id'
                            }
                        ],
                        data: []
                    }),
                    width: 70
                }]
            }, {
                xtype: 'container',
                padding: '0 0 5 0',
                layout: 'hbox',
                items: [{
                    xtype: 'text',
                    text: i18n.get('Date') + ' (' + i18n.get('Till') + '):',
                    width: 100
                }, {
                    xtype: 'datefield',
                    name: 'datetill',
                    width: 90
                }, {
                    xtype: 'combo',
                    name: 'timehourtill',
                    valueField: 'id',
                    displayField: 'id',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                type: 'int',
                                name: 'id'
                            }
                        ]
                    }),
                    width: 70
                }, {
                    xtype: 'tbtext',
                    text: ':',
                    style: 'padding: 4 0 0 1',
                    width: 5
                }, {
                    xtype: 'combo',
                    name: 'timemintill',
                    valueField: 'id',
                    displayField: 'id',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                type: 'int',
                                name: 'id'
                            }
                        ],
                        data: []
                    }),
                    width: 70
                }]
            },*/ {
                xtype: 'numberfield',
                hidden: true,
                fieldLabel: i18n.get('Coefficient'),
                labelWidth: 95,
                name: 'tardisc',
                value: 1
            }]
        }, {
            xtype: 'container',
            layout: 'card',
            hidden: true,
            itemId: 'zone-disc',
            activeItem: 0,
            items: [{
                xtype: 'gridpanel',
                itemId: 'modifiers',
                height: 400,
                tbar: [{
                    xtype: 'button',
                    itemId: 'cat-sel',
                    text: i18n.get('Choose category')
                }],
                columns: [{
                    header: i18n.get('ID'),
                    dataIndex: 'catidx'
                }, {
                    header: i18n.get('Description'),
                    dataIndex: 'catdescr',
                    flex: 1
                }, {
                    header: i18n.get('Type'),
                    dataIndex: 'type'
                }, {
                    header: i18n.get('Value'),
                    dataIndex: 'value'
                }, {
                    header: i18n.get('Include') + ' (' + i18n.get('min') + ' / ' + i18n.get('Mb') + ')',
                    dataIndex: 'includes'
                }, {
                    itemId: 'remove',
                    xtype: 'actioncolumn',
                    header: '&nbsp',
                    width: 25,
                    tooltip: i18n.get('Remove'),
                    getClass: function() { 
                        return 'x-ibtn-def x-ibtn-delete'; 
                    }                       
                }],
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            type: 'int',
                            name: 'catidx'
                        },
                        {
                            type: 'int',
                            name: 'catdescr'
                        },
                        {
                            type: 'int',
                            name: 'type'
                        },
                        {
                            type: 'int',
                            name: 'value'
                        },
                        {
                            type: 'int',
                            name: 'includes'
                        }
                    ]
                })
            }, {
                xtype: 'gridpanel',
                height: 400,
                selType: 'checkboxmodel',
                tbar: [{
                    xtype: 'button',
                    text: i18n.get('Back to the list')
                }, {
                    xtype: 'tbseparator',
                    width: 5
                }, {
                    xtype: 'textfield',
                    name: 'search'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    text: i18n.get('Show')
                }],
                bbar: {
                    xtype: 'pagingtoolbar'
                },
                columns: [{
                    header: i18n.get('Category'),
                    dataIndex: 'catdescr',
                    flex: 1
                }],
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            type: 'int',
                            name: 'catidx'
                        },
                        {
                            type: 'string',
                            name: 'catdescr'
                        }
                    ],
                    data: []
                })
            }]
        }];
        this.callParent(arguments);
    }
});
