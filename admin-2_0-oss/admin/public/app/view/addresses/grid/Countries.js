Ext.define( 'OSS.view.addresses.grid.Countries', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'country_id',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Country'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Countries' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
