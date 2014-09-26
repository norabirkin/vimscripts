Ext.define( 'OSS.view.statistics.traffic.Summary', {
    extend: 'OSS.view.statistics.Summary',
    store: Ext.create( 'Ext.data.Store', {
        fields: [
            { type: 'float', name: 'volume' },
            { type: 'float', name: 'volume_out' },
            { type: 'float', name: 'volume_in' },
            { type: 'float', name: 'amount' },
            { type: 'string', name: 'curr_symbol' }
        ]
    }),
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: '&nbsp;',
                flex: 1
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
