Ext.define('OSS.view.usergroups.List', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.usergroups_list',
    store: 'UserGroupsList',
    border: false,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            layout: 'fit',
            dockedItems: [Ext.create('OSS.ux.toolbar.Toolbar', {
                actions: ['add', {
                    itemId:'remove', 
                    disabled: true,
                    text: i18n.get('Delete'), 
                    iconCls: 'x-ibtn-def x-ibtn-delete'
                }]
            })],
            items: [
                {
                    xtype: 'gridpanel',
                    store: 'UserGroupsList',
                    autoHeight: true,
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        dock: 'bottom',
                        store: 'UserGroupsList',
                        displayInfo: true
                    }],
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            itemId: 'editColumn',
                            width: 30,
                            iconCls: 'x-ibtn-def x-ibtn-edit'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 50,
                            dataIndex: 'groupid',
                            text: 'ID'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 130,
                            dataIndex: 'usercnt',
                            text: OSS.Localize.get('Amount of users')
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 250,
                            dataIndex: 'name',
                            text: OSS.Localize.get('Name')
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'description',
                            flex: 1,
                            text: OSS.Localize.get('Description')
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
