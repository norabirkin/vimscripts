/**
 * Окно редактирования правила
 */
Ext.define('OSS.view.managers.ChangeRules', {
    extend: 'Ext.window.Window',
    title: i18n.get('Changing rule'),
    width: 500,
    layout: 'anchor',
    modal: true,
    buttonAlign: 'center',
    buttons: [{
        xtype: 'button',
        itemId: 'save',
        text: i18n.get('Save')
    }, {
        xtype: 'button',
        itemId: 'cancel',
        text: i18n.get('Cancel')
    }],
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            padding: 10,
            frame: true,
            defaults: {
                labelWidth: 100
            },
            items: [Ext.create('OSS.view.managers.RolesEditor', {
                name: 'value_create',
                value: false,
                fieldLabel: i18n.get('Rights to create')
            }), Ext.create('OSS.view.managers.RolesEditor', {
                name: 'value_read',
                value: false,
                fieldLabel: i18n.get('Rights to read')
            }), Ext.create('OSS.view.managers.RolesEditor', {
                name: 'value_update',
                value: false,
                fieldLabel: i18n.get('Rights to update')
            }), Ext.create('OSS.view.managers.RolesEditor', {
                name: 'value_delete',
                value: false,
                fieldLabel: i18n.get('Rights to delete')
            })]
        }];
        this.callParent(arguments);
    }
});
