/**
 * Таблица отчетов
 */
Ext.define('OSS.view.reports.List', {
    extend: 'Ext.panel.Panel',
    itemId: 'list',
    layout: 'border',
    title: i18n.get('Standard reports'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.reports.list.Grid')
        ];
        this.callParent(arguments);
    }
});
