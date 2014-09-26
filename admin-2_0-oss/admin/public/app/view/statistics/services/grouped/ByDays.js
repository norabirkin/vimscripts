Ext.define( 'OSS.view.statistics.services.grouped.ByDays', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Write-off'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: OSS.Localize.get('Date'),
                dataIndex: 'dt',
                flex: 1,
                renderer: this.daysHighlight
            }, 
            {
                header: OSS.Localize.get('Quant.'),
                dataIndex: 'volume'
            }
        ];
        this.callParent( arguments );
    }
});

