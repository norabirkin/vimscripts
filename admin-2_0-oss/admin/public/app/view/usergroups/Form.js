Ext.define('OSS.view.usergroups.Form', {
    extend: 'Ext.tab.Panel',
    //title: OSS.Localize.get('User group'),
    plain: true,
    alias: 'widget.usergroups_form',
    initComponent: function() {
            var me = this;

            Ext.applyIf(me, {
                itemId: 'mainPanel',
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            xtype: 'back',
                            form: Ext.app.Application.instance.getController('UserGroups').getTopForm
                        }, {
                            xtype: 'tbseparator'
                        }, {
                            xtype: 'button',
                            text: OSS.Localize.get( 'Operations' ),
                            itemId: 'actions',
                            menu:[{
                                iconCls: 'x-ibtn-save',
                                itemId: 'saveUserGroupBtn',
                                text: OSS.Localize.get('Save')
                            }]
                        }]
                    }
                ],
                items: [{
                        xtype: 'panel',
                        itemId: 'properties',
                        title: OSS.Localize.get('Properties'),
                        items: [{
                            xtype: 'form',
                            style: 'padding: 15px;',
                            border: false,
                            itemId: 'topForm',
                            layout: 'vbox',
                            fieldDefaults: {
                                labelAlign: 'left',
                                labelWidth: 180
                            },
                            items: [{
                                xtype: 'hidden',
                                name: 'groupid',
                                value: 0
                            }, {
                                xtype: 'fieldset',
                                width: '100%',
                                layout: 'form',
                                defaultBackground: true,
                                title: OSS.Localize.get('Common settings'), 
                                items: [{
                                    xtype: 'textfield',
                                    labelWidth: 130,
                                    name: 'name',
                                    fieldLabel: OSS.Localize.get('Group name')
                                }, {
                                    xtype: 'textfield',
                                    labelWidth: 130,
                                    name: 'description',                            
                                    fieldLabel: OSS.Localize.get('Description')
                                }]
                            }, {
                                xtype: 'checkbox',
                                name: 'promiseallow',
                                boxLabel: i18n.get('Turn on promised payments')
                            }, {
                                xtype: 'fieldset',
                                itemId: 'promisedPayment',
                                disabled: true,
                                layout: 'hbox',
                                width: '100%',
                                defaultBackground: true,
                                items: [{                           
                                    xtype: 'container',
                                    width: '47%',
                                    layout: 'form',
                                    defaults: {
                                        minValue: 0
                                    },
                                    items: [{
                                        xtype: 'numberfield',
                                        name: 'promisemax',
                                        fieldLabel: OSS.Localize.get('Max. payment value')
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'promisemin',
                                        fieldLabel: OSS.Localize.get('Min. payment value')
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'promiseondays',
                                        fieldLabel: OSS.Localize.get('Lifetime of agreement, at least') + ' (' + OSS.Localize.get('days')  + ')'
                                    }]
                                }, {
                                    xtype: 'container',
                                    width: '47%',
                                    layout: 'form',
                                    style: 'margin-left: 50px;',
                                    items: [
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        items: [{
                                            xtype: 'numberfield',
                                            width: '70%',
                                            name: 'promiselimit',
                                            minValue: 0,
                                            fieldLabel: OSS.Localize.get('Allowable debt')
                                        }, {
                                            xtype: 'tbspacer',
                                            width: 20
                                        }, {
                                            xtype: 'checkbox',
                                            name: 'promiserent',                                            
                                            checked: false,
                                            boxLabel: OSS.Localize.get('Not more than subscriber fee')
                                        }]
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'promisetill',
                                        minValue: 0,
                                        allowDecimals: false,
                                        fieldLabel: OSS.Localize.get('Pay off the debt within') + ' (' + OSS.Localize.get('days')  + ')'
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'promiseblockdays',
                                        minValue: 0,
                                        allowDecimals: false,
                                        fieldLabel: OSS.Localize.get('Block if payment is overdue') + ' (' + OSS.Localize.get('days')  + ')'
                                    }]
                                }]
                            }]
                        }]
                    }, {
                    xtype: 'panel',
                    layout: 'border',
                    title: OSS.Localize.get('The group'),
                    disabled: true,
                    border: false,
                    itemId: 'grids',
                    items: [{
                        title:  OSS.Localize.get('Assigned'),
                        xtype: 'grid',
                        border: false,
                        region: 'west',
                        width: '50%',
                        itemId: 'assignedGrid',
                        selModel: {
                            mode: 'MULTI'
                        },
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'top', 
                            items: [{
                                xtype: 'button',
                                text: OSS.Localize.get('Operations'),
                                itemId: 'actions',
                                menu:[{
                                    iconCls: 'x-ibtn-delete',
                                    itemId: 'deleteCurrent',
                                    text: i18n.get('Delete current page')
                                },{
                                    iconCls: 'x-ibtn-delete',
                                    itemId: 'deleteAll',
                                    text: i18n.get('Delete all')
                                }]
                            }, {
                                xtype: 'tbseparator' 
                            }, OSS.Localize.get("Search") + ': ', {
                                xtype: 'combobox',
                                itemId: 'search_field_cmb',
                                name: 'search_field',
                                valueField: 'name',
                                displayField: 'descr',
                                value: 'name',
                                width: 170,
                                store: Ext.create( "Ext.data.Store", {
                                    fields: [ 'descr', 'name' ],
                                    data: [
                                        { name: 'name', descr: OSS.Localize.get('Person full name') },
                                        { name: 'agrm_num', descr: OSS.Localize.get('Agreement') },
                                        { name: 'pay_code', descr: OSS.Localize.get('Payment code') },
                                        { name: 'login', descr: OSS.Localize.get('User login') },
                                        { name: 'vg_login', descr: OSS.Localize.get('Account login') },
                                        { name: 'email', descr: OSS.Localize.get('E-mail') },
                                        { name: 'phone', descr: OSS.Localize.get('Phone') },
                                        { name: 'address', descr: OSS.Localize.get('Address') },
                                        { name: 'address_code', descr: OSS.Localize.get('Similar addresses') }
                                    ]
                                })
                            },
                            {
                                xtype: 'searchtext',
                                name: 'search_field_value',
                                itemId: 'fullsearch_txt',
                                width: 150,
                                parentContainerType: 'toolbar',
                                searchButton: 'searchbtn'
                            },  
                            {
                                xtype: 'button',
                                itemId: 'searchbtn',
                                iconCls: 'x-ibtn-search',
                                style: 'margin-left: 4px',
                                text: OSS.Localize.get('Find')
                            }]
                        }, {
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            store: 'usergroups.UsersAssigned'
                        }],
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'list',
                                dropGroup: 'order'
                            }
                        },
                        store: 'usergroups.UsersAssigned',
                        columns: [
                            { header: OSS.Localize.get('ID'), dataIndex: 'uid', width: 50 },
                            { header: OSS.Localize.get('Name'), dataIndex: 'name', flex: 1 }
                        ]
                    }, {
                        title:  OSS.Localize.get('Available to assign'),
                        xtype: 'grid',
                        border: false,
                        region: 'east',
                        width: '50%',
                        itemId: 'availableGrid',
                        split: true,
                        splitterResize: false,
                        selModel: {
                            mode: 'MULTI'
                        },
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'order',
                                dropGroup: 'list'
                            }
                        },
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'top', 
                            items: [{
                                xtype: 'button',
                                text: OSS.Localize.get( 'Operations' ),
                                itemId: 'actions',
                                menu:[{
                                    iconCls: 'x-ibtn-add',
                                    itemId: 'add',
                                    text: OSS.Localize.get('Add current page')
                                }]
                            }, { 
                                xtype: 'tbseparator' 
                            }, OSS.Localize.get("Search") + ': ', {
                                xtype: 'combobox',
                                itemId: 'search_field_cmb',
                                name: 'search_field',
                                valueField: 'name',
                                displayField: 'descr',
                                value: 'name',
                                width: 170,
                                store: Ext.create( "Ext.data.Store", {
                                    fields: [ 'descr', 'name' ],
                                    data: [
                                        { name: 'name', descr: OSS.Localize.get('Person full name') },
                                        { name: 'agrm_num', descr: OSS.Localize.get('Agreement') },
                                        { name: 'pay_code', descr: OSS.Localize.get('Payment code') },
                                        { name: 'login', descr: OSS.Localize.get('User login') },
                                        { name: 'vg_login', descr: OSS.Localize.get('Account login') },
                                        { name: 'email', descr: OSS.Localize.get('E-mail') },
                                        { name: 'phone', descr: OSS.Localize.get('Phone') },
                                        { name: 'address', descr: OSS.Localize.get('Address') },
                                        { name: 'address_code', descr: OSS.Localize.get('Similar addresses') }
                                    ]
                                })
                            }, {
                                xtype: 'searchtext',
                                name: 'search_field_value',
                                itemId: 'fullsearch_txt',
                                width: 150,
                                parentContainerType: 'toolbar',
                                searchButton: 'searchbtn'
                            }, {
                                xtype: 'button',
                                itemId: 'searchbtn',
                                iconCls: 'x-ibtn-search',
                                style: 'margin-left: 4px',
                                text: OSS.Localize.get('Find')
                            }]
                        }, {
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            store: 'usergroups.UsersAvailable'
                        }],
                        store: 'usergroups.UsersAvailable',
                        columns: [
                            { header: OSS.Localize.get('ID'), dataIndex: 'uid', width: 50 },
                            { header: OSS.Localize.get('Name'), dataIndex: 'name', flex: 1 }
                        ]
                    }]
                }]
            });

            me.callParent(arguments);
        }
});
