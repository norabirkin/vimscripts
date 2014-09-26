/**
 * Фильтр раздела "Действия/Сгенерировать/Печатные формы"
 */
Ext.define('OSS.view.printforms.Filter', {
    extend: 'OSS.view.Filter',
    minWidth: 400,
    width: '40%',
    actions: {
        itemId: 'startGenerationBtn',
        text: i18n.get('Start generation'),
        iconCls: 'x-ibtn-add'
    },
    items: [{
        xtype: 'fieldset',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth: 120
        },
        items: [{
            xtype: 'templateslist',
            store: 'documenttemplates.PrintFormsDocuments'
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
            xtype: 'textfield',
            fieldLabel: i18n.get('Initial number'),
            name: 'startnum'
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: i18n.get('Date of issue'),
            layout: 'hbox',
            items: [{
                xtype: 'datefield',
                format: 'Y-m-d',
                allowBlank: false,
                editable: false,
                name: 'date',
                flex: 1
            }, {
                xtype: 'tbspacer',
                width: 7
            }, {
                xtype: 'tbtext',
                text: i18n.get('Period')
            }, {
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
            xtype: 'textareafield',
            name: 'comment',
            fieldLabel: i18n.get('Comment'),
            height: 80
        }]
    }, {
        xtype: 'fieldset',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth: 120
        },
        items: [{
            xtype: 'advancedsearch',
            width: '100%'
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: i18n.get('Create documents'),
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'combo',
                editable: false,
                name: 'userType',
                itemId: 'userTypeCmb',
                flex: 1,
                value: 0,
                store: [ [0, i18n.get('For all')], [1, i18n.get('User group')], [2, i18n.get('User')] ]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                anchor: '100%',
                hidden: true,
                itemId: 'userGroupsCnt',
                items: [{
                    xtype: 'label',
                    text: i18n.get('User group') + ':'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    name: 'include_group',
                    padding: '0 5 0 0',
                    editable: false,
                    flex: 1,
                    value: 1,
                    store:  [[1, i18n.get('Include') ], [2, i18n.get('Exclude')]]
                }, {
                    xtype: 'combo',
                    editable: false,
                    name: 'group_id',
                    displayField: 'name',
                    valueField: 'groupid',
                    flex: 1,
                    store: 'OSS.store.users.Groups'
                }]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                hidden: true,
                anchor: '100%',
                itemId: 'userIdCnt',
                items: [{
                    xtype: 'label',
                    width: 100,
                    text: i18n.get('User') + ':'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                },{
                    xtype: 'userquicksearch',
                    flex: 1,
                    itemId: 'userCG', // CG is ComboGrid
                    name: 'uid',
                    resizable: false
                }]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                hidden: true,
                anchor: '100%',
                items: [{
                    xtype: 'label',
                    width: 100,
                    text: i18n.get('Agreement') + ':'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                },{
                    xtype: 'agrmquicksearch',
                    flex: 1,
                    emptyText: i18n.get('All'),
                    itemId: 'agrmCG', // CG is ComboGrid
                    name: 'agrm_id',
                    resizable: false
                }]
            }]
        }, {
            xtype: 'combo',
            fieldLabel: i18n.get('Operator'),
            editable: false,
            name: 'oper_id',
            valueField: 'uid',
            displayField: 'name',
            triggerAction: 'all',
            store: 'OSS.store.OperatorsList'
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: i18n.get('Grouping'),
            layout: 'anchor',
            items: [{
                xtype: 'combo',
                anchor: '100%',
                itemId: 'grouppingCmb',
                editable: false,
                value: 2,        
                store: [[1, i18n.get('Group by index') ], [2, i18n.get('Group by quantity')]]
            }, {
                xtype: 'numberfield',
                fieldLabel: i18n.get('Quantity'),
                labelWidth: 80,
                width: 180,
                name: 'groupcnt',
                minValue: 0,
                value: 0
            }]
        }]
    }]
});
