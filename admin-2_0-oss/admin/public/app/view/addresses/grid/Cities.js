Ext.define( 'OSS.view.addresses.grid.Cities', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'city_id',
    meaningLevel: 3,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('City'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Cities' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
