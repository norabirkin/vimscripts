Ext.define( 'OSS.view.statistics.traffic.grouped.BySessions', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Cost'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            }, {
                header: 'IP ' + OSS.Localize.get('address'),
                dataIndex: 'ip',
                flex: 1
            }, {
                header: OSS.Localize.get('Date'),
                dataIndex: 'dt',
                renderer: this.dateRenderer
            }, {
                header: OSS.Localize.get('User'),
                dataIndex: 'user_name',
                renderer: this.userNameRenderer
            }, {
                header: OSS.Localize.get('Login'),
                dataIndex: 'vg_login',
                renderer: this.vgroupLoginRenderer
            }, {
                header: OSS.Localize.get('Category'),
                dataIndex: 'cat_descr'
            }, {
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration',
                renderer: this.durationRenerer
            }, {
                header: 'ANI',
                dataIndex: 'ani'
            }, {
                header: 'DNIS',
                dataIndex: 'dnis'
            },
            {
                header: 'NAS',
                dataIndex: 'nas'
            },
            {
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
