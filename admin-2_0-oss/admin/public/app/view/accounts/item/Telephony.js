Ext.define('OSS.view.accounts.item.Telephony', {
    extend: 'Ext.panel.Panel',

    itemId: 'telephony',
    title: i18n.get('Telephony'),

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            xtype: 'panel',
            itemId: 'leftTelPanel',
            
            title: '',
            layout: 'border',
            
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'back'
                }, '-', {
                    xtype: 'splitbutton',
                    itemId: 'actionsBtn',
                    text: i18n.get('Actions'),
                    menu: {
                        items: [{
                            text: i18n.get('Save'),
                            itemId: 'saveBtn',
                            iconCls: 'x-ibtn-save'
                        }, {
                            text: i18n.get('Create new entry'),
                            itemId: 'createBtn',
                            iconCls: 'x-ibtn-add'
                        }, {
                            text: i18n.get('Remove selected'),
                            itemId: 'removeBtn',
                            iconCls: 'x-ibtn-remove'
                        }]
                    }
                }]
            }],
            items: [{
                xtype: 'form',
                itemId: 'telephonyForm',
                layout: 'anchor',
                region: 'west',
                split: true,
                minWidth: 320,
                width: '30%',
                items: [{
                    xtype: 'fieldset',
                    margin: 3,
                    defaults: {
                        anchor: '100%',
                        labelWidth: 130
                    },
                    title: '',
                    items: [{
                        xtype: 'hidden',
                        name: 'record_id',
                        value: 0
                    },{
                        xtype: 'hidden',
                        name: 'vg_id',
                        value: 0
                    },{
                        xtype: 'checkboxfield',
                        fieldLabel:  i18n.get('Check duplicates while saving'),
                        name: 'check_duplicate',
                        itemId: 'check_duplicate',
                        inputValue: 1
                    }, {
                        xtype: 'textfield',
                        name: 'number',
                        fieldLabel: i18n.get('Sign'),
                        allowBlank: false
                    }, {
                        xtype: 'combo',
                        fieldLabel: i18n.get('Device'),
                        name: 'device',
                        editable: false,
                        allowBlank: false,
                        value: 0,
                        store: [ 
                            [0, i18n.get('Phone')],
                            [1, i18n.get('MTA')],
                            [2, i18n.get('Trunk')]
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: i18n.get('Since'),
                        layout: 'hbox',
                        items: [{
                            xtype: 'datefield',
                            flex: 1,
                            name: 'date_from'
                        },{
                            xtype: 'tbspacer',
                            width: 5
                        }, {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            maxValue: 23,
                            name: 'h_from',
                            width: 30
                        }, {
                            xtype: 'label',
                            text: ':'
                        },{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            maxValue: 59,
                            name: 'm_from',
                            width: 30
                        }, {
                            xtype: 'label',
                            text: ':'
                        },{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            name: 's_from',
                            maxValue: 59,
                            width: 30
                        }]
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: i18n.get('Till'),
                        layout: 'hbox',
                        items: [{
                            xtype: 'datefield',
                            flex: 1,
                            name: 'date_till'
                        },{
                            xtype: 'tbspacer',
                            width: 5
                        }, {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            maxValue: 23,
                            name: 'h_till',
                            width: 30
                        }, {
                            xtype: 'label',
                            text: ':'
                        },{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            maxValue: 59,
                            name: 'm_till',
                            width: 30
                        }, {
                            xtype: 'label',
                            text: ':'
                        },{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            maxValue: 59,
                            name: 's_till',
                            width: 30
                        }]
                    }, {
                        xtype: 'textarea',
                        flex: 1,
                        name: 'comment',
                        height: 60,
                        fieldLabel: i18n.get('Description')
                    }]
                }]
            },
            /*Second panel - grid [right side]*/
           {
               xtype: 'gridpanel',
               title: i18n.get('Phone numbers') +' / MTA / ' + i18n.get('Trunks'),
               itemId: 'telephonyGrid',
               region: 'center',
               dockedItems: [{
                   xtype: 'pagingtoolbar',
                   dock: 'bottom',
                   store: 'accounts.telephony.TrunksAndNums'
               }],
               store: 'accounts.telephony.TrunksAndNums',
               columns: [{
                   xtype: 'actioncolumn',
                   width: 25,
                   iconCls: 'x-ibtn-def x-ibtn-edit',
                   itemId: 'editTelEntry'
               },{
                   dataIndex: 'number',
                   flex: 1,
                   text: i18n.get('Number')
               }, {
                   dataIndex: 'device',
                   flex: 1,
                   text: i18n.get('Device'),
                   renderer: function(value) {
                       if(value == 1) {
                           return i18n.get('MTA');
                       } else if(value == 2) {
                           return i18n.get('Trunk');
                       } else {
                           return i18n.get('Phone');
                       }
                   }
               }, {
                   dataIndex: 'time_from',
                   text: i18n.get('Since'),
                   width: 130
               }, {
                   dataIndex: 'time_to',
                   text: i18n.get('Till'),
                   width: 130
               }, {
                   dataIndex: 'comment',
                   text: i18n.get('Description'),
                   flex: 1
               }, {
                   dataIndex: 'type',
                   flex: 1,
                   text: i18n.get('Type'),
                   renderer: function(value) {
                       if(value == 1) {
                           return i18n.get('Phone') + ' / ' + i18n.get('MTA');
                       } else if(value == 2) {
                           return i18n.get('Trunk');
                       }
                   }
               },],
               selType: 'rowmodel',
               selModel: Ext.create('Ext.selection.CheckboxModel', {
                   mode: 'MULTI'
               })
           }]
        });
        
        me.callParent(arguments);
    }
});
