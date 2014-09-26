/**
 * Тулбар вкладок
 */
Ext.define('OSS.view.agents.Toolbar', {
    extend: 'OSS.ux.toolbar.Toolbar',
    border: false,
    getActions: function() {
        return [{
            iconCls: 'x-ibtn-save',
            itemId: 'finish',
            text: i18n.get('Save'), 
            formBind: true
        }].concat(
            this.callParent(arguments)
        );
    },
    initComponent: function() {
        this.back = {
            form: Ext.app.Application.instance.getController('OSS.controller.agents.Tabs')
        };
        this.callParent(arguments);
    }
});
