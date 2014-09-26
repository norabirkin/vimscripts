Ext.define('OSS.view.payments.tabs.history.Payments', {
    extend: 'OSS.view.payments.tabs.History',
    requires: [ 'OSS.ux.button.sprite.Export' ],
    mixins: ['OSS.ux.grid.CSVExport'],
    title: i18n.get('Payments history'),
    itemId: 'payments_history',
    getGridStore: function() { return 'payments.history.Payments'; },
    getSymbolField: function() { return 'cur_symb'; },
    getExportUrl: function() { return 'index.php/api/payments/export'; },
    initComponent: function() {
        this.tbar = [
            { xtype: 'tbseparator' }, 
            { xtype: 'export' }
        ];
        this.columns = [
            {
                header: i18n.get('Payment date'),
                dataIndex: 'pay_date',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: i18n.get('Payment commited'), 
                dataIndex: 'local_date',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: i18n.get('Manager'),
                flex: 1,
                dataIndex: 'mgr_fio'
            }, 
            this.getSumColumn(), 
            {
                header: i18n.get('Class of payment'),
                dataIndex: 'class_name'
            }, 
            {
                header: i18n.get('Transfer from'),
                dataIndex: 'from_agrm_number'
            },
            {
                header: i18n.get('Payment order number'),
                dataIndex: 'payment_order_number',
                hidden: true
            },
            {
                header: i18n.get('Payment order'),
                dataIndex: 'receipt',
                hidden: true
            },
            {
                header: i18n.get('Comment'),
                dataIndex: 'comment'
            },
            {
                header: i18n.get('Strict reporting form'),
                licid: 'full',
                dataIndex: 'bso'
            }
        ];
        this.callParent( arguments );
    }
});
