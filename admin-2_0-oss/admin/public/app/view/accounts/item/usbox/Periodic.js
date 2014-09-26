/**
 * Вкладка <Периодические услуги> формы редактирования учетной записи
 */
Ext.define('OSS.view.accounts.item.usbox.Periodic', {
    extend: 'OSS.view.accounts.item.UsBox',
    itemId: 'periodic',
    common: 1,
    title: i18n.get('Periodic services'),
    /**
     * Добавляет поля формы редактирования периодической услуги
     *
     * @param form {Ext.form.Panel} Форма
     * @return {Ext.form.Panel}
     */
    processForm: function(form) {
        form.insert(1, [{
            xtype: 'datetime',
            fieldLabel: i18n.get('Till'),
            labelWidth: 150,
            name: 'time_to',
            defaultDate: null
        }, {
            xtype: 'datetime',
            fieldLabel: i18n.get('Tariff upon'),
            allowBlank: false,
            labelWidth: 150,
            name: 'activated',
            defaultDate: null
        }]);

        form.insert(6, {
            title: i18n.get('The period of the discount'),
            itemId: 'period_of_discount',
            xtype: 'fieldset',
            items: [{
                fieldLabel: i18n.get('Since'),
                labelWidth: 140,
                width: 245,
                xtype: 'datefield',
                name: 'discount_time_from'
            }, {
                fieldLabel: i18n.get('Till'),
                labelWidth: 140,
                width: 245,
                xtype: 'datefield',
                name: 'discount_time_to'
            }]
        });
        return form;
    },
    /**
     * Добавляет колонки специфичные для преиодических услуг
     */
    processColumns: function(columns) {
        return Ext.Array.insert(Ext.Array.insert(columns, 3, [{
                header: i18n.get('End of period'),
                dataIndex: 'time_to',
                xtype: 'datecolumn',
                width: 125,
                format: 'Y-m-d H:i:s'
        }]), 7, [
        {
            xtype: 'storecolumn',
            header: i18n.get('Write-off'),
            dataIndex: 'common',
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: 2,
                    name: i18n.get('daily')
                }, {
                    id: 3,
                    name: i18n.get('daily') + '<br/>' + i18n.get('equal parts')
                }, {
                    id: 1,
                    name: i18n.get('monthly')
                }]
            })
        }]);
    },
    initComponent: function() {
        this.store = Ext.app.Application.instance.getController('Accounts').getPeriodicServicesStore();
        this.callParent(arguments);
    }
});
