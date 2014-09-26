/**
 * Добавляет элементы меню <Действия>, которые должны присутствовать на всех тулбарах вкладок
 */
Ext.define('OSS.view.accounts.item.Toolbar', {
    extend: 'OSS.ux.toolbar.Toolbar',
    initComponent: function() {
        this.back = {
            form: Ext.app.Application.instance.getController('OSS.controller.accounts.Item').getCommon,
            grid: Ext.app.Application.instance.getController('OSS.controller.accounts.Item').getList
        };
        this.callParent(arguments);
    },
    updateMode: true,
    getActions: function() {
        return this.callParent(arguments).concat([{
            xtype: 'menuseparator'
        }, {
            itemId: 'rent', 
            text: i18n.get('History of rent'), 
            disabled: !this.updateMode,
            iconCls: 'x-ibtn-def x-ibtn-chart'
        }, {
            itemId: 'addonsBtn', 
            text: i18n.get('Additional fields'), 
            disabled: !this.updateMode,
            iconCls: 'x-ibtn-additional'
        }]);
    }
});
