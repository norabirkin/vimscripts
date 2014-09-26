Ext.define( 'OSS.view.payments.tabs.Promised', {
    extend: 'Ext.form.Panel',
    itemId: 'promised',
    title: OSS.Localize.get('Promised payment'),
    frame: true,
    requires: 'OSS.view.payments.tabs.promised.BaseForm',
    initComponent: function() {
        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            padding: '5 5 5 5',
            items: [{
                xtype: 'save', 
                text: OSS.Localize.get('Save payment'),
                formBind: true
            }]
        });
        this.callParent( arguments );
    },
    items: [{ 
        xtype: 'fieldset', 
        border: 0,
        items: [
            {
                xtype: 'numberfield',
                name: 'promised_sum',
                fieldLabel: OSS.Localize.get('Payment sum'),
                labelWidth: 200,
                minValue: 0,
                validator: function( value ) {
                    if (value > 0) {
                        return true;
                    } else {
                        return OSS.Localize.get('Empty field: Sum');
                    }
                }
            }, 
            {
                xtype: 'numberfield',
                itemId: 'allowed_debt',
                readOnly: true,
                fieldLabel: OSS.Localize.get('Allowed debt'),
                labelWidth: 200
            }, 
            {
                xtype: 'textfield',
                readOnly: true,
                itemId: 'balance',
                fieldLabel: OSS.Localize.get('Current Balance'),
                labelWidth: 200
            }, 
            {
                xtype: 'textfield',
                itemId: 'datetill',
                readOnly: true,
                fieldLabel: OSS.Localize.get('Date to pay off debt'),
                labelWidth: 200
            },
            {
                xtype: 'numberfield',
                itemId: 'max',
                name: 'max',
                readOnly: true,
                fieldLabel: OSS.Localize.get('Maximum') + ' ' + OSS.Localize.get('payment'),
                labelWidth: 200
            }, 
            {
                xtype: 'numberfield',
                itemId: 'min',
                name: 'min',
                readOnly: true,
                fieldLabel: OSS.Localize.get('Minimum') + ' ' + OSS.Localize.get('payment'),
                labelWidth: 200
            }
        ]
    }],
    createForm: function() {
        var cfg = {},
            props = this.basicFormConfigs,
            len = props.length,
            i = 0,
            prop;
            
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = this[prop];
        }
        return new OSS.view.payments.tabs.promised.BaseForm(this, cfg);
    }
});
