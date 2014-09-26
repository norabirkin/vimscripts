/**
 * Окно детализированной информации о событии в разделе "Отчеты/Журнал событий"
 */
Ext.define('OSS.view.events.Details', {
    extend: 'Ext.window.Window',
    title: i18n.get('Details'),
    width: 700,
    height: 300,
    modal: true,
    layout: 'anchor',
    items: [{
        xtype: 'gridpanel',
        anchor: '100% 100%',
        columns: [{
            header: i18n.get('Table'),
            flex: 1,
            dataIndex: 'table'
        }, {
            header: i18n.get('Field'),
            dataIndex: 'field'
        }, {
            header: i18n.get('New value'),
            width: 150,
            dataIndex: 'new'
        }, {
            header: i18n.get('Previous value'),
            width: 150,
            dataIndex: 'old'
        }],
        store: 'events.Details'
    }]
});
