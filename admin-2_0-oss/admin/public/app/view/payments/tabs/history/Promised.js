Ext.define('OSS.view.payments.tabs.history.Promised', {
    extend: 'OSS.view.payments.tabs.History',
    itemId: 'promised_history',
    title: OSS.Localize.get('Promised payments history'),
    getGridStore: function() { return 'payments.history.Promised'; },
    getSymbolField: function() { return 'symbol'; },
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Payment date'),
                flex: 1,
                dataIndex: 'prom_date',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Valid until'),
                flex: 1,
                dataIndex: 'prom_till',
                renderer: this.dateColumnRenderer
            }, 
            this.getSumColumn(), 
            {
                header: OSS.Localize.get('Debt'),
                dataIndex: 'debt'
            }, 
            {
                header: OSS.Localize.get('Status'),
                dataIndex: 'pay_id',
                renderer: function( value ) {
                    switch (value) {
                        case -1: return OSS.Localize.get('Overdue'); break;
                        case 0: return OSS.Localize.get('Not paid'); break;
                        case 1: return OSS.Localize.get('Paid'); break;
                        default: return OSS.Localize.get('Paid'); break;
                    }
                }
            }
        ];
        this.callParent( arguments );
    }
    
});
