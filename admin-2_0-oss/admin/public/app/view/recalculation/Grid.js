/**
 * Таблица перерасчета для раздела "Отчеты/Перерасчет"
 */
Ext.define('OSS.view.recalculation.Grid', {
    extend: 'Ext.grid.Panel',
    region: 'center',
    store: "recalculation.List",
    columns: [{ 
        dataIndex: "agent_id", 
        header: OSS.Localize.get("ID"),
        width: 50
    }, { 
        dataIndex: "agent_name",
        header: OSS.Localize.get("Agent"),
        flex: 1
    }, { 
        dataIndex: "recalc_date", 
        header: OSS.Localize.get("Date"),
        width: 80,
        renderer: function(value) {
            if (!Ext.isEmpty(value) && value!= '0000-00-00') {
                return Ext.Date.format(new Date(value), 'd.m.Y');
            }
            return '-';
        }
    }, { 
        dataIndex: "group_name",
        header: OSS.Localize.get("Acc. group"),
        flex: 1,
        renderer: function (value, meta, record) {
            if (record.get('recalc_group') <= 0) {
                return '-';
            }
            return value;
        }
    }, {
        dataIndex: 'recalc_stat',
        header: OSS.Localize.get("Statistics"),
        width: 310,
        renderer: function (value, meta, record) {
            if (value == -1) {
                return OSS.Localize.get('Removing statistics, rolling balances back');
            }
            if (value == 1) {
                return OSS.Localize.get('Recalculation, re-identification of traffic owners');
            }
            if (value == 2) {
                return OSS.Localize.get('Recalculation, remember traffic owners');
            }
            if (value == 3) {
                return OSS.Localize.get('Recalculation, remember traffic owners and tariff plans');
            }
            return "-";
        }
    }, {
        dataIndex: 'recalc_rent',
        header: OSS.Localize.get("Rent"),
        width: 190,
        renderer: function (value, meta, record) {
            if (value == -1) {
                return OSS.Localize.get('Removing statistics, rolling balances back');
            }
            if (value == 1) {
                return OSS.Localize.get('Recalculation according to the current tariff plan');
            }
            if (value == 2) {
                return OSS.Localize.get('Recalculation, remember tariff plans'); 
            }
            return "-";
        }
    },{ 
        dataIndex: "recalc_percent",
        header: OSS.Localize.get("Status"),
        width: 140,
        renderer: function(value, meta, record) {
            return (
                '<ul class="x-line-outer">' +
                '<li class="x-line-inner"><div class="x-progress-wrap" style="padding:0;margins:0;" title="' + (value * 1) + '%">' +
                '<div class="x-progress-value" style="background-color: #9DC293; width: ' + 
                (value * 1) + '%;"></div>' +  
                '</div></li>' +
                '</ul>'
            );
        }
    }],
    dockedItems: [{ 
        xtype: 'pagingtoolbar', 
        store: "recalculation.List",
        dock: 'bottom'
    }, {
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'refreshBtn',
            timeout: 0,
            timeoutId: null,
            text: ''
        }]
    }]
});
