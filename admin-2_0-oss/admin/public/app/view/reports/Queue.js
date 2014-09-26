/**
 * Очередь генерации документов
 */
Ext.define('OSS.view.reports.Queue', {
    extend: 'Ext.grid.Panel',
    itemId: 'queue',
    region: 'center',
    tbar: [{
        xtype: 'button',
        itemId: 'toggleReload'
    }, {
        xtype: 'tbseparator'
    }, {
        fieldLabel: i18n.get('Since'),
        labelWidth: 17,
        name: 'time_from',
        width: 112,
        xtype: 'datefield',
        padding: '0 5 0 5',
        format: 'Y-m-d'
    }, {
        xtype: 'datefield',
        labelWidth: 20,
        name: 'time_to',
        fieldLabel: i18n.get('To'),
        width: 115,
        format: 'Y-m-d'
    }, {
        xtype: 'textfield',
        name: 'template_name'
    }, {
        xtype: 'find'
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        store: 'reports.documents.ReportsQueue'
    },
    initComponent: function() {
        this.columns = [{
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
            width:178
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
        },
        Ext.create('OSS.view.reports.queue.Status'),
        Ext.create('OSS.view.reports.queue.CancelOrDelete'),
        Ext.create('OSS.view.reports.queue.ErrorOrSave')];
        this.callParent(arguments);
    },
    store: 'reports.documents.ReportsQueue'
});
