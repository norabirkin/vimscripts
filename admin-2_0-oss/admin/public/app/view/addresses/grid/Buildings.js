Ext.define( 'OSS.view.addresses.grid.Buildings', {
    extend: 'OSS.view.addresses.Grid',
    itemId: 'building_id',
    meaningLevel: 6,
    initComponent: function() {
        var connections = Ext.create('Ext.data.Store', {
            fields: [{ name: 'id', type: 'string' }, { name: 'name', type: 'string' }],
            data: [
                { id: 0, name: OSS.Localize.get('Not set') },
                { id: 1, name: 'HFC' },
                { id: 2, name: 'FTTB' }
            ]
        });
        this.columns = [
            this.getTypeColumn(),
            {
                header: OSS.Localize.get('Building'),
                dataIndex: 'name',
                flex: 1,
                editor: { xtype: 'textfield' }
            },
            {
                header: OSS.Localize.get('Block'),
                dataIndex: 'block',
                editor: { xtype: 'textfield' }
            },
            {
                header: OSS.Localize.get('Post code'),
                dataIndex: 'postcode',
                editor: { xtype: 'numberfield' }
            },
            {
                header: OSS.Localize.get('Apart-s num.'),
                dataIndex: 'flats',
                editor: { xtype: 'numberfield' }
            },
            {
                header: OSS.Localize.get('Con.type'),
                dataIndex: 'conn_type',
                renderer: function( value ) { return connections.findRecord( 'id', value ).get( 'name' ); },
                editor: {
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    store: connections
                }
            }
        ];
        this.store = Ext.create( 'OSS.store.addresses.Buildings' );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.store }];
        this.callParent( arguments );
    }
});
