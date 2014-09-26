/**
 * Главная панель раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.view.AuthLog', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.authlog',
    layout: 'border',
    frame: true,
    margin: 0,
    padding: 0,
    title: i18n.get('Authorization log'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.authlog.Filter'),
            Ext.create('OSS.view.authlog.Grid')
        ];
        this.callParent(arguments);
    }
});
