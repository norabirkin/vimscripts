Ext.define( 'OSS.view.payments.tabs.Payment', {
    extend: 'Ext.form.Panel',
    itemId: 'payment',
    title: OSS.Localize.get('Payment'),
    frame: true,
    initComponent: function() {
        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            padding: '5 5 5 5',
            items: [
                {
                    xtype: 'save', 
                    text: OSS.Localize.get('Save payment'),
                    disabled: true,
                    formBind: true
                },
                { xtype: 'tbseparator' }, 
                {
                    text: 'X ' + OSS.Localize.get('Report'),
                    xtype: 'list',
                    itemId: 'x'
                }, 
                {   
                    text: 'Z ' + OSS.Localize.get('Report'),
                    xtype: 'list',
                    itemId: 'z'
                }
            ]
        });
        this.items = [{
            xtype: 'fieldset',
            border: 0,
            defaults: {
                width: 400,
                labelWidth: 200
            },
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'balance',
                    readOnly: true,
                    fieldLabel: OSS.Localize.get('Current Balance')
                },
                {
                    xtype: 'numberfield',
                    name: 'payment_sum',
                    fieldLabel: OSS.Localize.get('Payment sum'),
                    allowBlank: false,
                    validator: function( value ) {
                        if (value != 0) {
                            return true;
                        } else {
                            return OSS.Localize.get('Empty field: Sum');
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'newbalance',
                    fieldLabel: OSS.Localize.get('Set balance value')
                },
                { xtype: 'hidden', name: 'setid', value: 0 },
                { xtype: 'hidden', name: 'docid', value: 0 },
                {
                    xtype: 'textfield',
                    name: 'payment_order_num',
                    fieldLabel: OSS.Localize.get('Payment order number')
                },
                Ext.create('OSS.view.payments.tabs.fields.DocumentNumber', {
                    fieldWidth: 195,
                    width: 'auto',
                    labelWidth: 200
                }),
                {
                    xtype: 'container',
                    layout: 'hbox',
                    licid: 'full',
                    itemId: 'bso',
                    items: [
                        {
                            fieldLabel: OSS.Localize.get('Strict reporting form'),
                            labelWidth: 200,
                            name: 'docdescr',
                            xtype: 'textfield',
                            itemId: 'number',
                            readOnly: true,
                            padding: '0 5 0 0'
                        },
                        { xtype: 'find', text: '' }
                    ],
                    padding: '0 0 5px 0'
                },
                {
                    xtype: 'datefield',
                    name: 'pay_date',
                    format: 'Y-m-d',
                    value: new Date(),
                    fieldLabel: OSS.Localize.get('Payment date')
                },
                Ext.create('OSS.view.payments.tabs.fields.Class'),
                {
                    xtype: 'combo',
                    itemId: 'payment_type',
                    fieldLabel: OSS.Localize.get('Payment type'),
                    displayField: 'descr',
                    valueField: 'val',
                    value: 1,
                    store: Ext.create( 'Ext.data.Store', {
                        data: [
                            { val: 1, descr: OSS.Localize.get('Cash') },
                            { val: 2, descr: OSS.Localize.get('Cashless') },
                            { val: 3, descr: OSS.Localize.get('Sell without check') },
                            { val: 4, descr: OSS.Localize.get('Refund without check') }
                        ],
                        fields: ['val', 'descr'] 
                    })
                },
                {
                    xtype: 'combo',
                    editable: false,
                    value: -1,
                    fieldLabel: OSS.Localize.get('Cashier - Payment system'),
                    defaultOption: {
                        person_id: -1,
                        login: '---'
                    },
                    valueField: 'person_id',
                    name: 'person_id',
                    displayField: 'login',
                    store: 'payments.Managers',
                    allowBlank: false,
                    width: 400
                }, 
                {
                    xtype: 'textfield',
                    name: 'payment_comment',
                    fieldLabel: OSS.Localize.get('Comment')
                }
            ]
        }];
        this.callParent( arguments );
    }
});
