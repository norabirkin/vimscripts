Ext.define('OSS.view.catalog.edit.Form', {
    alias: 'widget.catalogform',
    extend: 'Ext.form.Panel',
    requires: [ "OSS.view.catalog.edit.Types" ],
    frame: true,
    items: [{
        xtype: 'fieldset',
        border: false,
        layout: 'fit',
        items: [
            {
                xtype: 'textfield',
                fieldLabel: OSS.Localize.get( 'Catalogue title' ),
                name: 'name',
                labelWidth: 160,
                padding: '0 0 10 0',
                allowBlank: false,
                listeners: {
                    blur: function(){
                        this.setValue(this.getValue().trim());
                    }
                }
            },
            { xtype: 'catalog_edit_types' },
            {
                itemId: 'operatorCombo',
                xtype: 'combo', 
                name: 'operator_id', 
                fieldLabel: OSS.Localize.get( 'Operator' ),
                labelWidth: 160,
                displayField: 'name',
                valueField: 'uid',
                store: "OperatorsList",
                allowBlank: false,
                validator: function() {
                    if (this.store.findRecord( "uid", this.getValue() )) {
                        return true;
                    } else {
                        return OSS.Localize.get('Operator', 'is not found');
                    }
                }
            }
        ]       
    }]
});
