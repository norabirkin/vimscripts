Ext.define( 'OSS.view.addresses.grid.Porches', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'porch_id',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Porch'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Porches' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
