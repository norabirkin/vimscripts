Ext.define( 'OSS.view.statistics.services.Summary', {
    extend: 'OSS.view.statistics.Summary',
    store: Ext.create( 'Ext.data.Store', {
        fields: [
            { type: 'float', name: 'amount' },
            { type: 'string', name: 'curr_symbol' }
        ],
        data: []
    }),
    initComponent: function() {
        this.columns = [
            {
                header: '&nbsp;',
                flex: 1
            },
            {
                header: OSS.Localize.get('Write-off'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            }
        ]; 
        this.callParent( arguments );
    }
});
