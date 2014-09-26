Ext.define( 'OSS.view.statistics.traffic.grouped.ByDays', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
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
                header: OSS.Localize.get('Incoming') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume_in'
            }, 
            {
                header: OSS.Localize.get('Outgoing') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume_out'
            }, 
            {
                header: OSS.Localize.get('Sum') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume'
            }
        ];
        this.callParent( arguments );
    }
});

