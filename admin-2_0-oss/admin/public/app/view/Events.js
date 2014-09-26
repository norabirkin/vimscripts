/**
 * Главная панель раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.view.Events', {
    extend: 'OSS.view.WithFilter',
    alias: 'widget.events',
    title: i18n.get('Events log'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.events.Filter'),
            Ext.create('OSS.view.events.Grid')
        ];
        this.callParent(arguments);
    }
});
