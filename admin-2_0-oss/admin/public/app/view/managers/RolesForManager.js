Ext.define("OSS.view.managers.RolesForManager", {
    extend: 'Ext.Panel',
    alias: "widget.rolesformanager",
    itemId: 'rolesForManager',
    layout: {
        type: 'border'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'back'
        }, '-',{
            xtype: 'splitbutton',
            text: i18n.get('Actions'),
            itemId: 'rolesActionsBtn',
            menu: {
                items: [{
                    text: i18n.get('Add selected'),
                    iconCls: 'x-ibtn-add',
                    disabled: true,
                    itemId: 'addSelectedRolesBtn'
                }, {
                    text: i18n.get('Remove selected'),
                    iconCls: 'x-ibtn-delete',
                    disabled: true,
                    itemId: 'removeSelectedRolesBtn'
                }]
            }
        }]
    }],
    items: [{ 
        xtype: "gridpanel",
        flex: 1,
        region: 'west',
        split: true,
        itemId: 'AssignedRolesForManager',
        title: OSS.Localize.get("Assigned roles"),
        store: "managers.AssignedRolesForManager",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel', {
            mode: 'MULTI'
        }),
        columns: [{
            dataIndex: "role_name", 
            header: OSS.Localize.get("Name"),
            flex: 1
        },{ 
            dataIndex: "descr", 
            header: OSS.Localize.get("Description"),
            flex: 1 
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "managers.AssignedRolesForManager",
            dock: 'bottom'
        }]
    },
    { 
        xtype: "gridpanel",
        flex: 1,
        region: 'center',
        itemId: 'AvailableRolesForManager',
        title: OSS.Localize.get("Available roles"),
        store: "managers.AvailableRolesForManager",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel', {
            mode: 'MULTI'
        }),
        columns: [{
            dataIndex: "role_name", 
            header: OSS.Localize.get("Name"),
            flex: 1
        },{ 
            dataIndex: "descr", 
            header: OSS.Localize.get("Description"),
            flex: 1 
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "managers.AvailableRolesForManager",
            dock: 'bottom'
        }]
    }]
});
