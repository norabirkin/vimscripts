Ext.define( 'OSS.view.addresses.grid.Areas', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'area_id',
    meaningLevel: 2,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('District'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Areas' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
