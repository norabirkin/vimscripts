/**
 * Панель генерации отчетов
 */
Ext.define('OSS.view.Reports', {
    extend: 'OSS.view.WithFilter',
    layout: 'border',
    alias: 'widget.reports',
    title: i18n.get('Generate reports'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.reports.list.Filter'),
            Ext.create('OSS.view.reports.Queue')
        ];
        this.callParent(arguments);
    }
});
