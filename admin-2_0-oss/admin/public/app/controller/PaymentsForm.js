Ext.define('OSS.controller.PaymentsForm', {
    extend: 'Ext.app.Controller',
    requires: ['OSS.ux.grid.CSVExport'],
    getExportUrl: function() { return 'index.php/api/payments/export'; },
    views: [ 
        'PaymentsForm', 
        'payments.paymentsform.Correction',
        'payments.BSO', 
        'payments.print.Standart',
        'payments.print.Negative' 
    ],
    view: 'PaymentsForm',
    
    stores: [ 'OSS.store.payments.paymentsform.Accounts', 'OSS.store.payments.paymentsform.History', 'OSS.store.payments.paymentsform.Corrections' ],
    
    /*
    * List of references
    */
    
    refs: [{
        selector: 'payments_form',
        ref: 'paymentsForm'
    }, {
        selector: 'payments_form > panel #usersGrid',
        ref: 'usersGrid'
    }, {
        selector: 'payments_form > panel #paymentsListGrid',
        ref: 'paymentsGrid'
    }, {
        selector: 'payments_form > panel > #paymentsListGrid > toolbar #dateFrom',
        ref: 'paymentsDateFrom'
    }, {
        selector: 'payments_form > panel > #paymentsListGrid > toolbar #dateTo',
        ref: 'paymentsDateTo'
    }, {
        selector: 'paymentscorrection',
        ref: 'paymentsCorrection'
    }, {
        selector: 'paymentscorrection > panel > form',
        ref: 'correctionForm'
    }, {
        selector: 'paymentscorrection > panel > panel',
        ref: 'correctionButtons'
    }, {
        selector: 'paymentscorrection > panel > form #newAgrmCtn',
        ref: 'newUserContainer'
    }, {
        selector: 'paymentscorrection > panel > form #newAmount',
        ref: 'newAmountField'
    }, {
        selector: 'paymentscorrection > panel > panel #movePaymentBtn',
        ref: 'correctionButtonsFirst'
    }, {
        selector: 'payments_print_standart',
        ref: 'printStandart'
    }],
    
    /* 
    * Initialize
    */
    
    init: function() {
        this.control({
            'payments_form > panel #usersGrid': {
                itemclick: this.loadPaymentsList,
                render: this.onUsersGridRender
            },
            'payments_form > panel > #usersGrid #showPaymentWidgetBtn': {
                click: this.showPaymentWidget
            }, 
            'payments_form > panel > #paymentsListGrid > toolbar #paymentsSearchBtn': {
                click: this.searchPayments
            },
            'payments_form > panel > #paymentsListGrid > toolbar #exportCurrentPageBtn': {
                click: this.exportPaymentsFromAllPages
            },
            'payments_form > panel > #paymentsListGrid > toolbar #exportAllPagesBtn': {
                click: this.exportPaymentsFromCurrentPage
            },
            'payments_form > panel > #paymentsListGrid > toolbar #paymentsPrintBtn': {
                click: this.printData
            },
            'payments_form > panel > #paymentsListGrid #showCorrectionFormBtn': {
                click: this.showCorrectionFrom
            },
            'paymentscorrection > panel > panel #movePaymentBtn': {
                click: this.showMovePaymentForm
            },
            'paymentscorrection > panel > panel #correctPaymentBtn': {
                click: this.showCorrectPaymentForm
            },
            'paymentscorrection > panel > panel #cancelPaymentBtn': {
                click: this.showCancelPaymentForm
            },
            'paymentscorrection > panel > panel #correctHistoryBtn': {
                click: this.showCorrectionHistory
            },
            'paymentscorrection > grid > toolbar #gridToFormBtn': {
                click: this.backToTheForm
            }, 
            'paymentscorrection > panel > form #correctionCancelBtn': {
                click: this.correctionCancel
            }, 
            'paymentscorrection > panel > form #correctionApplyBtn': {
                click: this.correctionApply
            },
            'paymentscorrection > panel > panel #printReceiptBtn': {
                click: this.printReceipt
            },
            'payments_form > panel > #usersGrid > toolbar #searchbtn': {
                click: this.refreshUsersGrid
            },
            'payments_form > panel > #usersGrid > toolbar #fullsearch_txt': {
                specialkey: this.applyFilterOnEnterPressed
            }
        });
    },


    onUsersGridRender: function(grid) { // Выбор заново записи, которая была выбрана в гриде до обновления стора
        var store = grid.getStore();

        store.on('beforeload', function() {
            if (this.getSelectionModel().getSelection().length > 0) {
                this.lastSelectedRecord = {
                    index: this.getSelectionModel().getSelection()[0].index,
                    agrm_id: this.getSelectionModel().getSelection()[0].get('agrm_id')
                };
            } else {
                this.lastSelectedRecord = {
                    index: -1,
                    agrm_id: -1
                }
            }
            
        }, grid);

        store.on('load', function(store) {
            // проверка, чтобы выбор не сработал, если на прежнем месте оказалась запись с другим agrm_id (например, в результате фильтрации поиском)
            if (this.lastSelectedRecord.index >= 0 && store.getAt(this.lastSelectedRecord.index).get('agrm_id') == this.lastSelectedRecord.agrm_id) {
                this.getSelectionModel().select(this.lastSelectedRecord.index);
            }
        }, grid);
        store.load();
    },
    
    applyFilterOnEnterPressed: function(f, e) {
        if (e.getKey() == e.ENTER) {
            this.refreshUsersGrid(f);
        }
    },

    
    /*
    * Loading payments history by clicking "Search" btn in toolbar or clicking on Agreement's (left) grid row.
    * Followed parameters not in use
    *
    * @param object grid
    *
    * @param object record
    *
    * @param object item
    *
    */
    
    loadPaymentsList: function( grid, record, item, z, event ) {
        if(!Ext.isEmpty(event) && event.getTarget('.x-ibtn-def')) {
            return;
        }
        if(Ext.isEmpty( this.getUsersGrid().getSelectionModel().getSelection() )) return; // nothing was selected
        
        var record = this.getUsersGrid().getSelectionModel().getSelection();
        var params = {
            agrm_id: record[0].data.agrm_id,
            date_from: this.getPaymentsDateFrom().getValue(),
            date_to: this.getPaymentsDateTo().getValue()
        };
        this.getPaymentsGrid().getStore().proxy.extraParams = params;
        this.getPaymentsGrid().getStore().loadPage(1);
    },
    
    
    /*
    * Search button press. Method call previous loadPaymentsList
    *
    * @param object Btn
    *
    */
    
    searchPayments: function(Btn) {
        this.loadPaymentsList();
    },
    
    
    /*
    * Show payments correction form. Correct payments here.
    *
    * @param object view
    *
    * @param object cell
    *
    * @param int rowIndex
    *
    * @param int cellIndex
    *
    * @param object event
    *
    * @param object record
    *
    */
    
    showCorrectionFrom: function(view, cell, rowIndex, cellIndex, event, record) {
        //
        //revisions = rev_count
        //revno = rev_no
        //canceldate = cancel_date
        //fromagrmid = from_agrm_id
        //bso  = bso_id
       var corrections = Ext.create('OSS.view.payments.paymentsform.Correction');
       var data = record.data;
       // add some values
       data.agrm_num = this.getUsersGrid().getSelectionModel().getSelection()[0].data.agrm_num;
       data.new_amount = data.amount;
       data.pay_date = Ext.util.Format.date(data.pay_date , 'd.m.Y H:i');
       
       //set values to form and load window
       this.getCorrectionForm().getForm().setValues(data);
       this.showMovePaymentForm(this.getCorrectionButtonsFirst());
       corrections.show();
    },
    
    
    /*
    * Press "Transfer payment": change button state to Pressed, set win title, set form objects
    *
    * @param object Btn
    *
    */
    
    showMovePaymentForm: function(Btn) {
        this.unToggle(Btn);
        this.setTitleByClickButton(Btn);
        this.getCorrectionForm().getForm().findField('corrtype').setValue('1');
        this.getNewAmountField().setValue( this.getCorrectionForm().getForm().findField('amount').getValue() ); // set default value
        this.getNewUserContainer().show();
        this.getNewAmountField().setReadOnly(true);
    },
    
    
    /*
    * Press "Correct payment sum": change button state to Pressed, set win title
    *
    * @param object Btn
    *
    */
    
    showCorrectPaymentForm: function(Btn) {
        this.unToggle(Btn);
        this.getCorrectionForm().getForm().findField('corrtype').setValue('2');
        this.getNewAmountField().setValue( this.getCorrectionForm().getForm().findField('amount').getValue() ); // set default value
        this.setTitleByClickButton(Btn);
        this.getNewAmountField().setReadOnly(false);
    },
    
    
    /*
    * Press "Cancel payment": change button state to Pressed, set win title
    *
    * @param object Btn
    *
    */
    
    showCancelPaymentForm: function(Btn) {
        this.unToggle(Btn);
        this.getCorrectionForm().getForm().findField('corrtype').setValue('4');
        this.getNewAmountField().setValue( this.getCorrectionForm().getForm().findField('amount').getValue() ); // set default value
        this.getNewAmountField().setReadOnly(false);
        this.setTitleByClickButton(Btn);
    },
    
    
    /*
    * Press "Repair payment": change button state to Pressed, set win title. Btn available only for canceled payments
    *
    * @param object Btn
    *
    */
    
    showRepairPaymentForm: function(Btn) {
        this.unToggle(Btn);
        this.getCorrectionForm().getForm().findField('corrtype').setValue('5');
        this.getNewAmountField().setReadOnly(false);
        this.setTitleByClickButton(Btn);
    },
    
    
    /*
    * Press "Correction history": change button state to Pressed, set win title, show and load corrections grid
    *
    * @param object Btn
    *
    */
    
    showCorrectionHistory: function(Btn) {
        this.unToggle(Btn);
        this.setTitleByClickButton(Btn);
        this.getPaymentsCorrection().getLayout().setActiveItem(1);
        this.getPaymentsCorrection().getLayout().getActiveItem().getStore().load({
            params: {
                record_id: this.getCorrectionForm().getForm().findField('record_id').getValue()
            }
        });
    },
    
    
    /*
    * Changing button "pressed" state for all buttons in Corrections form
    *
    * @param object Btn
    *
    */
    
    unToggle: function(Btn) {
        if(!Btn.pressed) Btn.toggle();
        this.getCorrectionButtons().items.each(function(button){
            if(button.itemId != Btn.itemId && button.pressed == true) button.toggle();
        });
    },
    
    
    /*
    * Comming back from payment correction's history grid to window main form
    *
    * @param object Btn
    *
    */
    
    backToTheForm: function(Btn) {
        var button = this.getCorrectionButtonsFirst();
        this.unToggle(button);
        this.setTitleByClickButton(button);
        this.getNewUserContainer().show();
        this.getPaymentsCorrection().getLayout().setActiveItem(0);
    },
    
    
    /*
    * Set window title with default title plus current button's title. Hiding some form objects
    *
    * @param object button
    *
    */
    
    setTitleByClickButton: function(button) {
        this.getPaymentsCorrection().setTitle(this.getWinTitle() + ': ' + button.text);
        this.getNewUserContainer().hide();
    },
    
    
    /*
    * Just return default window title
    *
    */
    
    getWinTitle: function() {
        return i18n.get('Corrections');
    },
    
    /*
    * Print payments grid - opening grid in new window ready to print
    *
    */
    printData: function() {
        var grid = this.getPaymentsGrid();
        OSS.ux.grid.Printer.print(grid);
    },
    
    printReceipt: function() {
        this.getView("payments.print.Standart").create();
        this["getPrintStandart"]().show();
        Ext.app.Application.instance.getController('Payments').lastPaymentsParams = {
            agrmid: this.getCorrectionForm().getForm().findField('agrm_id').getValue(),
            payment_type: this.getCorrectionForm().getForm().findField('class_id').getValue(),
            payment_sum: this.getCorrectionForm().getForm().findField('amount').getValue(),
            pay_id: this.getCorrectionForm().getForm().findField('record_id').getValue()
        };
    },
    
    
    showPaymentWidget: function() {
        var record = arguments[5];
        Ext.app.Application.instance.getController('Payments').showPanel({ 
            uid: record.get('uid'),
            agrm_id: record.get('agrm_id'), 
            agrm_num: record.get('agrm_num'),
            agrm: record,
            callbackOnClose: this.updateBalanceForAgreement
        });
    },
    
    
    
    
    correctionApply: function(Btn) {
        var params = Btn.up('form').getForm().getValues();
        Ext.Ajax.request({
            url: 'index.php/api/payments/correctPayment',
            method: 'POST',
            params: params,
            msg: true,
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }
                var data = response.results;
                this.getPaymentsGrid().getStore().reload();
            },
            scope: this
        });
    },
    
    correctionCancel: function(Btn) {
        this.getPaymentsCorrection().close();
    },
    
    /*
    * Переделанные методы из файла ux.grid.CVSExport
    * Реализация файла предполагает вынос каждого grid в отдельный файл, 
    * что не является актуальным в рамках работы с гридами PaymentsForm
    */
    
    exportPaymentsFromCurrentPage: function() {
        OSS.Download.get({
            url: 'index.php/api/payments/export',
            params: Ext.apply(
                {
                    limit: this.getPaymentsGrid().getStore().pageSize, 
                    page: this.getPaymentsGrid().getStore().currentPage,
                    columns: Ext.JSON.encode(this.getColumnsForExport())
                }, 
                this.getPaymentsGrid().getStore().proxy.extraParams
            )
        });
    },
    
    exportPaymentsFromAllPages: function() {
        OSS.Download.get({
            url: 'index.php/api/payments/export',
            params: Ext.apply(
                {
                    alldata: 1,
                    columns: Ext.JSON.encode(this.getColumnsForExport())
                },
                this.getPaymentsGrid().getStore().proxy.extraParams
            )
        });
    },
    
    getColumnsForExport: function() {
        var i,
            fields = [],
            names = [];
        for (i = 0; i < this.getPaymentsGrid().columns.length; i ++) {
            if ( !this.getPaymentsGrid().columns[i].hidden && this.getPaymentsGrid().columns[i].dataIndex ) {
                fields.push(this.getPaymentsGrid().columns[i].dataIndex);
                names.push(this.getPaymentsGrid().columns[i].text);
            }
        }
        return { names: names, fields: fields };
    },


    refreshUsersGrid: function(){
        this.getUsersGrid().getDockedItems('toolbar')[0].refreshGrid();
    },


    updateBalanceForAgreement: function(record) {
        var cntr = Ext.app.Application.instance.getController('PaymentsForm');
        cntr.loadPaymentsList(null, record);
        cntr.refreshUsersGrid();
    }
        
});
