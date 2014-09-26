Ext.define('OSS.view.currency.CurrencyRateForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.currencyrateform',
    height: 160,
    width: 300,
    layout: 'fit',
    resizable: false,
    modal: true,
    title: OSS.Localize.get( 'Currency rate' ),
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
        bodyPadding: 5,
        items: [{
            xtype: 'hidden',
            name: 'cur_id'
        }, {
            xtype: 'datefield',
            name: 'date',
            labelWidth: 100,
            format: "Y-m-d",
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'From' )
        }, {
            xtype: 'datefield',
            name: 'date_till',
            labelWidth: 100,
            format: "Y-m-d",
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'To' )
        }, {
            xtype: 'numberfield',
            name: 'rate',
            labelWidth: 100,
            value: 0,
            fieldLabel: OSS.Localize.get( 'Value' ) 
        }]
    }]
});
