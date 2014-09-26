Ext.define('OSS.view.catalog.zones.csvimport.Window', {
    extend: 'Ext.window.Window',
    title: OSS.Localize.get( 'Catalogue import' ),
    alias: 'widget.zonesimportwindow',
    height: 200,
    width: 500,
    layout: 'fit',
    resizable: false,
    modal: true,
    items: [{ xtype: 'zonesimportform' }],
    tbar: [{ xtype: "button", text: OSS.Localize.get( 'Upload' ), itemId: 'uplBtn' }]
});
