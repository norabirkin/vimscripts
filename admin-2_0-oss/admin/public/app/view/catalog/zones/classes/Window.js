Ext.define("OSS.view.catalog.zones.classes.Window", {
    extend: 'Ext.window.Window',
    title: OSS.Localize.get( "Zone classes" ),
    alias: 'widget.telclasseswindow',
    height: 400,
    width: 500,
    layout: 'fit',
    resizable: false,
    modal: true,
    items: [ { xtype: 'telclassesgrid' } ]
});
