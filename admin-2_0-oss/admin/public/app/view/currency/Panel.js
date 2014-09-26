var currencyRenderer = function(value, meta, record){
    var date = new Date(value.date);
    var rate = value.rate;
    meta.style+='text-align: right; padding: 5px;';
    if (1 + date.getMonth() != record.get('currentmonth')) {
        meta.style += " color: #999;";
    }
    if (rate == 'Undefined') {
        rate = OSS.Localize.get(value.rate);
    } else {
        rate = '<b>' + rate + '</b>';
    }
    return Ext.Date.format(date, "d.m.Y") + "<br/>" + rate;
};


Ext.define( 'OSS.view.currency.Panel', {
    extend: 'Ext.grid.Panel',
    region: "center",
    selType: 'cellmodel',
    overCls: 'x-grid-cell-selected',
    alias: 'widget.osscurrenciespanel',
    store: 'currency.Rates',
    columns: [{
        header: OSS.Localize.get('Mon'),
        dataIndex: 'mon',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Tue'),
        dataIndex: 'tue',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Wed'),
        dataIndex: 'wed',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Thu'),
        dataIndex: 'thu',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Fri'),
        dataIndex: 'fri',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Sat'),
        dataIndex: 'sat',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    },{
        header: OSS.Localize.get('Sun'),
        dataIndex: 'sun',
        sortable: false,
        flex: 1,
        renderer: currencyRenderer
    }]
});
