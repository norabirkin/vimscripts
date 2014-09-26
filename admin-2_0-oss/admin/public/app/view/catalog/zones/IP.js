Ext.define('OSS.view.catalog.zones.IP', {
    extend: 'OSS.view.catalog.Zones',
    alias: 'widget.osscatalogipzones',
    store: 'catalog.zones.IP',
    validity: 'ipzone',
    searchFields: [ 'zone_ip', 'zone_mask', 'port', 'proto', 'descr' ],
    columns: [
        { header: 'ID', dataIndex: 'id' },
        { header: 'IP', dataIndex: 'zone_ip', editor: { xtype: 'textfield' } },
        { 
            header: OSS.Localize.get( 'Mask' ), 
            dataIndex: 'prefix_size', 
            editor: { 
                xtype: 'numberfield',
                maxValue: 32,
                minValue: 1
            } 
        },
        { header: OSS.Localize.get( 'Port' ), dataIndex: 'port', editor: { xtype: 'numberfield' } },
        { header: OSS.Localize.get( 'Protocol' ), dataIndex: 'proto', editor: { xtype: 'numberfield' } },
        { header: OSS.Localize.get( 'Description' ), dataIndex: 'descr', flex: 1, editor: { xtype: 'textfield' } }
    ],
    dockedItems: [{ xtype: 'pagingtoolbar', store: "catalog.zones.IP" }]
});
