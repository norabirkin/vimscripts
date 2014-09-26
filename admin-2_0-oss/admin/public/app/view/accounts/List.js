/**
 * Таблица учетных записей
 */
Ext.define('OSS.view.accounts.List', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    itemId: 'list',
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.accounts.list.Filter'),
            Ext.create('OSS.view.accounts.list.Grid')
        ];
        this.callParent(arguments);
    }
});
