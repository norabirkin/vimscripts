/**
 * Таблица событий раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.view.events.Grid', {
    extend: 'Ext.grid.Panel',
    itemId: 'list',
    region: 'center',
    columns: [{
        header: i18n.get('Date'),
        xtype: 'datecolumn',
        width: 125,
        format: 'Y-m-d H:i:s',
        dataIndex: 'dt'
    }, {
        header: i18n.get('Event initiator'),
        dataIndex: 'isclnt',
        width: 150,
        renderer: function(value) {
            if (value) {
                return i18n.get('Client');
            } else {
                return i18n.get('Manager');
            }
        }
    }, {
        header: i18n.get('Initiator name'),
        dataIndex: 'name',
        width: 150
    }, {
        header: i18n.get('Events'),
        dataIndex: 'evt_descr',
        flex: 1,
        renderer: function() {
            var value = arguments[0],
                descr = '',
                record = arguments[2];
            if (record.get('descr')) {
                descr = ' ('+record.get('descr')+')';
            }
            return value+descr;
        }
    }, {
        xtype: 'actioncolumn',
        header: '&nbsp',
        width: 25,
        dataIndex: 'more',
        tooltip: i18n.get('Details'),
        getClass: function(value) {
            var dis = '';
            if (!value) {
                dis = '-dis';
            }
            return 'x-ibtn-def'+dis+' x-ibtn-info-sprite';
        }
    }],
    store: 'Events',
    bbar: {
        xtype: 'pagingtoolbar',
        store: 'Events'
    }
});
