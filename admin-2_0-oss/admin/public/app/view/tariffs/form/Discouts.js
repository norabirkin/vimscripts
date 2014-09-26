/**
 * Вкладка "Скидки" для формы категорий тарифа
 */
Ext.define('OSS.view.tariffs.form.Discouts', {
    extend: 'Ext.panel.Panel',
    title: i18n.get('Discounts'),
    itemId: 'discountsTab',
    tartypes: [0,1,2,3,4],
    layout: 'border',
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.tariffs.form.discounts.Time'),
            Ext.create('OSS.view.tariffs.form.discounts.Size')
        ];
        this.callParent(arguments);
    }
});
