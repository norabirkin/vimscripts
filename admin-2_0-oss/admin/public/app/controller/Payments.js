Ext.define('OSS.controller.Payments', {
    extend: 'OSS.controller.Tabs',
    getMainPanelAlias: function() { return 'payments'; },
    requires: [
        'OSS.ux.button.SaveButton',
        'OSS.ux.button.Find',
        'OSS.ux.button.sprite.List',
        'OSS.helpers.payments.Check',
        'OSS.helpers.payments.check.IE',
        'OSS.helpers.payments.check.Gecko'
    ],
    views: [ 
        'Agreements',
        'payments.tabs.Payment',
        'payments.tabs.fields.DocumentNumber',
        'payments.tabs.fields.Class',
        'payments.tabs.Promised',
        'payments.tabs.history.Payments',
        'payments.tabs.Transfer',
        'payments.tabs.history.Promised',
        'payments.Tabs',
        'Payments', 
        'payments.BSO', 
        'payments.print.Standart',
        'payments.print.Negative'
    ],
    stores: [
        "Agreements", 
        'payments.Classes',
        "payments.Managers",
        "payments.history.Payments",
        "payments.history.Promised",
        'payments.agreements.Transfer'
    ],
    refs: [{
        selector: 'payments > #tabs > #payment',
        ref: 'payment'
    }, {
        selector: 'payments > #tabs > #payment > toolbar > #save',
        ref: 'savePaymentButton'
    }, {
        selector: 'payments > #tabs > #payment > toolbar > #x',
        ref: 'xReportBtn'
    }, {
        selector: 'payments > #tabs > #payment > toolbar > #z',
        ref: 'zReportBtn'
    }, {
        selector: 'payments > #tabs > #promised',
        ref: 'promised'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > #balance',
        ref: 'balance'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > datefield[name=pay_date]',
        ref: 'payDate'
    }, {
        selector: 'payments > #tabs > #transfer > fieldset > datefield[name=pay_date]',
        ref: 'transferPayDate'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > #payment_number > textfield',
        ref: 'paymentNumber'
    }, {
        selector: 'payments > #tabs > #transfer > fieldset > #payment_number > textfield',
        ref: 'transferNumber'
    }, {
        selector: 'bso',
        ref: 'BSO'
    }, {
        selector: 'bso > gridpanel',
        ref: 'BSOGrid'
    }, {
        selector: 'bso > gridpanel > toolbar > combo[name=set]',
        ref: 'BSOSets'
    }, {
        selector: 'bso > gridpanel > toolbar > textfield[name=number]',
        ref: 'BSONumber'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > #bso > #number',
        ref: 'BSONumberTextField'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > #bso > button',
        ref: 'BSOButton'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > hidden[name=setid]',
        ref: 'BSOSetId'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > combo[name=person_id]',
        ref: 'managers'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > hidden[name=docid]',
        ref: 'BSODocId'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > numberfield[name=payment_sum]',
        ref: 'paymentSum'
    }, {
        selector: 'payments > #tabs > #promised > fieldset > numberfield[name=promised_sum]',
        ref: 'promisedSum'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > numberfield#newbalance',
        ref: 'newBalance'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > combo[name=classid]',
        ref: 'classes'
    }, {
        selector: 'payments > #tabs > #transfer > fieldset > combo[name=classid]',
        ref: 'transferClasses'
    }, {
        selector: 'payments_print_standart',
        ref: 'printStandart'
    }, {
        selector: 'payments_print_negative',
        ref: 'printNegative'
    }, {
        selector: 'payments_print[hidden=false]',
        ref: 'print'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > combo#payment_type',
        ref: 'paymentType'
    }, {
        selector: 'payments > #tabs > #promised > fieldset > #datetill',
        ref: 'dateTill'
    }, {
        selector: 'payments > #tabs > #promised > fieldset > #min',
        ref: 'min'
    }, {
        selector: 'payments > #tabs > #promised > fieldset > #max',
        ref: 'max'
    }, {
        selector: 'payments > #tabs > #promised > fieldset > #allowed_debt',
        ref: 'allowedDebt'
    }, {
        selector: 'payments > #tabs > #payments_history > toolbar',
        ref: 'paymentsHistoryToolbar'
    }, {
        selector: 'payments > #tabs > #transfer',
        ref: 'transfer'
    }, {
        selector: 'payments > #tabs > #transfer > fieldset > numberfield[name=payment_sum]',
        ref: 'transferSum'
    }, {
        selector: 'payments > #tabs > #promised_history',
        ref: 'promisedHistory'
    }, {
        selector: 'payments > #tabs > #promised > toolbar > #save',
        ref: 'promisedPaymentSaveButton'
    }, {
        selector: 'payments > #tabs > #payments_history',
        ref: 'paymentsHistory'
    }, {
        selector: 'payments > #tabs > #payment > fieldset > #payment_number',
        ref: 'paymentPaymentFormat'
    }, {
        selector: 'payments > #tabs > #transfer > fieldset > #payment_number',
        ref: 'transferPaymentFormat'
    }],
    init: function() {
        this.control({
            'payments': {
                destroy: this.onPaymentFormClose
            },
            'payments > #tabs > #transfer > toolbar > #save': {
                click: this.transfer
            },
            'payments > #tabs > #payment > toolbar > #save': {
                click: this.savePayment
            },
            'payments > #tabs > #promised > toolbar > #save': {
                click: this.savePromisedPayment
            },
            'payments > #tabs > #payment > fieldset > #bso > button': {
                click: this.openBSOGrid
            },
            'bso > gridpanel > toolbar > combo[name=set]': {
                change: this.loadBSOStore
            },
            'bso > gridpanel > toolbar > button#find': {
                click: this.loadBSOStore
            },
            'bso > gridpanel > toolbar > button#choose': {
                click: this.BSOChoose
            },
            'bso > gridpanel > toolbar > button#cancel': {
                click: this.BSOCancel
            },
            'payments > #tabs > #payment > fieldset > numberfield[name=payment_sum]': {
                change: this.setNewPaymentBalance
            },
            'payments > #tabs > #payment > fieldset > #balance': {
                change: this.setNewPaymentBalance
            },
            'payments > #tabs > #payment > fieldset > numberfield#newbalance': {
                change: this.setPaymentSum
            },
            'payments_print > toolbar > #cancel': {
                click: this.closePrintWindow
            },
            'payments_print_standart > toolbar > #standart': {
                click: this.printStandart
            },
            'payments_print_negative > toolbar > #return': {
                click: this.printReturn
            },
            'payments_print_negative > toolbar > #withdrawal': {
                click: this.printWithdrawals
            },
            'payments > #tabs > #payment': {
                tabactivated: this.loadRecomendedSum,
                agreementchanged: this.paymentAgreementChanged
            },
            'payments > #tabs > #promised': {
                tabactivated: this.loadPromisedPaymentSettings,
                agreementchanged: this.clearPromisedPaymentSettings
            },
            'payments > #tabs > #payments_history > toolbar > #download > #current': {
                click: this.exportCurrentPage
            },
            'payments > #tabs > #payments_history > toolbar > #download > #all': {
                click: this.exportAll
            },
            'payments > #tabs > #payment > toolbar > #x': {
                click: this.xReport
            },
            'payments > #tabs > #payment > toolbar > #z': {
                click: this.zReport
            },
            'payments > #tabs > #transfer': {
                tabactivated: 'onTransferTabActivated',
                agreementchanged: 'setAgreementsForTransferParams'
            }
        });
        this.callParent( arguments );
    },
    paymentAgreementChanged: function() {
        this.getPayment().getForm().isValid();
        this.clearRecomendedSum();
    },
    onTransferTabActivated: function() {
        this.getTransfer().getForm().isValid();
        this.setAgreementsForTransferParams();
    },
    setAgreementsForTransferParams: function() {
        this.getPaymentsAgreementsTransferStore().addExtraParams({
            exclude_agrms: this.getAgreements().getValue()
        });
    },
    onPaymentFormClose: function(){
        this.clearRecomenderdSumTip();
        this.callbackOnClose(this.agrm);
    },
    clearRecomenderdSumTip: function() {
        this.recomendedPaymentTip = null;
    },
    report: function(a, b) {
        return;
        var data = [ a + ';1;;;;' + this.managerInfo.externalid + ';' + this.managerInfo.fio + ';;;' ],
            file = b + '-' + Ext.Date.format(new Date(), 'YmdHis') + '.xte';
        this.getCheckHelper().setFileName( file );
        this.getCheckHelper().save( data );
    },
    xReport: function() {
        this.report( 3, 'x' );
    },
    zReport: function() {
        this.report( 4, 'z' );
    },
    getCheckHelper: function() {
        if (!this.checkHelper) {
            this.checkHelper = Ext.create('OSS.helpers.payments.Check', {
                testMode: {
                    isWindows: true,
                    isIE: true,
                    isGecko: false
                }
            }).factory();
        }
        return this.checkHelper;
    },
    exportAll: function() {
        this.getPaymentsHistory().exportAll();
    },
    exportCurrentPage: function() {
        this.getPaymentsHistory().exportCurrentPage();
    },
    validateDocumentNumber: function( value ) {
        var message = OSS.Localize.get('Invalid document number');
        if (this.documentNumberTemplate) { 
            if (this.documentNumberTemplate.test(value)) {
                return true;
            } else {
                return message;
            }
        } else {
            return message;
        }
    },
    getNumberColumnText: function( value ) {
        return this.getBSOSets().getRawValue() + ' / ' + value;
    },
    clearRecomendedSum: function() {
        this.recomendedSum = null;
        if (this.getTabs().getActiveTab().getItemId() == "payment") {
            this.loadRecomendedSum();
        }
    },
    loadRecomendedSum: function() {
        if (!this.recomendedSum) {
            Ext.Ajax.request({
                url: 'index.php/api/payments/recomended',
                method: 'POST',
                params: { agrm_id: this.getAgreements().getValue() },
                success: function() {
                    var response = Ext.JSON.decode(arguments[0].responseText);
                    if (!response.success) {
                        return;
                    }
                    this.recomendedSum = response.results;
                    this.onRecomendedSumLoaded();
                },
                scope: this
            });
        }
    },
    onRecomendedSumLoaded: function() {
        if (!this.recomendedPaymentTip) {
            this.recomendedPaymentTip = Ext.create( 'Ext.tip.ToolTip', {
                target: this.getPaymentSum().el.dom,
                trackMouse: true,
                renderTo: Ext.getBody(),
                showDelay: 100,
                hideDelay: 0
            });
        }
        this.recomendedPaymentTip.update( OSS.Localize.get('Recomended sum: {sum} {symbol}', {'{sum}': this.recomendedSum, '{symbol}': this.symbol}) );
    },
    clearPromisedPaymentSettings: function() {
        this.promisedPaymentSettings = null;
        if (this.getTabs().getActiveTab().getItemId() == "promised") {
            this.loadPromisedPaymentSettings();
        }
    },
    loadPromisedPaymentSettings: function() {
        if (!this.promisedPaymentSettings) {
            this.getPromisedPaymentSaveButton().formBind = true;
            Ext.Ajax.request({
                url: 'index.php/api/promised/settings',
                method: 'POST',
                params: { agrm_id: this.getAgreements().getValue() },
                success: function() {
                    var response = Ext.JSON.decode(arguments[0].responseText);
                    if (!response.success) {
                        return;
                    }
                    this.promisedPaymentSettings = response.results;
                    this.onPromisedPaymentSettingsLoad();
                },
                scope: this
            });
        }
    },
    onPromisedPaymentSettingsLoad: function() {
        this.getDateTill().setValue(
            Ext.Date.format(Ext.Date.add(
                new Date(), 
                Ext.Date.DAY, 
                this.promisedPaymentSettings.till
            ), 'Y-m-d')
        );
        this.getMax().setValue(this.promisedPaymentSettings.max);
        this.getMin().setValue(this.promisedPaymentSettings.min);
        this.getPromisedSum().setMinValue(this.promisedPaymentSettings.min);
        this.getPromisedSum().setMaxValue(this.promisedPaymentSettings.max);
        this.getAllowedDebt().setValue(this.promisedPaymentSettings.limit * -1);
        if (this.promisedPaymentSettings.promised_exists || !this.promisedPaymentSettings.available) {
            this.maskPromisedPayment(true);
        } else { 
            this.maskPromisedPayment(false);
            if (this.getPromised().getForm().isValid()) {
                this.getPromisedPaymentSaveButton().enable();
            }
        }
    },
    maskPromisedPayment: function(state) {
        if (state) {
            this.getPromised().getEl().mask(i18n.get('Service is unavailable'), 'x-mask-msg-no-image');
        } else {
            this.getPromised().getEl().unmask();
        }
    },
    printCheck: function( type ) {
        var params = Ext.apply({ ptype: type }, this.lastPaymentsParams);
        //console.log(params);
        Ext.Ajax.request({
            url: 'index.php/api/payments/salescheck',
            method: 'POST',
            params: params,
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                //console.log(response);
                if (!response.success) {
                    return;
                }
                this.getCheckHelper().setFileName( "pm-" + this.lastPaymentsParams.pay_id + ".xte" );
                this.getCheckHelper().save( response.results );
            },
            scope: this
        });
    },
    printReturn: function() {
        this.printCheck( 2 );
        this.getPrintNegative().close();
    },
    printWithdrawals: function() {
        this.printCheck( 6 );
        this.getPrintNegative().close();
    },
    printStandart: function() {
        this.printCheck( 1 );
        this.getPrintStandart().close();
    },
    closePrintWindow: function() {
        this.getPrint().hide();
    },
    setPaymentSum: function() {
        if (this.dontSetPaymentSum) {
            this.dontSetPaymentSum = false;
            return;
        }
        this.dontSetNewPaymentBalance = true;
        this.getPaymentSum().setValue( (this.getNewBalance().getValue() * 1) - (this.getBalance().getValue() * 1) );
    },
    setNewPaymentBalance: function() {
        if (this.dontSetNewPaymentBalance) {
            this.dontSetNewPaymentBalance = false;
            return;
        }
        this.dontSetPaymentSum = true;
        this.getNewBalance().setValue( (this.getPaymentSum().getValue() * 1) + (this.getBalance().getValue() * 1) );
    },
    BSOChoose: function() {
        var selection = this.getBSOGrid().getSelectionModel().getSelection(),
            record;
        if ( selection.length === 1 ) {
            record = selection[0];
            this.getBSONumberTextField().setValue( this.getNumberColumnText(record.get('number')) );
            this.getBSODocId().setValue( record.get('record_id') );
            this.getBSOSetId().setValue( this.getBSOSets().getValue() );
            this.getBSO().hide();
        }
    },
    BSOCancel: function() {
        this.getBSO().hide();
    },
    loadBSOStore: function() {
        var store = this.getBSOGrid().getStore(),
            bsoSet = this.getBSOSets().getValue();
        if ( bsoSet ) {
            store.proxy.extraParams.code = this.getBSONumber().getValue();
            store.setItemId( bsoSet );
            store.load();
        }
    },
    openBSOGrid: function() {
        if (!this.getBSO()) {
            this.getView('payments.BSO').create();
        }
        this.getBSO().show();
    },
    getPrintType: function() {
        if (this.getPaymentSum().getValue() > 0) {
            return "Standart";
        } else {
            if (this.getPaymentSum().getValue() < 0) {
                return "Negative";
            }
        }
    },
    showPrintWindow: function() {
        var type = this.getPrintType();
        this.getView("payments.print." + type ).create();
        this["getPrint" + type]().show();
    },
    setLastPaymentsParams: function( pay_id ) {
        this.lastPaymentsParams = {
            agrmid: this.getAgreements().getValue(),
            payment_type: this.getPaymentType().getValue(),
            payment_sum: this.getPaymentSum().getValue(),
            pay_id: pay_id
        };
    },
    resetFormField: function( names, form ) {
        var query = [],
            i,
            fields;
        for (i = 0; i < names.length; i ++) {
            query.push( 'field[name=' + names[i] + ']' );
        }
        query = query.join(', ');
        fields = form.query( query );
        for (i = 0; i < fields.length; i ++) {
            fields[i].setValue(null);
        }
    },
    resetTransferFormFields: function( names ) {
        this.resetFormField( names, this.getTransfer() );
    },
    resetPaymentFormFields: function( names ) {
        this.resetFormField( names, this.getPayment() );
    },
    checkSavingEnabled: function() {
        return false;
        return this.managerInfo.externalid && this.managerInfo.externalid > 0 && this.managerInfo.cashregisterfolder && this.managerInfo.cashregisterfolder != '';
    },
    onPaymentSaved: function() {
        var response = Ext.JSON.decode(arguments[0].responseText);
        this.getPaymentsHistoryPaymentsStore().setDataInvalid();
        this.getPaymentsHistoryPromisedStore().setDataInvalid();
        this.clearPromisedPaymentSettings();
        this.setLastPaymentsParams(response.results.pay_id);
        if (response.results.bso_error != 0) {
            Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get('Payment was done, but failed to bind to the payment form') + ' ' + response.results.bso_error);
        }
        if (this.checkSavingEnabled()) {
            this.showPrintWindow();
        } else {
            OSS.ux.HeadMsg.show(i18n.get('Request done successfully'));
        }
        this.dontSetNewPaymentBalance = true;
        this.getPaymentSum().setValue(0);
        this.dontSetNewPaymentBalance = true;
        this.setBalance( this.getNewBalance().getValue() );
        this.dontSetPaymentSum = true;
        this.getNewBalance().setValue(0);
        this.resetPaymentFormFields([ 'setid', 'docid', 'docdescr', 'payment_number', 'payment_comment' ]);
    },
    savePromisedPayment: function() {
        var params = this.getPromised().getValues(); 
        params.agrm_id = this.getAgreements().getValue();
        Ext.Ajax.request({
            url: 'index.php/api/promised',
            method: 'POST',
            params: params,
            msg: true,
            success: this.onPromisedSaved,
            scope: this
        });
    },
    onPromisedSaved: function() {
        this.getPaymentsHistoryPromisedStore().setDataInvalid();
        this.getPromisedSum().setValue(0);
        this.promisedPaymentSettings.promised_exists = true;
    },
    onTransfer: function() {
        this.getPaymentsHistoryPaymentsStore().setDataInvalid();
        this.setBalance( this.getBalance().getValue() - this.getTransferSum().getValue() );
        this.resetTransferFormFields(['payment_comment', 'payment_sum']);
    },
    transfer: function() {
        var params = this.getTransfer().getValues(); 
        params.agrm_id = this.getAgreements().getValue();
        Ext.Ajax.request({
            url: 'index.php/api/payments',
            method: 'POST',
            params: params,
            msg: true,
            success: this.onTransfer,
            scope: this
        });
    },
    savePayment: function() {
        var params = this.getPayment().getValues(); 
        params.agrm_id = this.getAgreements().getValue();
        Ext.Ajax.request({
            url: 'index.php/api/payments',
            method: 'POST',
            params: params,
            success: this.onPaymentSaved,
            scope: this
        });
    },
    displayPaymentFormat: function() {
        var i,
            fields = [
                this.getPaymentPaymentFormat(),
                this.getTransferPaymentFormat()
            ];
        if (OSS.component.Profile.get('payment_format')) {
            for (i = 0; i < fields.length; i ++) {
                fields[i].updateFormat(OSS.component.Profile.get('payment_format'));
            }
        }
    },
    onManagerInfoLoaded: function( results ) {
        if (Ext.isEmpty(this.managerInfo) ||Ext.isEmpty(this.managerInfo.bso) || this.managerInfo.bso < 2) {
            this.getBSOButton().disable();
        }
        if ( !this.checkSavingEnabled() ) {
            this.getXReportBtn().disable();
            this.getZReportBtn().disable();
        }
    },
    getManagerInfo: function() {
        this.onManagerInfoLoaded();
    },
    onOptionsLoaded: function() {
        var datefields = [this.getTransferPayDate(), this.getPayDate()],
            i;
        for (i = 0; i < datefields.length; i ++) {
            datefields[i].setMinValue( this.options.lock_period );
            if (this.options.payments_cash_now === "1") {
                datefields[i].setReadOnly( true );
            }
        }
    },
    getOptions: function() {
        if (!this.options) {
            Ext.Ajax.request({
                url: 'index.php/api/settings',
                params: { group: '3,5', form: 1 },
                method: 'GET',
                success: function( response ) {
                    response = Ext.JSON.decode(response.responseText);
                    this.options = response.results; 
                    this.onOptionsLoaded();
                },
                scope: this
            });
        } else {
            this.onOptionsLoaded();
        }
    },
    doShowPayments: function( params ) {
        this.openWindow( params );
        this.getOptions();
        this.getManagerInfo();
        this.paymentFormatInit();
        OSS.component.Profile.onChanged('payment_format', this.paymentFormatInit, this);
        this.setDefaultClasses();
        if (!this.getAgreements().getValue()) {
            this.getTabs().disable();
        }
    },
    paymentFormatInit: function() {
        this.documentNumberTemplate = new RegExp('^' + OSS.component.Profile.get('payment_format_regexp') + '$');
        this.displayPaymentFormat();
        this.getPaymentNumber().isValid();
        this.getTransferNumber().isValid();
    },
    reloadClasses: function() {
        this.getPaymentsClassesStore().load({
            callback: this.setDefaultClasses,
            scope: this
        });
    },
    setDefaultClasses: function() {
        var class_id;
        if (!this.getClasses() || !this.getTransferClasses()) {
            return;
        }
        class_id = this.getPaymentsClassesStore().findRecord('default', true, 0, false, true, true).get('class_id'); 
        this.getClasses().setValue(class_id);
        class_id = this.getPaymentsClassesStore().findRecord('default_transfer', true, 0, false, true, true).get('class_id'); 
        this.getTransferClasses().setValue(class_id);
    },
    showPanel: function( params ) {
        if (params.agrm) {
            this.agrm = params.agrm;
        }
        if (params.onBalanceChanged) {
            this.onBalanceChanged = params.onBalanceChanged;
        } else {
            this.onBalanceChanged = function(balance) {
            };
        }
        if (params.callbackOnClose) {
            this.callbackOnClose = params.callbackOnClose;
        } else {
            this.callbackOnClose = function() {
            };
        }
        if (this.getPaymentsClassesStore().getCount() > 0) {
            this.doShowPayments(params);
        } else {
            this.getPaymentsClassesStore().load({ callback: Ext.bind(this.doShowPayments, this, arguments) });
        }
    },
    setBalance: function( balance ) {
        var fields = this.getTabs().query( "#balance" ),
            i;
        for (i = 0; i < fields.length; i ++) {
            fields[i].setValue( Ext.Number.toFixed(parseFloat(balance), 2) );
        }
        this.onBalanceChanged(balance);
    },
    beforeTabsEnabled: function( record, value ) {
        if ( record ) {
            this.getMainPanel().setTitle( OSS.Localize.get('Payments') + ' (' + OSS.Localize.get('Agreement') + ': ' + record.get('agrm_num') + ')' );
            this.setBalance( record.get('balance') );
            this.symbol = record.get('symbol');
            var currency = ' (' + OSS.Localize.get('Currency') + ': ' + this.symbol + ')';
            this.getPayment().setTitle( OSS.Localize.get('Payment') + currency );
            this.getPromised().setTitle( OSS.Localize.get('Promised payment') + currency );
        }
    }
});
