Ext.define("OSS.view.accountsgroups.List", {
    extend: 'Ext.grid.Panel',
    alias: "widget.groupslist",
    id: "accountsgroupspanel",
    plugins: [
       Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
       })
    ],
    store: "accountsgroups.AccountsGroups",
    columns: [{
        xtype: 'actioncolumn',
        itemId: 'accounts',
        header: '&nbsp',
        width: 25,
        dataIndex: 'group_id', 
        tooltip: OSS.Localize.get("Edit accounts list"),
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-users';
        }                        
    }, {
        xtype: 'actioncolumn',
        itemId: 'tariffs',
        tooltip: OSS.Localize.get("Edit tariff plans allowed for scheduling by users"),
        header: '&nbsp',
        width: 25,
        dataIndex: 'group_id',
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-list';
        }                        
    },{
        xtype: 'actioncolumn',
        itemId: 'scheduling',
        tooltip: OSS.Localize.get("Schedule"),
        header: '&nbsp',
        width: 25,
        dataIndex: 'group_id',
        getClass: function(v, meta, record) {
            var disFlag =  record.get("vg_count") > 0  ? "" : "-dis";
            return 'x-ibtn-def' + disFlag + ' x-ibtn-clock'; 
        }                        
    }, { 
        dataIndex: "group_id", 
        header: OSS.Localize.get("ID"),
        width: 70
    }, { 
        dataIndex: "name", 
        header: OSS.Localize.get("Name"),
        editor: {
            xtype: 'textfield',
            allowBlank: false
        },
        width: 220
    }, { 
        dataIndex: "descr", 
        header: OSS.Localize.get("Description"),
        editor: {
            xtype: 'textfield',
            allowBlank: false
        },
        flex: 1
    }, { 
        dataIndex: "vg_count",
        header: OSS.Localize.get("Account entries"),
        width: 100
    }, {
        xtype: 'actioncolumn',
        itemId: 'delete',
        header: '&nbsp',
        width: 25,
        dataIndex: 'group_id',
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-delete';
        }                        
    }],
    dockedItems: [{ 
        xtype: 'pagingtoolbar', 
        store: "Paycards",
        dock: 'bottom'
    }, {
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'searchTbar',
        items: [{
            xtype: 'button',
            text: OSS.Localize.get( 'Operations' ),
            itemId: 'actions',
            menu:[{
                iconCls: 'x-ibtn-add', 
                itemId: 'addGroupBtn',
                text: OSS.Localize.get( 'Add' )
            }]
        }]
    }]
});