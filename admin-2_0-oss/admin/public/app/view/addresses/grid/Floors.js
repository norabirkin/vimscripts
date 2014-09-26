Ext.define( 'OSS.view.addresses.grid.Floors', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'floor_id',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Floor'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Floors' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
