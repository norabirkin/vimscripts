Ext.define( 'OSS.view.statistics.telephony.grouped.ByDays', {
    extend: 'OSS.view.statistics.Grid',
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Date'),
                dataIndex: 'timefrom',
                renderer: this.daysHighlight
            }, 
            {
                header: OSS.Localize.get('Operator'),
                dataIndex: 'oper_descr',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Agreement'),
                dataIndex: 'agrm_num'
            }, 
            {
                header: OSS.Localize.get('Incom') + '.',
                dataIndex: 'cnt_in'
            }, 
            {
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration_in',
                renderer: this.durationInRenderer
            }, 
            {
                header: OSS.Localize.get('Dur-n ro-nd'),
                dataIndex: 'duration_round_in',
                renderer: this.durationInRoundRenderer
            }, 
            {
                header: OSS.Localize.get('Outg-ng') + '.',
                dataIndex: 'cnt_out'
            }, 
            {
                header: OSS.Localize.get('Duration'),
                dataIndex: 'duration_out',
                renderer: this.durationRenerer
            }, 
            {
                header: OSS.Localize.get('Dur-n ro-nd'),
                dataIndex: 'duration_round_out',
                renderer: this.durationRenerer
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
