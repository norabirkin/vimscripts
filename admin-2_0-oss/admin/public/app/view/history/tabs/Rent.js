Ext.define( 'OSS.view.history.tabs.Rent', {
    extend: 'OSS.view.payments.tabs.History',
    title: OSS.Localize.get('Rent charges'),
    itemId: 'rent',
    getSymbolField: function() { return 'curr_symbol'; },
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
                header: OSS.Localize.get('Date of charge'),
                dataIndex: 'dateofcharge',
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
    },
    getGridStore: function() { return 'history.Rent'; }
});
