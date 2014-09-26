/**
 * Таблица генерации печатных форм раздела
 * "Действия/Сгенерировать/Печатные формы"
 */
Ext.define('OSS.view.printforms.Grid', {
    extend: 'Ext.grid.Panel',
    region: 'center',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'toggleReloadBtn',
            text: i18n.get('Turn off auto reloading')
        }, {
            xtype: 'button',
            itemId: 'reloadBtn',
            text: i18n.get('Reload data')
        }]
    }, {
        xtype: 'pagingtoolbar',
        store: 'OSS.store.printforms.DocumentsList'
    }],
    columns: [{
        header: "ID",
        dataIndex: 'record_id',
        width: 50
    }, {
        header: i18n.get('Documents templates'), 
        dataIndex: 'name', 
        flex: 1
    }, {
        header: i18n.get('Manager'),
        dataIndex: 'manager_fio',
        width: 178
    }, {
        header: i18n.get('Added'),
        dataIndex: 'create_date',
        xtype: 'datecolumn',
        width: 125,
        format: 'Y-m-d H:i:s'
    }, {
        header: i18n.get('Generated'),
        dataIndex: 'end_date',
        xtype: 'datecolumn',
        width: 125,
        format: 'Y-m-d H:i:s'
    }, {
        header: i18n.get('Period'),
        dataIndex: 'period',
        xtype: 'datecolumn',
        width: 90,
        format: 'Y-m-d'
    }, {
        xtype: 'queuestatus'
    }, {
        xtype: 'printdoccancel',
        width: 26
    }, {
        xtype: 'queueerror',
        width: 26
    }],
    store: 'OSS.store.printforms.DocumentsList'
});
