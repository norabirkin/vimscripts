Ext.define('OSS.view.managers.RolesForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.rolesform',
    height: 190,
    width: 400,
    layout: 'fit',
    resizable: false,
    modal: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'formSaveBtn',
            iconCls: 'x-ibtn-save',
            text: OSS.Localize.get( 'Save' )
        }]
    }],
    items: [{
        xtype: 'form',
        method: 'POST',
        frame: true,
        itemId: 'windowForm',
        items: [{
            xtype: 'hidden',
            name: 'record_id'
        }, {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: OSS.Localize.get( 'Name' ),
            width: 370
        }, {
            xtype: 'textareafield',
            name: 'descr',
            fieldLabel: OSS.Localize.get( 'Description' ),
            width: 370
        }]
    }]
});
