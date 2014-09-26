Ext.define( 'OSS.view.addresses.grid.Flat', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'flat_id',
    meaningLevel: 7,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('Flat') + ' / ' + OSS.Localize.get('Office'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Flats' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
