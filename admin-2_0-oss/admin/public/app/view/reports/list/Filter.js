/**
 * Фильтр отчетов
 */
Ext.define('OSS.view.reports.list.Filter', {
    extend: 'OSS.view.Filter',
    minWidth: 435,
    actions: {
        itemId:'add',
        text: i18n.get('Create report'),
        iconCls: 'x-ibtn-add'
    },
    initComponent: function() {
        var labelWidth = 140,
            width = 500;
        this.items = [{
            xtype: 'fieldset',
            layout: 'anchor',
            itemId: 'val',
            items: [Ext.create('OSS.view.reports.list.Grid', {
                labelWidth: labelWidth,
                width: width,
                anchor: '100%'
            }), {
                xtype: 'container',
                anchor: '100%',
                itemId: 'date',
                layout: 'card',
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    document_period: 1,
                    items: [{
                        fieldLabel: i18n.get('Since'),
                        labelWidth: labelWidth,
                        name: 'since',
                        width: 238,
                        padding: '0 5 0 0',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        allowBlank: false
                    }, {
                        xtype: 'datefield',
                        labelWidth: 20,
                        name: 'to',
                        fieldLabel: i18n.get('To'),
                        width: 115,
                        format: 'Y-m-d'
                    }]
                }, {
                    xtype: 'datefield',
                    labelWidth: labelWidth,
                    width: 238,
                    format: 'Y-m-d',
                    document_period: 2,
                    name: 'date',
                    fieldLabel: i18n.get('Date')
                }, {
                    xtype: 'monthfield',
                    document_period: 0,
                    fieldLabel: i18n.get('Period'),
                    name: 'period',
                    labelWidth: labelWidth
                }]
            }]
        }, {
            xtype: 'fieldset',
            layout: 'anchor',
            itemId: 'filter',
            items: [{
                xtype: 'fieldcontainer',
                anchor: '100%',
                width: width,
                fieldLabel: i18n.get('User group'),
                labelWidth: labelWidth,
                layout: 'hbox',
                items: [{
                    xtype: 'combo',
                    width: 90,
                    name:'include_group',
                    padding: '0 5 0 0',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        data: [{
                            id: 1,
                            name: i18n.get('Include')
                        }, {
                            id: 2,
                            name: i18n.get('Exclude')
                        }],
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }]
                    }),
                    valueField: 'id',
                    displayField: 'name'
                }, {
                    xtype: 'combo',
                    flex: 1,
                    name:'group_id',
                    displayField: 'name',
                    valueField: 'groupid',
                    store: Ext.create('OSS.store.users.Groups')
                }]
            }, Ext.create('OSS.view.reports.filter.AdvancedSearch', {
                labelWidth: labelWidth,
                width: width,
                anchor: '100%'
            })]
        }, {
            xtype: 'fieldset',
            itemId: 'additional',
            layout: 'anchor',
            hidden: true,
            items: [{
                xtype: 'combo',
                anchor: '100%',
                fieldLabel: i18n.get('Class of payment'),
                labelWidth: labelWidth,
                width: width,
                displayField: 'classname',
                valueField: 'classid',
                name: 'category',
                value: -1,
                editable: false,
                defaultOption: {
                    classid: -1,
                    classname: i18n.get('All')
                },
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'classid',
                        type: 'int'
                    }, {
                        name: 'classname',
                        type: 'string'
                    }, {
                        name: 'descr',
                        type: 'string'
                    }],
                    data: []
                })
            }, {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: labelWidth,
                width: width,
                fieldLabel: i18n.get('Pay document number'),
                name: 'receipt'
            }, {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: labelWidth,
                width: width,
                fieldLabel: i18n.get('Payment type'),
                name: 'code'
            }]
        }];
        this.callParent(arguments);
    }
});
