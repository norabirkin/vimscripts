Ext.define( 'OSS.view.history.tabs.Services', {
    extend: 'OSS.view.payments.tabs.History',
    title: OSS.Localize.get('Services history') + ' (UsBox)',
    getSymbolField: function() { return 'curr_symbol'; },
    getGridStore: function() { return 'history.Services'; },
    initComponent: function() {
        this.tbar = [
            { xtype: 'tbseparator' },
            {
                xtype: 'checkbox',
                name: 'emptyamount',
                fieldLabel: OSS.Localize.get('Hide empty charges')
            }
        ];
        this.columns = [
            {
                header: OSS.Localize.get('Date'),
                dataIndex: 'period',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Date of charge-off'),
                dataIndex: 'dt',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Account'),
                dataIndex: 'vg_login'
            }, 
            {
                header: OSS.Localize.get('Category'),
                dataIndex: 'cat_descr',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Quantity'),
                dataIndex: 'volume'
            }, 
            this.getSumColumn()
        ];
        this.callParent( arguments );
    }
});
