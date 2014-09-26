/**
 * Главная панель раздела Объекты/Платформы
 */
Ext.define('OSS.view.Platforms', {
    extend: 'Ext.panel.Panel',
    title: i18n.get('Platforms'),
    alias: 'widget.platforms',
    frame: true,
    plain: true,
    layout: 'card',
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.platforms.Platforms'),
            Ext.create('OSS.view.platforms.Agents')
        ];
        this.callParent(arguments);
    }
});
