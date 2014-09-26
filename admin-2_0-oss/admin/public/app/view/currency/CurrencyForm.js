Ext.define('OSS.view.currency.CurrencyForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.currencyform',
    height: 200,
    width: 300,
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
        bodyPadding: 5,
        items: [{
            xtype: 'hidden',
            name: 'cur_id'
        }, {
            xtype: 'textfield',
            name: 'name',
            labelWidth: 100,
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'Name' )
        }, {
            xtype: 'textfield',
            name: 'symbol',
            labelWidth: 100,
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'Character' )
        }, {
            xtype: 'checkbox',
            name: 'is_def',
            labelWidth: 100,
            fieldLabel: OSS.Localize.get( 'Default' )
        }, {
            xtype: 'combobox',
            name: 'code_okv',
            valueField: 'record_id',
            displayField: 'name',
            store: 'currency.Codes',
            labelWidth: 100,
            itemId: 'cardSet',
            allowBlank: false,
            tpl: '<tpl for="."><div class="x-boundlist-item">{[values.record_id]}. {[Ext.util.Format.ellipsis(values.name, 25)]}</div></tpl>',
            fieldLabel: OSS.Localize.get( 'Currency from dictionary' )
        }]
    }]
});
