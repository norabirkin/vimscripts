Ext.define( 'OSS.view.addresses.grid.Settles', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'settl_id',
    meaningLevel: 4,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('Area'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Settles' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
