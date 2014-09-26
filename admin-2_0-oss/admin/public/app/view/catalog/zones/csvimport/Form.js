Ext.define('OSS.view.catalog.zones.csvimport.Form', {
    alias: 'widget.zonesimportform',
    extend: 'Ext.form.Panel',
    items: [{
        xtype: 'fieldset',
        border: false,
        layout: 'fit',
        items: [{
            xtype: 'filefield',
            name: 'catalogue',
            fieldLabel: OSS.Localize.get( 'File' ),
            labelWidth: 50,
            msgTarget: 'side',
            allowBlank: false,
            buttonText: OSS.Localize.get( 'Choose file' )
        }]  
    }]
});
