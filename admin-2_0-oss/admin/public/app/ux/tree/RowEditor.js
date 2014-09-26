Ext.define( "OSS.ux.tree.RowEditor", {
    extend: 'Ext.tree.Panel',
    requires: ['OSS.helpers.LeavesFilter'],
    treeToolbar: null,
    setAddBtnHandler: function( func, scope ) {
        var binded_func = Ext.Function.bind( func, scope );
        this.treeToolbar.down("#createBtn").on( "click", binded_func );
    },
    setTreeToolbar: function( tbar ) {
        this.leavesFilter.toolbar = tbar;
        this.treeToolbar = tbar;    
    },
    initComponent: function() {
        this.leavesFilter = Ext.create( "OSS.helpers.LeavesFilter", { store: this.store });
        this.callParent();
        this.down("treecolumn").on( "click", this.enableCatalogButtons, this);
    },
    enableCatalogButtons: function( p1, p2, p3, p4, p5, record ) {
        if (record == undefined || !record.get('clickable')) {
            return;
        }
        this.fireEvent('itemchoose');
        var btn = this.treeToolbar.down("#removeBtn");
        btn.enable();
        btn.setIconCls( 'x-ibtn-def x-ibtn-delete' );
    },
    viewConfig:{
        markDirty:false
    },
    columns: [
        {
            header: OSS.Localize.get( "Title" ),
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'text'
        },
        {
            header: "&nbsp",
            width: 30,
            xtype: 'actioncolumn',
            tooltip: OSS.Localize.get( 'Edit' ),
            align: 'center',
            getClass: function(p1, p2, record) {
                if (record.get( 'clickable' )) {
                    return 'x-ibtn-def x-ibtn-edit';
                } else {
                    return '';
                }
            }
        }
    ]
});
