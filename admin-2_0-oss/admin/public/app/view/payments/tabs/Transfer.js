Ext.define( 'OSS.view.payments.tabs.Transfer', {
    extend: 'Ext.form.Panel',
    itemId: 'transfer',
    title: OSS.Localize.get('Transfer payment'),
    frame: true,
    initComponent: function() {
        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            padding: '5 5 5 5',
            items: [{
                xtype: 'save', 
                formBind: true,
                text: OSS.Localize.get('Transfer payment') 
            }]
        });
        this.mainFieldset = Ext.create( 'Ext.form.FieldSet', {
            border: 0,
            defaults: {
                width: 400,
                labelWidth: 200
            },
            items: [Ext.create('OSS.view.Agreements', {
                    name: 'from_agrm_id',
                    loadOnRender: false,
                    width: 650,
                    labelWidth: 200,
                    store: 'payments.agreements.Transfer',
                    fieldLabel: OSS.Localize.get('Agreement number'),
                    allowBlank: false
                }), {
                    xtype: 'numberfield',
                    name: 'payment_sum',
                    allowBlank: false,
                    fieldLabel: OSS.Localize.get('Transfer sum'),
                    minValue: 0,
                    validator: function( value ) {
                        if (value > 0) {
                            return true;
                        } else {
                            return OSS.Localize.get('Empty field: Sum');
                        }
                    }
                },
                Ext.create('OSS.view.payments.tabs.fields.DocumentNumber', {
                    fieldWidth: 195,
                    width: 'auto',
                    labelWidth: 200
                }),
                {
                    xtype: 'datefield',
                    value: new Date(),
                    format: 'Y-m-d',
                    name: 'pay_date',
                    fieldLabel: OSS.Localize.get('Payment date')
                },
                Ext.create('OSS.view.payments.tabs.fields.Class'),
                {
                    xtype:'textarea',
                    width: 650,
                    name: 'payment_comment',
                    allowBlank: false,
                    fieldLabel: OSS.Localize.get('Comment')
                }
            ]
        });
        this.items = [ this.mainFieldset ];
        this.callParent( arguments );
    }
});
