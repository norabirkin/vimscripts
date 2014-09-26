/**
 * Вкладка "Категории" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.Categories', {
    extend: 'Ext.panel.Panel',
    title: i18n.get('Categories'),
    layout: 'border',
    itemId: 'categoriesTab',
    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [Ext.create('OSS.view.tariffs.form.Back'), '-', {
                xtype: 'splitbutton',
                itemId: 'categoriesActionsBtn',
                text: i18n.get('Actions'),
                handler: function(Btn) {
                    Btn.showMenu();
                },
                menu: {
                    items: [{
                        itemId: 'saveCategoryDataBtn',
                        disabled: true,
                        iconCls: 'x-ibtn-save',
                        text: i18n.get('Save settings')
                    }, {
                        itemId: 'addTarCategoryBtn',
                        iconCls: 'x-ibtn-add',
                        text: i18n.get('Add new category'),
                        listeners: {
                            render: function() {
                                Ext.create('OSS.store.tariffs.TariffTypes').
                                    each(function(item) {
                                        this.menu.add({
                                            value: item.get('id'),
                                            text: item.get('name')
                                        });
                                    }, this);
                            }
                        },
                        menu: []
                    }, {
                        itemId: 'deleteTarCategoryBtn',
                        disabled: true,
                        iconCls: 'x-ibtn-delete',
                        text: i18n.get('Remove selected categories')
                    }, {
                        itemId: 'import',
                        text: i18n.get('Import categories'),
                        tartypes: []
                    }]
                }
            }]
        }];
        this.items = [
            Ext.create('OSS.view.tariffs.form.categories.Grid'),
            Ext.create('OSS.view.tariffs.form.categories.Tabs')
        ];
        this.callParent(arguments);
    }
});
