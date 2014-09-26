Ext.define( 'OSS.view.statistics.traffic.grouped.ByAccount', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function () {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
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
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration',
                renderer: this.durationRenerer
            }, 
            {
                header: OSS.Localize.get('Incoming (Mb)'),
                dataIndex: 'volume_in'
            }, 
            {
                header: OSS.Localize.get('Outgoing (Mb)'),
                dataIndex: 'volume_out'
            }, 
            {
                header: OSS.Localize.get('Sum (Mb)'),
                dataIndex: 'volume'
            }
        ];
        this.callParent( arguments );
    }
});
