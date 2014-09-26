/**
 * Комбогрид договоров
 */
Ext.define('OSS.view.accounts.item.common.left.Agreements', {
    extend: 'OSS.view.Agreements',
    /**
     * Добавляет колонку <Тип договора> вместо <Имя пользователя>
     */
    getColumns: function() {
        var columns = this.callParent(arguments);
        columns[1] = {
            xtype: 'storecolumn',
            store: Ext.create('OSS.store.agreements.Types'),
            header: i18n.get('Type'),
            dataIndex: 'payment_method',
            flex: 1
        };
        return columns;
    }
});
