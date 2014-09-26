Ext.define( 'OSS.view.statistics.Grid', {
    extend: 'Ext.grid.Panel',
    mixins: [
        'OSS.ux.grid.CSVExport',
        'OSS.view.statistics.Renderers'
    ],
    getExportUrl: function() {
        return 'index.php/api/statistics/export';
    },
    initComponent: function() {
        this.store = Ext.create('OSS.store.Statistics');
        this.store.on('load', function(store, records) {
            this.fireEvent('load', store, records);
        }, this);
        this.bbar = {
            xtype: 'pagingtoolbar',
            store: this.store
        };
        this.callParent( arguments );
    }
});
