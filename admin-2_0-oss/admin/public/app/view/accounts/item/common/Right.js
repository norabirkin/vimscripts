/**
 * Правая часть  вкладки <Общие> панели создания/редактирования учетной записи
 *
 * ref: 'accounts > #form > #common > #right'
 */
Ext.define('OSS.view.accounts.item.common.Right', {
    extend: 'Ext.container.Container',
    itemId: 'right',
    padding: '0 0 0 10',
    width: 650,
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.accounts.item.common.right.Tariff'),
            Ext.create('OSS.view.accounts.item.common.right.StatusAndBalance'),
            Ext.create('OSS.view.accounts.item.common.right.Options'),
            Ext.create('OSS.view.accounts.item.common.right.Device')
        ];
        this.callParent(arguments);
    }
});
