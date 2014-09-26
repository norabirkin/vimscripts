Ext.define( 'OSS.view.statistics.services.grouped.ByAccount', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Write-off'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: OSS.Localize.get('User'),
                dataIndex: 'user_name',
                flex: 1,
                renderer: this.userNameRenderer
            }, 
            {
                header: OSS.Localize.get('Account'),
                dataIndex: 'vg_login',
                renderer: this.vgroupLoginRenderer
            }, 
            {
                header: OSS.Localize.get('Agreement'),
                dataIndex: 'agrm_num'
            }, 
            {
                header: OSS.Localize.get('Quant. charging'),
                dataIndex: 'volume'
            }
        ];
        this.callParent( arguments );
    }
});
