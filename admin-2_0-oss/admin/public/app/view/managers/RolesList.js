Ext.define("OSS.view.managers.RolesList", {
    extend: 'Ext.grid.Panel',
    alias: "widget.roleslist",
    itemId: 'rolesListGrid',
    columns: [{
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'record_id',
        tooltip: OSS.Localize.get("Edit role"),
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-edit';
        }
    },{
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'record_id',
        tooltip: OSS.Localize.get("Edit role rules"),
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-list';
        }
    },
    {
        header: 'ID',
        width: 30,
        dataIndex: 'record_id'
    }, {
        header: OSS.Localize.get( 'Name' ),
        width: 150,
        dataIndex: 'name'
    }, {
        header: OSS.Localize.get( 'Description' ),
        flex: 1,
        dataIndex: 'descr'
    }, {
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'record_id',
        tooltip: OSS.Localize.get("Delete role"), 
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-delete';
        }                       
    }],
    store: 'managers.Roles',
    bbar: { 
        xtype: 'pagingtoolbar',
        displayInfo: true,  
        store: 'managers.Roles'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'actions',
            iconCls: 'x-ibtn-add',
            text: OSS.Localize.get( 'Actions' ),
            menu: {
                xtype: 'menu',
                width: 180,
                items: [{    
                    iconCls: 'x-ibtn-user-add',
                    itemId: 'roleadd',
                    text: OSS.Localize.get( 'Add role' )
                }]
            }
        }] 
    }]

});