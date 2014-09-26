Ext.define('OSS.view.usergroups.AddGroupWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.usergroups_addingform',
    height: 130,
    width: 400,
    layout: 'fit',
    resizable: false,
    modal: true,
    title: OSS.Localize.get('Add'),
    items: [{
        xtype: 'form',
        layout: 'form',
        frame: true,
        border: false,
        buttonAlign: 'center',
        buttons: [{
            xtype: 'button',
            formBind: true,
            itemId: 'saveNewGroupBtn',
            text: OSS.Localize.get('Save')
        }, {
            xtype: 'button',
            itemId: 'cancelFormBtn',
            text: OSS.Localize.get('Cancel')
        }],
        items: [{
            xtype: 'textfield',
            fieldLabel: OSS.Localize.get('Name'),
            name: 'name',
            allowBlank: false,
            itemId: 'name'
        }, {
            xtype: 'textfield',
            fieldLabel: OSS.Localize.get('Description'),
            name: 'description',
            itemId: 'description'
        }]
    }]
});
