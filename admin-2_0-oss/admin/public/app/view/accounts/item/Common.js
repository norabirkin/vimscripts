/**
 * Общие настройки учетной запси
 *
 * ref: 'accounts > #form > #common > form'
 */
Ext.define('OSS.view.accounts.item.Common', {
    extend: 'Ext.form.Panel',
    title: i18n.get('Common'),
    itemId: 'common',
    layout: 'fit',
    initComponent: function() {
        this.tbar = Ext.create('OSS.view.accounts.item.Toolbar', {
            actions: [{
                itemId: 'save',
                iconCls: 'x-ibtn-save',
                formBind: true,
                text: i18n.get('Save')
            }],
            updateMode: false
        });
        this.items = [{
            xtype: 'form',
            border: false,
            bodyPadding: 10,
            layout: 'hbox',
            items: [
                Ext.create('OSS.view.accounts.item.common.Left'), 
                Ext.create('OSS.view.accounts.item.common.Right')
            ]
        }];    
        this.callParent(arguments);
    }
});
