Ext.define( 'OSS.view.statistics.services.grouped.ByServices', {
    extend: 'OSS.view.statistics.Grid',
    itemId: 'services',
    initComponent: function() {
        this.columns = [{
            header: i18n.get('Write-off'),
            dataIndex: 'amount',
            renderer: this.sumRenderer
        }, {
            header: i18n.get('User'),
            dataIndex: 'user_name',
            flex: 1
        }, {
            header: i18n.get('Account'),
            dataIndex: 'vg_login'
        }, {
            header: i18n.get('Device meterage'),
            hidden: true,
            dataIndex: 'external_data'
        }, {
            header: i18n.get('Meterage date'),
            hidden: true,
            dataIndex: 'timefrom',
            renderer: this.dateRenderer
        }, {
            header: i18n.get('Operator'),
            dataIndex: 'oper_descr'
        }, {
            header: i18n.get('Agreement'),
            dataIndex: 'agrm_num'
        }, {
            header: i18n.get('Tarif'),
            dataIndex: 'tar_descr',
            renderer: this.descrRenderer
        }, {
            header: i18n.get('Category'),
            dataIndex: 'cat_descr',
            renderer: this.descrRenderer
        }, {
            header: i18n.get('Quant.'),
            dataIndex: 'volume'
        }];
        this.callParent(arguments);
    }
});
