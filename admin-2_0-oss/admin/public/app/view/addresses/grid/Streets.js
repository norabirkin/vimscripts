Ext.define( 'OSS.view.addresses.grid.Streets', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'street_id',
    meaningLevel: 5,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('Street'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            },
            {
                header: OSS.Localize.get('Post code'),
                dataIndex: 'postcode',
                editor: { xtype: 'numberfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Streets' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
