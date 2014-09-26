Ext.define('OSS.view.printingformsstat.Grid', {
    extend: 'Ext.grid.Panel',
    region: 'center',
    selType: 'checkboxmodel',
    itemId: 'printingStatGrid',
    minWidth: 600,
    //forceFit:true,
    columns: [{
        dataIndex: 'order_num',
        text: i18n.get('Number'),
        width: 70
    }, {
        text: i18n.get('Subscriber'),
        columns: [{
            text: i18n.get('Name'),
            dataIndex: 'acc_name',
            flex: 1
        }, {
            text: i18n.get('Agreement'),
            dataIndex: 'agrm_num',
            flex: 1
        }, {
            text: i18n.get('Operator'),
            dataIndex: 'oper_name',
            flex: 1
        }]
    }, {
        text: i18n.get('Period'),
        dataIndex: 'period',
        width: 160
    }, {
        text: i18n.get('Created'),
        dataIndex: 'creation_date',
        width: 160
    }, {
        text: i18n.get('Оплата'),
        columns: [{
            text: i18n.get('Amount'),
            dataIndex: 'curr_summ',
            renderer: function (value, meta, record) {
                return value.toFixed(2) + ' (' + record.get('symbol') + ')';
            },
            width: 120
        }, {
            text: i18n.get('Date'),
            dataIndex: 'pay_date',
            renderer: function (value) {
                if (value == '0000-00-00') {
                    return '';
                }
                return value;
            },
            width: 120
        }, {
            text: i18n.get('Receipt'),
            dataIndex: 'receipt',
            width: 160
        }]
    }],
    store: 'printingformsstat.List',
    dockedItems:[{
        xtype: 'pagingtoolbar',
        store: 'printingformsstat.List',
        displayInfo: true,
        dock: 'bottom'
    }]
});