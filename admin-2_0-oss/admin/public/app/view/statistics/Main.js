/**
 * Панель статистики раздела "Отчеты/Статистика"
 */
Ext.define('OSS.view.statistics.Main', {
    extend: 'Ext.panel.Panel',
    region: 'center',
    itemId: 'main',
    layout: 'border',
    items: [
        {
            xtype: 'container',
            layout: 'card',
            region: 'center',
            itemId: 'grids',
            items: []
        },
        {
            xtype: 'container',
            hidden: true,
            region: 'south',
            layout: 'card',
            itemId: 'summary',
            items: []
        }
    ]
});
