/**
 * Вкладка <Разовые услуги> формы создания/редактирования учетных записей
 */
Ext.define('OSS.view.accounts.item.usbox.OneTime', {
    extend: 'OSS.view.accounts.item.UsBox',
    itemId: 'onetime',
    common: 0,
    disableEdit: true,
    title: i18n.get('One-time services'),
    /**
     * Добавляет поля формы редактирования разовой услуги
     *
     * @param form {Ext.form.Panel} Форма
     * @return {Ext.form.Panel}
     */
    processForm: function(form) {
        form.insert(2, [{
            fieldLabel: i18n.get('Installment plan'),
            showId: true,
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            hidden: true,
            name: 'installment_plan_id',
            displayField: 'name',
            defaultOption: {
                plan_id: 0,
                name: i18n.get('No')
            },
            value: 0,
            valueField: 'plan_id',
            editable: false,
            store: 'accounts.usbox.Installments'
        }]);
        return form;
    },
    initComponent: function() {
        this.store = Ext.app.Application.instance.getController('Accounts').getOneTimeServicesStore();
        this.callParent(arguments);
    }
});
