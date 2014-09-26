Ext.define('OSS.view.catalog.zones.AS', {
    extend: 'OSS.view.catalog.Zones',
    alias: 'widget.osscatalogaszones',
    store: 'catalog.zones.AS',
    searchFields: [ 'zone_as', 'descr' ],
    columns: [
        { header: 'ID', dataIndex: 'id' },
        { header: OSS.Localize.get( 'Number' ), dataIndex: 'zone_as', editor: { xtype: 'numberfield' } },
        { header: OSS.Localize.get( 'Description' ), dataIndex: 'descr', flex: 1, editor: { xtype: 'textfield' }  }
    ],
    dockedItems: [{ xtype: 'pagingtoolbar', store: "catalog.zones.AS" }]
});
