/**
 * Фильтр раздела "Отчеты/Журнал авторизаций"
 */
Ext.define('OSS.view.authlog.Filter', {
    extend: 'Ext.form.Panel',
    itemId: 'filterPanel',
    region: 'west',
    margin: 0,
    padding: 0,
    frame: true,
    split: true, 
    collapsible: false,
    minWidth: 300,
    border: false,
    layout: 'fit',
    initComponent: function() {
        // field settings
        var labelWidth = 70,
            dateWidth = 110,
            today = new Date(),
            tomorrow = Ext.Date.add(new Date(), Ext.Date.DAY, 1);
        this.items = [{
            xtype: 'form',
            bodyPadding: 5,
            frame: true,
            border: false,
            items: [{
                xtype: 'fieldset',
                itemId: 'filterFSet',
                title: i18n.get('Filter'),
                defaults: {
                    labelWidth: labelWidth,
                    anchor: '100%'
                },
                items: [{
                    xtype: 'datefield',
                    width: dateWidth + labelWidth,
                    fieldLabel: i18n.get('Since'),
                    name: 'dtfrom',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: today
                }, {
                    xtype: 'datefield',
                    width: dateWidth + labelWidth,
                    fieldLabel: i18n.get('Till'),
                    format: 'Y-m-d',
                    allowBlank: false,
                    name: 'dtto',
                    value: tomorrow
                }, {
                    xtype: 'combo',
                    fieldLabel: i18n.get('Event'),
                    name: 'event',
                    hiddenName: 'event',
                    displayField: 'name',
                    valueField: 'type',
                    editable: false,
                    queryMode: 'local',
                    value: 0,
                    store: Ext.create( 'Ext.data.Store', {
                        fields: [
                            { name: 'type', type: 'string' },
                            { name: 'name', type: 'string' }
                        ],
                        data: [
                            { type: 'ALL', name: i18n.get('All') }, 
                            { type: 'ERR', name: i18n.get('All errors') },
                            { type: 'OK', name: i18n.get('All successful') },
                            { type: '11', name: i18n.get('User not found') },
                            { type: '12', name: i18n.get('Black list') },
                            { type: '13', name: i18n.get('Wrong port') },
                            { type: '14', name: i18n.get('Wrong password') },
                            { type: '15', name: i18n.get('Blocked') },
                            { type: '16', name: i18n.get('Already connected') },
                            { type: '17', name: i18n.get('No free IP address') }
                        ]
                    }),
                    listeners: {
                        afterrender: function(combo) {
                            combo.setValue('ALL');
                        }
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: i18n.get('Agent'),
                    name: 'agent',
                    hiddenName: 'agentid',
                    displayField: 'descr',
                    valueField: 'id',
                    editable: false,
                    store: 'Agents',
                    listeners: {
                        afterrender: function(combo) {
                            combo.getStore().reload();
                        }
                    }
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: i18n.get('Filter'),
                    labelWidth: labelWidth,
                    layout: {
                        type: 'vbox',
                        align : 'stretch'
                    },
                    items: [{
                        xtype: 'combo',
                        name: 'filter',
                        hiddenName: 'filter',
                        displayField: 'name',
                        valueField: 'id',
                        editable: false,
                        store: Ext.create( 'Ext.data.Store', {
                            fields: [
                                { name: 'id', type: 'string' },
                                { name: 'name', type: 'string' }
                            ],
                            data: [
                                { id: '0', name: i18n.get('Account login') },
                                { id: '1', name: i18n.get('User') },
                                { id: '2', name: i18n.get('Agreement') },
                                { id: '3', name: i18n.get('MAC address') },
                                { id: '4', name: i18n.get('Device name') }
                            ]
                        }),
                        listeners: {
                            afterrender: function(combo) {
                                combo.setValue('0');
                            }
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'textfield',
                        width: 180,
                        name: 'filtertext',
                        style: 'margin-top: -3px;'
                    }]
                }, {
                    xtype: 'button',
                    text: i18n.get('Show'),
                    anchor: null,
                    itemId: 'searchBtn',
                    width: 90,
                    iconCls: 'x-ibtn-search',
                    style: 'margin-left: 75px;'
                }]
            }]
        }];
        this.callParent(arguments);
    }
});
