/*
* List of roles for Tariffs and UserGroups tabs [universal list]
*/
Ext.define("OSS.view.managers.TGRoleList", {
    extend: 'Ext.grid.Panel',
    alias: "widget.tgrolelist", // TG is Tariffs and Groups
    itemId: 'TGRoleList',
    columns: [{
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 26,
        dataIndex: 'record_id',
        itemId: 'editBtn',
        getClass: function(v, meta, record) {
            return 'x-ibtn-def x-ibtn-edit';
        }
    },
    {
        header: 'ID',
        width: 30,
        dataIndex: 'record_id'
    }, {
        header: i18n.get( 'Role' ),
        width: 200,
        dataIndex: 'name'
    }, {
        header: i18n.get( 'Description' ),
        flex: 1,
        dataIndex: 'descr'
    }],
    store: 'managers.Roles',
    dockedItems: [{
        xtype: 'pagingtoolbar',
        displayInfo: true,  
        store: 'managers.Roles'
    }]
});