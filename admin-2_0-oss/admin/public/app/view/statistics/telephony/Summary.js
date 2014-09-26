Ext.define( 'OSS.view.statistics.telephony.Summary', {
    extend: 'OSS.view.statistics.Summary',
    store: Ext.create( 'Ext.data.Store', {
        fields: [
            { type: 'float', name: 'duration_out' },
            { type: 'float', name: 'cnt_out' },
            { type: 'float', name: 'duration_in' },
            { type: 'float', name: 'cnt_in' },
            { type: 'float', name: 'amount' },
            { type: 'string', name: 'curr_symbol' }
        ],
        data: []
    }),
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Write-off'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: '&nbsp;',
                flex: 1
            },
            {
                header: OSS.Localize.get('Incom') + '.',
                dataIndex: 'cnt_in'
            },
            {
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration_in'
            },
            {
                header: OSS.Localize.get('Outg-ng') + '.',
                dataIndex: 'cnt_out'
            },
            {
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration_out'
            }
        ]; 
        this.callParent( arguments );
    }
});
