Ext.define("OSS.view.managers.List", {
    extend: 'Ext.grid.Panel',
    alias: "widget.managerslist",
    itemId: 'managersListGrid',
    columns: [{
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'person_id',
        tooltip: OSS.Localize.get("Edit manager"),
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-edit';
        }
    }, {
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'person_id',
        tooltip: OSS.Localize.get("Edit roles"),
        getClass: function(v, meta, record) {
            if (record.get('person_id') == 0) {
                return 'x-ibtn-def-dis x-ibtn-address';
            }
            return 'x-ibtn-def x-ibtn-address';
        }
    },
    {
        header: 'ID',
        width: 30,
        dataIndex: 'person_id'
    }, {
        header: OSS.Localize.get( 'Login' ),
        width: 150,
        dataIndex: 'login'
    }, {
        header: OSS.Localize.get( 'Manager name' ),
        width: 300,
        dataIndex: 'fio'
    }, {
        header: OSS.Localize.get( 'Description' ),
        flex: 1,
        dataIndex: 'descr'
    }, {
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'person_id',
        tooltip: OSS.Localize.get("Delete manager"),
        getClass: function(v, meta, record) {
            if (record.get('person_id') == 0) {
                return 'x-ibtn-def-dis x-ibtn-delete';
            }
            return 'x-ibtn-def x-ibtn-delete';
        }                       
    }],
    store: 'managers.Managers',
    bbar: { 
        xtype: 'pagingtoolbar',
        displayInfo: true,  
        store: 'managers.Managers'   
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
                    itemId: 'manageradd',
                    text: OSS.Localize.get( 'Add manager' )
                }]
            }
        }, { 
            xtype: 'tbseparator' 
        },
        OSS.Localize.get("Name / Login") + ': ', 
        {
            xtype: 'searchtext',
            name: 'searchfield',
            searchButton: 'searchbtn',
            width: 180
        }, {
            xtype: 'button',
            itemId: 'searchbtn',
            iconCls: 'x-ibtn-search',
            style: 'margin-left: 4px',
            text: OSS.Localize.get( 'Find' )
        }] 
    }]

});
