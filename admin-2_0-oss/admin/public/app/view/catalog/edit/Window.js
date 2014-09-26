Ext.define('OSS.view.catalog.edit.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.catalogwindow',
    height: 200,
    width: 500,
    layout: 'fit',
    resizable: false,
    modal: true,
    items: [ { xtype: 'catalogform' } ],
    tbar: [
        { xtype: "button", text: OSS.Localize.get( 'Save' ), itemId: 'saveBtn' }
    ]
});
