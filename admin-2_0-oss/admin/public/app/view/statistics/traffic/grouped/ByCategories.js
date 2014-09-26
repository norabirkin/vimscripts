Ext.define( 'OSS.view.statistics.traffic.grouped.ByCategories', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: OSS.Localize.get('Tarif'),
                dataIndex: 'tar_descr',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Category'),
                dataIndex: 'cat_descr'
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
