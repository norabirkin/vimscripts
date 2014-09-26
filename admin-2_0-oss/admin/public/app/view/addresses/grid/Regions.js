Ext.define( 'OSS.view.addresses.grid.Regions', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'region_id',
    meaningLevel: 1,
    initComponent: function() {
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('Region'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Regions' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
