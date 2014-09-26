Ext.define('OSS.view.paycards.GenPaycardsForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.genpaycardsform',
    height: 260,
    width: 400,
    layout: 'fit',
    resizable: false,
    modal: true,
    title: OSS.Localize.get("Generate pre-paid cards"),
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'formSaveBtn',
            iconCls: 'x-ibtn-save',
            text: OSS.Localize.get( 'Create' )
        }]
    }],
    items: [{
        xtype: 'form',
        method: 'POST',
        frame: true,
        itemId: 'windowForm',
        bodyPadding: 5,
        items: [{
            xtype: 'combobox',
            name: 'set_id',
            valueField: 'set_id',
            displayField: 'set_descr',
            store: 'paycards.PaycardsSets',
            labelWidth: 200,
            itemId: 'cardSet',
            allowBlank: false,
            tpl: '<tpl for="."><div class="x-boundlist-item">{[values.set_id]}. {[Ext.util.Format.ellipsis(values.set_descr, 25)]}</div></tpl>',
            fieldLabel: OSS.Localize.get( 'Set' )
        },
        {
            xtype: 'datefield',
            name: 'act_til',
            labelWidth: 200,
            allowBlank: false,
            format: "Y-m-d",
            fieldLabel: OSS.Localize.get( 'Activate till' )
        }, {
            xtype: 'numberfield',
            minValue: 0,
            name: 'amount',
            allowBlank: false,
            allowDecimals: false,
            labelWidth: 200,
            value: 10,
            fieldLabel: OSS.Localize.get( 'Number of cards' )
        },
        {
            xtype: 'numberfield',
            minValue: 1,
            name: 'summ',
            labelWidth: 200,
            value: 0,
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'Nominal value' )
        },
        {
            xtype: 'displayfield',
            minValue: 1,
            name: 'curr',
            itemId: 'currName',
            value: '-',
            labelWidth: 200,
            readOnly: true,
            fieldLabel: OSS.Localize.get( 'Currency' ) 
        },
        {
            xtype: 'numberfield',
            minValue: 1,
            name: 'valency',
            allowDecimals: false,
            labelWidth: 200,
            value: 8,
            allowBlank: false,
            fieldLabel: OSS.Localize.get( 'Key length' ) 
        }, {
            xtype: 'checkbox',
            name: 'use_alpha',
            labelWidth: 200,
            fieldLabel: OSS.Localize.get( 'Use alphabet letters' )
        }]
    }]
});
