Ext.define( 'OSS.view.history.tabs.Discounts', {
    extend: 'OSS.view.payments.tabs.History',
    title: OSS.Localize.get('Discounts'),
    disabled: false,
    layout: 'anchor',
    width: 800,
    getGridStore: function() { return 'history.Discounts'; },
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Name'),
                dataIndex: 'name',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Tariff'),
                dataIndex: 'tar_name',
                width: 160
            }, 
            {
                header: OSS.Localize.get('Category'),
                width: 120,
                dataIndex: 'category'
            }, 
            {
                header: OSS.Localize.get('Since'),
                dataIndex: 'timefrom',
                width: 100,
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Till'),
                dataIndex: 'timeto',
                width: 100,
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Cost with discount'),
                width: 150,
                dataIndex: 'costwithdisc'
            }
        ];
        this.callParent( arguments );
    }
});
