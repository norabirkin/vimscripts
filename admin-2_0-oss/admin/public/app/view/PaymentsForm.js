Ext.define('OSS.view.PaymentsForm', {
    requires: [ 'OSS.ux.grid.Printer' ],
    extend: 'Ext.tab.Panel',
    alias: 'widget.payments_form',
    activeTab: 0,
    
    frame: true,
    plain: true,
    
    initComponent: function() {

        var me = this,
            getCls = function(value, meta, record){
                var revisions = record.data.rev_count,
                    revno = record.data.rev_no,
                    canceldate = record.data.cancel_date,
                    fromagrmid = record.data.from_agrm_id,
                    bso = record.data.bso_id,
                    cls = "";
    
                if (canceldate != null) {
                // Аннулированный платеж
                    cls = 'x-type-payment-canceled';
                } else if (revisions > 0 && revno == 0 && canceldate == null) {
                    // Финальная версия корректировки
                    cls =  'x-type-payment-edited';
                } else if (revisions > 0 && revno != 0 && canceldate == null) {
                     // Корректированный платеж
                    cls =  'x-type-payment-corrected';
                } else if (fromagrmid > 0) {
                    //  Перевод средств с другого счета
                    cls =  'x-type-payment-transfer';
                } else if (bso > 0) {
                    // Оплата документа БСО
                    cls =  'x-type-payment-bso';
                } else {
                    cls =  '';
                }
                return cls;
            },
            paymentRenderer = function(value, meta, record){
                meta.tdCls += ' ' + getCls(value, meta, record);
                return value;
            },
            paymentDataRenderer = function(value, meta, record){
                meta.tdCls += ' ' + getCls(value, meta, record);
                if(!Ext.isEmpty(value)) return Ext.Date.format(value, 'd.m.Y');
                return value;
            };

        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'border',
                    title: i18n.get('Payments'),
                    items: [
                        {
                            xtype: 'gridpanel',
                            region: 'west',
                            split: true, 
                            collapsible: false, 
                            flex: 1,
                            itemId: 'usersGrid',
                            title: i18n.get('Users') + ' / ' + i18n.get('Agreements'), 
                            store: 'OSS.store.payments.paymentsform.Accounts',
                            columns: [{
                                xtype: 'actioncolumn',
                                itemId: 'showPaymentWidgetBtn',
                                width: 25,
                                iconCls: 'x-ibtn-def x-ibtn-money'
                            }, {
                                dataIndex: 'agrm_num',
                                flex: 1,
                                text: i18n.get('Agreement')
                            },{
                                dataIndex: 'name',
                                flex: 1,
                                text: i18n.get('User name'),
                                hidden: true
                            },{
                                dataIndex: 'balance',
                                text: i18n.get('Balance'),
                                width: 90,
                                renderer: function(value, meta, record) {
                                    if (value < 0) {
                                        meta.style += " color: red;";
                                    }
                                    return record.get('formatted_balance') + ' (' + record.get('symbol') + ')';
                                }
                            }, {
                                dataIndex: 'pp_debt',
                                text: i18n.get('Promised payment'),
                                hidden: true,
                                width: 100
                            }, {
                                dataIndex: 'pay_code',
                                text: i18n.get('Payment code'),
                                hidden: true
                            }, {
                                dataIndex: 'oper_name',
                                flex: 1,                                
                                text: i18n.get('Operator'),
                                hidden: true
                            }],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        OSS.Localize.get("Search") + ': ',
                                    {
                                        xtype: 'combobox',
                                        itemId: 'search_field_cmb',
                                        name: 'search_field',
                                        valueField: 'name',
                                        displayField: 'descr',
                                        value: 'name',
                                        width: 150,
                                        xtype: 'combobox',
                                        store: Ext.create( "Ext.data.Store", {
                                            fields: [ 'descr', 'name' ],
                                            data: [
                                                { name: 'name', descr: OSS.Localize.get('Person full name') },
                                                { name: 'agrm_num', descr: OSS.Localize.get('Agreement') },
                                                { name: 'pay_code', descr: OSS.Localize.get('Payment code') },
                                                { name: 'login', descr: OSS.Localize.get('User login') },
                                                { name: 'vg_login', descr: OSS.Localize.get('Account login') },
                                                { name: 'email', descr: OSS.Localize.get('E-mail') },
                                                { name: 'phone', descr: OSS.Localize.get('Phone') },
                                                { name: 'address', descr: OSS.Localize.get('Address') },
                                                { name: 'address_code', descr: OSS.Localize.get('Similar addresses') }
                                            ]
                                        })
                                    },{
                                        xtype: 'textfield',
                                        name: 'search_field_value',
                                        itemId: 'fullsearch_txt',
                                        width: 160
                                    }, {
                                        xtype: 'button',
                                        itemId: 'searchbtn',
                                        iconCls: 'x-ibtn-search',
                                        style: 'margin-left: 4px'/*,
                                        text: OSS.Localize.get('Find')*/
                                    }]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    dock: 'bottom',
                                    store: 'OSS.store.payments.paymentsform.Accounts'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            region: 'center',
                            title: i18n.get('Payments history'),
                            flex: 2,
                            itemId: 'paymentsListGrid',
                            store: 'OSS.store.payments.paymentsform.History',
                            viewConfig: {
                                getRowClass: function(record, index, rowParams) {
                                    var revisions = record.data.rev_count,
                                        revno = record.data.rev_no,
                                        canceldate = record.data.cancel_date,
                                        fromagrmid = record.data.from_agrm_id,
                                        bso = record.data.bso_id;

                                    if (canceldate != null) {
                                    // Аннулированный платеж
                                        return 'x-type-payment-canceled';
                                    } else if (revisions > 0 && revno == 0 && canceldate == null) {
                                        // Финальная версия корректировки
                                        return 'x-type-payment-edited';
                                    } else if (revisions > 0 && revno != 0 && canceldate == null) {
                                         // Корректированный платеж
                                        return 'x-type-payment-corrected';
                                    } else if (fromagrmid > 0) {
                                        //  Перевод средств с другого счета
                                        return 'x-type-payment-transfer';
                                    } else if (bso > 0) {
                                        // Оплата документа БСО
                                        return 'x-type-payment-bso';
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    itemId: '',
                                    width: 25,
                                    iconCls: 'x-ibtn-def x-ibtn-list2',
                                    renderer: paymentRenderer
                                },
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'showCorrectionFormBtn',
                                    width: 25,
                                    iconCls: 'x-ibtn-def x-ibtn-edit',
                                    renderer: paymentRenderer
                                },
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'showUprsBtn',
                                    width: 25,
                                    tooltip: i18n.get('UPRS'),
                                    getClass: function(value, meta, record) {
                                        var iconCls = 'x-ibtn-def x-ibtn-list ';
                                        if(!record.get('is_uprs')) {
                                            iconCls += ' x-ibtn-def-dis';
                                        }
                                        return iconCls;
                                    },
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'amount',
                                    text: i18n.get('Summ'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'order_num',
                                    text: i18n.get('Invoice number'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'pay_date',
                                    format: 'Y-m-d',
                                    text: i18n.get('Payment date'),
                                    renderer: paymentDataRenderer
                                },
                                {
                                    dataIndex: 'local_date',
                                    format: 'Y-m-d',
                                    text: i18n.get('Payment commited'),
                                    renderer: paymentDataRenderer
                                },
                                {
                                    dataIndex: 'class_name',
                                    text: i18n.get('Class of payment'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'receipt',
                                    text: i18n.get('Pay document number'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'mgr_fio',
                                    text: i18n.get('Manager'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'comment',
                                    text: i18n.get('Comment'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'registries',
                                    text: i18n.get('Registry'),
                                    renderer: paymentRenderer
                                },
                                {
                                    dataIndex: 'bso_id',
                                    text: i18n.get('Strict reporting form'),
                                    licid: 'full',
                                    renderer: paymentRenderer
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        ' ',
                                        { 
                                            xtype: 'button', 
                                            text: OSS.Localize.get( 'Operations' ),
                                            itemId: 'actions', 
                                            menu: [{ 
                                                itemId: 'paymentsPrintBtn',
                                                iconCls: 'x-ibtn-print',
                                                text: OSS.Localize.get('Print')
                                            }, {
                                                iconCls: 'x-ibtn-excel',
                                                text: i18n.get('Export'),
                                                menu: [{
                                                    text: OSS.Localize.get('Current page'),
                                                    itemId: 'exportCurrentPageBtn'
                                                }, {
                                                    text: OSS.Localize.get('All'),
                                                    itemId: 'exportAllPagesBtn'
                                                }]
                                            }]
                                        }, { 
                                            xtype: 'tbseparator' 
                                        },
                                        OSS.Localize.get("Search") + ': ', 
                                        {
                                            xtype: 'datefield',
                                            itemId: 'dateFrom',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            value: Ext.Date.format( new Date(), 'Y-m-01')
                                        },
                                        {
                                            xtype: 'datefield',
                                            itemId: 'dateTo',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            value: Ext.Date.add( Ext.Date.getFirstDateOfMonth(new Date()), Ext.Date.MONTH, 1)
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'paymentsSearchBtn',
                                            tooltip: i18n.get('Search'),
                                            iconCls: 'x-ibtn-search'
                                        }  
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    dock: 'bottom',
                                    store: 'OSS.store.payments.paymentsform.History'
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'bottom',
                                    defaults: {
                                        fieldStyle: 'font-size: 11px;padding: 3px; border:1px solid gray;'
                                    },
                                    items: [
                                    '-',
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.get('Revoked'),
                                        hideLabel: true,                                        
                                        fieldCls: 'x-type-payment-canceled'
                                    },
                                    '-',
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.get('Correction'),
                                        hideLabel: true,
                                        fieldCls: 'x-type-payment-corrected'
                                    },
                                    '-',
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.get('Corrected'),
                                        hideLabel: true,
                                        fieldCls: 'x-type-payment-edited'
                                    },
                                    '-',
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.get('Transfered'),
                                        hideLabel: true,
                                        fieldCls: 'x-type-payment-transfer'
                                    },
                                    '-',
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.get('Pay SRF'),
                                        licid: 'full',
                                        hideLabel: true,
                                        fieldCls: 'x-type-payment-bso'
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
