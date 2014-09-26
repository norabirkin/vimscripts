Ext.define( 'OSS.view.history.tabs.Balance', {
    extend: 'OSS.view.payments.tabs.History',
    title: OSS.Localize.get('Balance history'),
    getSymbolField: function() { return 'curr_symbol'; },
    getGridStore: function() { return 'history.Balance'; },
    getAmountField: function() { return 'balance'; },
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Date'),
                dataIndex: 'dt',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('User'),
                dataIndex: 'user_name',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Agreement'),
                dataIndex: 'agrm_num'
            }, 
            this.getSumColumn()
        ];
        this.callParent( arguments );
    }
});
