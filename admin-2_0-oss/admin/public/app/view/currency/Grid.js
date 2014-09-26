Ext.define( 'OSS.view.currency.Grid', {
    extend: 'Ext.grid.Panel',
    region: "west",
    alias: 'widget.osscurrenciesgrid',
    width: 300,
    store: 'currency.Grid',
    hideHeaders: true,
    columns: [{
        dataIndex: 'name',
        flex: 1,
        menuDisabled: true,
        sortable: false,
        renderer: function (value, meta, record) {
            if ( true == record.get('is_def')) {
                meta.style += " color: red;";
            }
            return value + ' (' + record.get('symbol') + ')';
        }
    }]
});
