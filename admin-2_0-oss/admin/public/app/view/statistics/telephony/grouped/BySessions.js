Ext.define( 'OSS.view.statistics.telephony.grouped.BySessions', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Date'),
                dataIndex: 'timefrom',
                renderer: this.dateRenderer
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
                header: OSS.Localize.get('Direct'),
                dataIndex: 'direction',
                renderer: function(value, meta){
                    if (value == 0) {
                        meta.style = 'background-color:#ecf9ff;';
                        return OSS.Localize.get('Incom') + '.';
                    } else {
                        meta.style = 'background-color:#fdffec;';
                        return OSS.Localize.get('Outg-ng') + '.'
                    }
                }
            }, 
            {
                header: OSS.Localize.get('Operator'),
                dataIndex: 'oper_descr'
            }, 
            {
                header: OSS.Localize.get('Agreement'),
                dataIndex: 'agrm_num'
            }, 
            {
                header: OSS.Localize.get('Dur-n'),
                dataIndex: 'duration_in',
                renderer: this.durationInRawRenderer
            }, 
            {
                header: OSS.Localize.get('Dur-n ro-nd'),
                dataIndex: 'duration_round_in',
                renderer: this.durationInRoundRenderer
            }, 
            {
                header: OSS.Localize.get('Number') + ' A',
                dataIndex: 'numfrom'
            }, 
            {
                header: OSS.Localize.get('Number') + ' ' + OSS.Localize.get('B'),
                dataIndex: 'numto'
            }, 
            {
                header: OSS.Localize.get('Tariff'),
                dataIndex: 'tar_descr',
                renderer: this.descrRenderer
            }, 
            {
                header: OSS.Localize.get('Category'),
                dataIndex: 'cat_descr',
                renderer: this.descrRenderer
            }, 
            {
                header: OSS.Localize.get('Trunk in'),
                dataIndex: 'trunk_in'
            }, 
            {
                header: OSS.Localize.get('Trunk out'),
                dataIndex: 'trunk_out'
            }, 
            {
                header: OSS.Localize.get('Class'),
                dataIndex: 'class'
            }, 
            {
                header: OSS.Localize.get('Cause'),
                dataIndex: 'cause'
            }, 
            {
                header: OSS.Localize.get('Write-off'),
                dataIndex: 'amount',
                renderer: this.sumRenderer
            },
            {
                header: OSS.Localize.get('Period'),
                dataIndex: 'c_date',
                renderer: this.periodRenderer
            }   
        ];
        this.callParent( arguments );
    }
});
