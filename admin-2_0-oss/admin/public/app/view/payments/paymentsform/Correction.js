Ext.define('OSS.view.payments.paymentsform.Correction', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentscorrection',
    width: 810,
    height: 500,
    split: true,
    modal: true,
    resizable: false,
    layout: 'card',
    activeItem: 0,
    title: i18n.get('Corrections'),

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
            // first card
            {
                xtype: 'panel',
                layout: 'border',
                split: true,
                items: [{
                    xtype: 'panel',
                    layout: 'anchor',
                    region: 'west',
                    width: 200,
                    frame: true,
                    defaults: {
                        anchor: '100%',
                        xtype: 'button',
                        style: 'height: 30px;'
                    },
                    items: [{
                        itemId: 'movePaymentBtn',
                        text: i18n.get('Transfer payment')
                    }, {
                        itemId: 'correctPaymentBtn',
                        text: i18n.get('Correct payment sum')
                    }, {
                        itemId: 'cancelPaymentBtn',
                        text: i18n.get('Cancel payment')
                    }, {
                        itemId: 'repairPayment',
                        hidden: true,
                        text: i18n.get('Repair payment')
                    }, {
                        itemId: 'correctHistoryBtn',
                        text: i18n.get('Correction history')
                    }, {
                        itemId: 'printReceiptBtn',
                        text: i18n.get('Re-print receipt')
                    }]
                }, {
                    xtype: 'form',
                    frame: true,
                    bodyPadding: 10,
                    buttonAlign: 'center',
                    monitorValid: true,
                    monitorPoll  : 50, 
                    flex: 2,
                    region: 'center',
                    itemId: 'correctionForm',
                    buttons: [{
                        xtype: 'button',
                        itemId: 'correctionApplyBtn',
                        text: i18n.get('Apply')
                    }, {
                        xtype: 'button',
                        itemId: 'correctionCancelBtn',
                        text: i18n.get('Cancel')
                    }],
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'corrtype'
                        },
                        {
                            xtype: 'fieldset',
                            itemId: 'topFieldset',
                            title: i18n.get('Payment information'),
                            defaults: {
                                xtype: 'textfield',
                                anchor: '100%',
                                readOnly: true,
                                cls: 'x-field-body-hide',
                                style: 'font-weight: bold;'
                            },
                            items: [
                                {
                                    xtype: 'hidden',
                                    name: 'record_id',
                                    value: 0
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'agrm_id',
                                    value: 0
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'class_id',
                                    value: 0
                                },
                                {
                                    fieldLabel: i18n.get('Agreement'),
                                    name: 'agrm_num'
                                },
                                {
                                    fieldLabel: i18n.get('Amount'),
                                    name: 'amount'
                                },
                                {
                                    fieldLabel: i18n.get('Payment date'),
                                    name: 'pay_date'
                                },
                                {
                                    fieldLabel: i18n.get('Receipt'),
                                    name: 'receipt'
                                },
                                {
                                    fieldLabel: i18n.get('Manager'),
                                    name: 'mgr_fio'
                                },
                                {
                                    fieldLabel: i18n.get('Comment'),
                                    name: 'comment',
                                    validator: function(val) {
                                        if (!Ext.isEmpty(val)) {
                                            return true;
                                        } else {
                                            return "Value cannot be empty";
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: i18n.get('Parameters'),
                            itemId: 'bottomFieldset',
                            defaults: {
                                allowBlank: false,
                                anchor: '100%'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'newAgrmCtn',
                                    hidden: true,
                                    items: [
                                        Ext.create('OSS.view.Agreements', {
                                            allowBlank: false,
                                            labelWidth: 100,
                                            width: 543,
                                            store: 'Agreements',
                                            name: 'new_agrm_id'
                                        })
                                    ]
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.get('Amount'),
                                    itemId: 'newAmount',
                                    name: 'new_amount'
                                },
                                {
                                    xtype: 'textareafield',
                                    fieldLabel:  i18n.get('Comment'),
                                    itemId: 'correctionComment',
                                    name: 'correction_comment'
                                }
                            ]
                        }
                    ]
                }]
            }, 
            // second card
            {
                xtype: 'grid',
                anchor: '100%',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        text: i18n.get('Back'),
                        itemId: 'gridToFormBtn',
                        iconCls: 'x-ibtn-prev'
                    }]
                }, {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: 'OSS.store.payments.paymentsform.Corrections',
                    displayInfo: true
                }],
                viewConfig: {
                    getRowClass: function(record, index, rowParams) {

                        var revisions = record.get('rev_count'),
                            revno = record.get('rev_no'),
                            canceldate = record.get('cancel_date'),
                            fromagrmid = record.get('from_agrm_id'),
                            bso = record.get('bso_id');

                        if (canceldate != null) {
                        // Аннулированный платеж
                            return 'x-oss-payment-canceled';
                        } else if (revisions > 0 && revno == 0 && canceldate == null) {
                            // Финальная версия корректировки
                            return 'x-oss-payment-edited';
                        } else if (revisions > 0 && revno != 0 && canceldate == null) {
                             // Корректированный платеж
                            return 'x-oss-payment-corrected';
                        } else if (fromagrmid > 0) {
                            //  Перевод средств с другого счета
                            return 'x-oss-payment-transfer';
                        } else if (bso > 0) {
                            // Оплата документа БСО
                            return 'x-oss-payment-bso'
                        } else {
                            return '';
                        }
                    }
                },
                columns: [{
                    xtype:'datecolumn',
                    text: i18n.get('Correction date'),
                    format: 'Y-m-d',
                    dataIndex: 'pay_date',
                    renderer: function(value) {
                        if(!Ext.isEmpty(value)) return Ext.Date.format(value, 'd.m.Y');
                    }
                },{
                    text: i18n.get('Sum'),
                    dataIndex: 'amount'
                },{
                    text: i18n.get('Receipt'),
                    dataIndex: 'receipt',
                    width: 120
                },{
                    text: i18n.get('Manager'),
                    dataIndex: 'mgr_fio',
                    width: 120
                },{
                    xtype:'datecolumn',
                    text: i18n.get('Cancel date'),
                    format: 'Y-m-d',
                    dataIndex: 'cancel_date',
                    renderer: function(value) {
                        if(!Ext.isEmpty(value)) return Ext.Date.format(value, 'd.m.Y');
                    }
                },{
                    text: i18n.get('Outcoming agreement'),
                    dataIndex: 'from_agrm_number',
                    width: 120
                },{
                    text: i18n.get('Current agreement'),
                    dataIndex: 'agrm_num',
                    width: 120
                },{
                    text: i18n.get('Comment'),
                    dataIndex: 'comment',
                    width: 120
                }],
                store: 'OSS.store.payments.paymentsform.Corrections'
            }]
        });

        me.callParent(arguments);
    }

});
