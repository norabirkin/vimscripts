Ext.define("OSS.view.managers.RoleGroups", {
    extend: 'Ext.Panel',
    alias: "widget.rolegroups",
    itemId: 'roleGroups',
    title: OSS.Localize.get("Assign user groups to role"),
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'back',
            itemId: 'backBtn'
        }, '-',{
            xtype: 'splitbutton',
            text: i18n.get('Actions'),
            itemId: 'actionsBtn',
            menu: {
                items: [{
                    text: i18n.get('Add selected'),
                    iconCls: 'x-ibtn-add',
                    disabled: true,
                    itemId: 'addSelectedGroupsBtn'
                }, {
                    text: i18n.get('Remove selected'),
                    iconCls: 'x-ibtn-delete',
                    disabled: true,
                    itemId: 'removeSelectedGroupsBtn'
                }, {
                    text: i18n.get('Rights for selected'),
                    disabled: true,
                    menu: {
                        items: [{
                            text: i18n.get('Read only'),
                            itemId: 'setRoBtn'
                        }, {
                            text: i18n.get('Read and write'),
                            itemId: 'setRwBtn'
                        }]
                    }
                }]
            }
        }]
    }],
    items: [{ 
        xtype: "gridpanel",
        flex: 1,
        itemId: 'assignedRoleGroups',
        title: OSS.Localize.get("Assigned groups"),
        store: "managers.AssignedRoleGroups",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [{
            dataIndex: 'user_group_id', 
            header: OSS.Localize.get("ID"),
            width: 50
        }, { 
            dataIndex: 'group_name', 
            header: OSS.Localize.get("Role"),
            flex: 1 
        }, { 
            dataIndex: 'group_descr', 
            header: OSS.Localize.get("Description"),
            flex: 1 
        }, {
            header: i18n.get('Rules'),
            width: 140,
            dataIndex: 'rights',
            editor: {
                xtype: 'combo',
                itemId: 'rightsSelector',
                store: [ [0, i18n.get('Read only')], [1, i18n.get('Read and write')]]
            },
            renderer: function(value) {
                if(value == 0) {
                    return i18n.get('Read only');
                } else {
                    return i18n.get('Read and write');
                }
                return i18n.get('Read only');
            }
        }],
        plugins: [
            Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToEdit: 2
            })
        ],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "managers.AssignedRoleGroups",
            dock: 'bottom'
        }]
    }, { 
        xtype: "gridpanel",
        flex: 1,
        itemId: 'freeRoleGroups',
        title: OSS.Localize.get("Not assigned groups"),
        store: "managers.NotAssignedRoleGroups",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [{
            dataIndex: 'user_group_id', 
            header: OSS.Localize.get("ID"),
            width: 50
        }, { 
            dataIndex: 'group_name', 
            header: OSS.Localize.get("Name"),
            flex: 1 
        }, { 
            dataIndex: 'group_descr', 
            header: OSS.Localize.get("Description"),
            flex: 1 
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "managers.NotAssignedRoleGroups",
            dock: 'bottom'
        }]
    }]
});
