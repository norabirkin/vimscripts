Ext.define( 'OSS.view.statistics.traffic.grouped.ByAddresses', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            }, {
                header: 'IP ' + OSS.Localize.get('address'),
                dataIndex: 'src_ip',
                flex: 1
            }, {
                header: OSS.Localize.get('User'),
                dataIndex: 'user_name',
                renderer: this.userNameRenderer
            }, {
                header: OSS.Localize.get('Login'),
                dataIndex: 'vg_login',
                renderer: this.vgroupLoginRenderer
            }, {
                header: 'IP ' + OSS.Localize.get('Resource'),
                dataIndex: 'dst_ip'
            }, {
                header: OSS.Localize.get('Incoming') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume_in'
            }, {
                header: OSS.Localize.get('Outgoing') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume_out'
            }, {
                header: OSS.Localize.get('Sum') + ' (' + OSS.Localize.get('Mb') + ')',
                dataIndex: 'volume'
            }
        ];
        this.callParent( arguments );
    }
});
