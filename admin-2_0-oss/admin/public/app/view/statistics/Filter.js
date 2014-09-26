/**
 * Фильтр раздела "Отчеты/Статистика"
 */
Ext.define('OSS.view.statistics.Filter', {
    extend: 'OSS.view.Filter',
    minWidth: 243,
    actions: [{
        itemId: 'find',
        disabled: true,
        iconCls: 'x-ibtn-search',
        text: i18n.get('Find')
    }, {
        text: i18n.get('Active sessions'),
        licid: 'full',
        disabled: true,
        itemId: 'sessions'
    }, {
        text: i18n.get('Export'),
        iconCls: 'x-ibtn-def x-ibtn-list',
        itemId: 'download',
        menu: [{
            text: i18n.get('Current page'),
            itemId: 'current'
        }, {
            text: i18n.get('All'),
            itemId: 'all'
        }]
    }],
    initComponent: function() {
        var s = OSS.helpers.Statistics,

            controller =
            Ext.app.
                Application.
                instance.
                getController('Statistics'),

            p =
            Ext.app.
                Application.
                instance.
                getController('statistics.Period');

        this.items = [{
            xtype: 'fieldset',
            itemId: 'basic',
            title: i18n.get('Basic'),
            defaults: {
                anchor: '100%'
            },
            items: [Ext.create('OSS.ux.form.field.date.WithTime', {
                fieldLabel: i18n.get('Since'),
                labelWidth: 35,
                name: 'date_from'
            }), Ext.create('OSS.ux.form.field.date.WithTime', {
                fieldLabel: i18n.get('Till'),
                labelWidth: 35,
                name: 'date_to'
            }), {
                xtype: 'checkbox',
                boxLabel: i18n.get('Hold the zero boundary period'),
                itemId: 'hold',
                checked: true
            }, {
                xtype: 'container',
                itemId: 'wrap',
                layout: 'hbox',
                padding: '0 0 5 0',
                items: [{
                    xtype: 'button',
                    itemId: 'backward',
                    iconCls: 'x-ibtn-prev'
                }, {
                    xtype: 'tbspacer',
                    width: 6
                }, {
                    xtype: 'combo',
                    itemId: 'period',
                    displayField: 'name',
                    valueField: 'id',
                    width: 116,
                    value: p.DAY,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }],
                        data: [{
                            name: i18n.get('Month'),
                            id: p.MONTH
                        }, {
                            name: i18n.get('Week'),
                            id: p.WEEK
                        }, {
                            name: i18n.get('Day'),
                            id: p.DAY
                        }, {
                            name: i18n.get('Hour'),
                            id: p.HOUR
                        }]
                    })
                }, {
                    xtype: 'tbspacer',
                    width: 6
                }, {
                    xtype: 'button',
                    iconCls: 'x-ibtn-calendar',
                    itemId: 'today'
                }, {
                    xtype: 'tbspacer',
                    width: 6
                }, {
                    xtype: 'button',
                    itemId: 'forward',
                    iconCls: 'x-ibtn-next'
                }]
            }, {
                xtype: 'combo',
                name: 'repnum',
                fieldLabel: i18n.get('Service type'),
                labelAlign: 'top',
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }],
                    data: [{
                        id: s.REPNUM_INTERNET,
                        name: i18n.get('Internet')
                    }, {
                        id: s.REPNUM_DIALUP,
                        name: i18n.get('Dial-up')
                    }, {
                        id: s.REPNUM_TELEPHONY,
                        name: i18n.get('Telephony')
                    }, {
                        id: s.REPNUM_SERVICES,
                        name: i18n.get('Services')
                    }]
                })
            }, {
                xtype: 'combo',
                fieldLabel: i18n.get('t-Group'),
                editable: false,
                name: 'repdetail',
                labelAlign: 'top',
                labelWidth: 50,
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                store: Ext.create( 'Ext.data.Store', {
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }, {
                        name: 'grid',
                        type: 'string'
                    }],
                    data: []
                })
            }]
        }, {
            xtype: 'fieldset',
            itemId: 'filter',
            title: i18n.get('Filter'),
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'combo',
                editable: false,
                fieldLabel: i18n.get('Agent'),
                labelAlign: 'top',
                store: Ext.create('OSS.store.statistics.Agents', {
                    filters: [Ext.bind(
                        controller.isProperAgent,
                        controller
                    )]
                }),
                name: 'agentid',
                displayField: 'name',
                valueField: 'id'
            }, {
                xtype: 'combobox',
                editable: false,
                labelAlign: 'top',
                fieldLabel: i18n.get('User group'),
                name: 'ugroups',
                valueField: 'groupid',
                displayField: 'name',
                store: 'users.Groups',
                padding: '0 0 5 0'
            }, {
               xtype: 'combo',
               editable: false,
               itemId: 'property',
               displayField: 'descr',
               valueField: 'name',
               value: 'name',
               queryMode: 'local',
               padding: '0 0 5 0',
               store: Ext.create( 'Ext.data.Store', {
                   licid: 'statisticsSearch',
                   fields: [{
                       name: 'name',
                       type: 'string'
                   }, {
                       name: 'descr',
                       type: 'string'
                   }, {
                       name: 'formfield',
                       type: 'string'
                   }],
                   data: [{
                        name: 'name',
                        descr: i18n.get('User'),
                        formfield: 'username'
                    }, {
                        name: 'agrmnum',
                        descr: i18n.get('Agreement'),
                        formfield: 'agreements'
                    }, {
                        name: 'vglogin',
                        descr: i18n.get('Account login'),
                        formfield: 'vgroup'
                    }, {
                        name: 'ip',
                        descr: ('IP ' + i18n.get('address')),
                        formfield: 'default'
                    }, {
                        name: 'ani',
                        descr: (i18n.get('Session') + ' (ANI)'),
                        formfield: 'default'
                    }]
               })
            }, {
                xtype: 'container',
                itemId: 'value',
                layout: 'card',
                defaults: {
                    hideTrigger: true
                },
                items: [{
                    xtype: 'combo',
                    itemId: 'username',
                    displayField: 'name',
                    valueField: 'name',
                    store: 'Users'
                }, {
                    xtype: 'combo',
                    itemId: 'agreements',
                    displayField: 'agrm_num',
                    valueField: 'agrm_num',
                    store: 'statistics.Agreements'
                }, {
                    xtype: 'combo',
                    itemId: 'vgroup',
                    displayField: 'login',
                    valueField: 'login',
                    store: 'statistics.Vgroups'
                }, {
                    xtype: 'textfield',
                    itemId: 'default'
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: i18n.get('Telephony'),
            hidden: true,
            itemId: 'phone',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                name: 'numto',
                labelAlign: 'top',
                fieldLabel: i18n.get('Direction mask')
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.get('Source mask'),
                name: 'numfrom',
                labelAlign: 'top'
            }, {
                xtype: 'checkbox',
                boxLabel: i18n.get('Incoming-e'),
                name: 'cin'
            }, {
                xtype: 'checkbox',
                boxLabel: i18n.get('Outgoing-e'),
                name: 'cout'
            }, {
                xtype: 'numberfield',
                fieldLabel: i18n.get('Cost'),
                name: 'amountfrom',
                labelAlign: 'top',
                minValue: 0
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                fieldLabel: (
                    i18n.get('Duration')+' '+
                    '('+
                        i18n.get('sec-s')+
                    ')'
                ),
                defaults: {
                    minValue: 0
                },
                labelAlign: 'top',
                items: [{
                    xtype: 'numberfield',
                    width: 0,
                    flex: 1,
                    name: 'durfrom'
                }, {
                    xtype: 'displayfield',
                    value: ' - ',
                    padding: '0 5 0 5'
                }, {
                    xtype: 'numberfield',
                    width: 0,
                    flex: 1,
                    name: 'durto'
                }]
            }, {
                xtype: 'checkbox',
                boxLabel: i18n.get('Post-loaded traffic'),
                name: 'additional'
            }]
        }];
        this.callParent(arguments);
    }
});
