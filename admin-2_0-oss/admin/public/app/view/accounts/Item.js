/**
 * Панель создания/редактирования учетных записей
 *
 * ref: 'accounts > #form'
 */
Ext.define('OSS.view.accounts.Item', {
    extend: 'Ext.tab.Panel',
    itemId: 'form',
    plain: true,
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.accounts.item.Common')
        ];
        this.callParent(arguments);
    }
});
