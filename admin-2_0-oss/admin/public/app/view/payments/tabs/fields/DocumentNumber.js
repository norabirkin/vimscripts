Ext.define( 'OSS.view.payments.tabs.fields.DocumentNumber', {
    //extend: 'Ext.container.Container',
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'hbox'
    },
    itemId: 'payment_number',
    
    fieldLabel: i18n.get('Pay document number'),
    
    documentNumberGenerationButton: function() {
        return Ext.create( 'Ext.button.Button', {
            text: 'OK',
            handler: function() {
                var d = new Date(),
                r = Math.floor(Math.random() * 9999);
                this.up().down('textfield[name=payment_number]').setValue( Ext.Date.format(d, 'Ymdhis') + '-' + r );
            }
        });
    },
    
    updateFormat: function(value) {
        this.down('#payment_format').setValue(value || '');
    },
    
    initComponent: function() {
        this.callParent( arguments );
        
        var width = this.initialConfig.fieldWidth || null;
        
        if(width) {
            this.down('textfield[name=payment_number]').setWidth(width);
        }
    },
    items: [
        {
            allowBlank: false,
            xtype: 'textfield',
            name: 'payment_number',
            validator: function( value ) {
                return Ext.app.Application.instance.getController('Payments').validateDocumentNumber( value );
            },
            // Fix margin. Attribute defaultMargins does not work
            listeners: {
                afterrender: function(el) {
                    el.bodyEl.down('input').setStyle('margin',0);
                }
            }
        },
        {
            xtype: 'tbspacer',
            width: 5
        },
        {
            xtype: 'displayfield',
            itemId: 'payment_format',
            flex: 1,
            hidden: true,
            
            renderer: function(value, field) {
                field[value ? 'show' : 'hide']();
                return Ext.String.format("({0})", value);
            }
        }
    ]
});
