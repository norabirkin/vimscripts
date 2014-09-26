Ext.define("OSS.view.managers.RoleTariffs", {
    extend: 'Ext.Panel',
    alias: "widget.roletariffs",
    itemId: 'roleTariffs',
    title: OSS.Localize.get("Assign tariffs to role"),
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
                    itemId: 'addSelectedTariffsBtn'
                }, {
                    text: i18n.get('Remove selected'),
                    iconCls: 'x-ibtn-delete',
                    disabled: true,
                    itemId: 'removeSelectedTariffsBtn'
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
        itemId: 'assignedRoleTariffs',
        title: OSS.Localize.get("Assigned tariffs"),
        store: "managers.AssignedRoleTariffs",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [{
            dataIndex: 'tar_id', 
            header: OSS.Localize.get("ID"),
            width: 50
        }, { 
            dataIndex: 'tar_descr', 
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
            store: "managers.AssignedRoleTariffs",
            dock: 'bottom'
        }]
    }, { 
        xtype: "gridpanel",
        flex: 1,
        itemId: 'freeRoleTariffs',
        title: OSS.Localize.get("Not assigned tariffs"),
        store: "managers.NotAssignedRoleTariffs",
        selType: 'rowmodel',
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [{
            dataIndex: 'tar_id', 
            header: OSS.Localize.get("ID"),
            width: 50
        }, { 
            dataIndex: 'tar_descr', 
            header: OSS.Localize.get("Description"),
            flex: 1 
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "managers.NotAssignedRoleTariffs",
            dock: 'bottom'
        }]
    }]
});
