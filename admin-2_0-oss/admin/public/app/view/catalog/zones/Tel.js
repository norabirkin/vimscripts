Ext.define('OSS.view.catalog.zones.Tel', {
    extend: 'OSS.view.catalog.Zones',
    alias: 'widget.osscatalogtelzones',
    store: 'catalog.zones.Tel',
    validity: 'telzone',
    searchFields: [ 'zone_num', 'descr' ],
    columns: [
        { header: 'ID', dataIndex: 'id' },
        { header: OSS.Localize.get("Number"), dataIndex: 'zone_num', editor: { xtype: 'textfield' } },
        {
            header: OSS.Localize.get("Zone class"),
            itemId: "telClass",
            dataIndex: 'class', 
            width: 125,
            renderer: function( value, metaData, record ) {
                var options = { value: value, name: "" };
                this.fireEvent( "classcolumnrender", options );
                return options.name;
            }
        },
        { header: OSS.Localize.get( "Description" ), dataIndex: 'descr', flex: 1, editor: { xtype: 'textfield' } }
    ],
    dockedItems: [{ xtype: 'pagingtoolbar', store: "catalog.zones.Tel" }]
});
