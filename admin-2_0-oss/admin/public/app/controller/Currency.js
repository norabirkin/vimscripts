Ext.define("OSS.controller.Currency", {
    extend: 'Ext.app.Controller',
    views: [
        'currency.Grid',
        'currency.Panel',  
        'Currency',
        'currency.CurrencyForm',
        'currency.CurrencyRateForm'
    ],
    view: 'Currency',
    stores: [
        'currency.Grid',
        'currency.Rates',
        'currency.Codes'
    ],
    refs: [{
        selector: 'osscurrenciesgrid',
        ref: 'currenciesGrid'
    },{
        selector: 'osscurrenciespanel',
        ref: 'currenciesPanel'
    }, {
        selector: 'currencyform > #windowForm', // window with form
        ref: 'windowForm'
    }],
    init: function() {
        this.control({
            'osscurrenciesgrid': {
                afterrender:   this.initCurrencyTree,
                select:        this.showCurrencyRate
            },
            'currency > toolbar > #actions > menu > #delCurrBtn': {
                click: this.deleteCurrency
            },
            'currency > toolbar > #actions > menu > #addCurrBtn': {
                click: this.addCurrency
            },
            'currency > toolbar > #nextMonthBtn': {
                click: this.showNextMonth
            },
            'currency > toolbar > #prevMonthBtn': {
                click: this.showPrevMonth
            },
            'currency > toolbar > #actions > menu > #editCurrBtn': {
                click: this.editCurrency
            },
            'currencyform': {
                beforeshow: this.onShowCurrencyForm
            },
            'currencyform > toolbar > button#formSaveBtn': {
                click: this.SaveCurrency
            },
            'currencyrateform > toolbar > button#formSaveBtn': {
                click: this.SaveCurrencyRate
            },
            'osscurrenciespanel': {
                cellclick:   this.showCurrencyRateForm,
                itemmouseenter: this.cellMouseOver
            },
            'currencyrateform': {
                beforeshow: this.onShowCurrencyRateForm
            }
        });
    },
    
    /**
     * Launch main view
     */     
    initCurrencyTree: function() {

        // Select first currency after store load
        this.getCurrencyGridStore().on('load', function(){
            this.getCurrenciesGrid().getSelectionModel().select(0);
        }, this);

        this.getCurrencyGridStore().load();
    },

    /**
     * Load table of currency rates
     */     
    showCurrencyRate: function(grid, record, index) {
        this.getCurrencyRatesStore().load({
            params: {
                'cur_id': record.get('id')
            }
        });
        this.getCurrenciesPanel().getSelectionModel().deselectAll();
    },

    /**
     * Delete selected currency
     */     
    deleteCurrency: function(B) {
        Ext.Msg.confirm(OSS.Localize.get('Info'), OSS.Localize.get('Do you really want to remove selected currency?'), function(Btn){
            if (Btn != 'yes') { 
                return; 
            }
            var record = this.getCurrenciesGrid().getSelectionModel().getSelection()[0];
            record.destroy({ scope: this, callback: function() { this.getCurrencyGridStore().reload(); }});
        }, this);
    },

    /**
     * Create new currency
     */     
    addCurrency: function(B) {
        Ext.widget('currencyform', {title: OSS.Localize.get('Add currency')} ).show();
    },

    /**
     * Show form for edit currency rate
     */
    showCurrencyRateForm: function ( view, cell, colIdx, record, row, rowIdx, e){
        var index = view.headerCt.getHeaderAtIndex(colIdx).dataIndex;
        var data = record.get(index);
        var rec = this.getCurrenciesGrid().getSelectionModel().getSelection();
        data.cur_id = rec[0].data.id;
        Ext.widget('currencyrateform', {
            record: {
                'cur_id': data.cur_id,
                'date': data.date,
                'rate': data.rate
            }
        } ).show();
    },

    /**
     * Edit selected currency
     */     
    editCurrency: function(B) {
        var record = this.getCurrenciesGrid().getSelectionModel().getSelection()[0];
        var title = OSS.Localize.get('Edit currency') + ': ' + record.get('name');
        var params = {
            'record': record,
            'title': title
        };
        Ext.widget('currencyform', params).show();
    },

    /**
     * Before show window event. Fill form elements
     * @param   {object} window
     */      
    onShowCurrencyForm: function(win){
        var form = this.getWindowForm().getForm();
        form.findField('code_okv').getStore().reload();
        if (!Ext.isEmpty(win.record)) {
            // If edit
            form.findField('cur_id').setValue(win.record.get('id'));
            form.findField('name').setValue(win.record.get('name'));
            form.findField('symbol').setValue(win.record.get('symbol'));
            form.findField('is_def').setValue(win.record.get('is_def'));
            form.findField('code_okv').setValue(win.record.get('code_okv'));
        } else {
            // If create
            form.findField('cur_id').setValue(0);
        }   
    },

    /**
     * Save currency
     * @param   {object} button
     */ 
    SaveCurrency: function (Btn) {
        var form = Btn.up('window').down('form');
        form.submit({
            clientValidation: true,
            url: 'index.php/api/currencies/save',
            success: function(form, action) {
               Btn.up('window').close();
               this.getCurrencyGridStore().reload({
                   callback: function() {
                       OSS.component.Profile.updateCurrency(this.getCurrencyGridStore());
                   },
                   scope: this
               });
            },
            scope: this
        });
    },

    /**
     * Save currency rate
     * @param   {object} button
     */ 
    SaveCurrencyRate: function (Btn) {
        var form = Btn.up('window').down('form');
        form.submit({
            clientValidation: true,
            url: 'index.php/api/currenciesRates/save',
            success: function(form, action) {
               Btn.up('window').close();
               this.getCurrencyRatesStore().reload();
            },
            scope: this
        });
    },


    /**
     * Before show window event. Fill form elements
     * @param   {object} window
     */      
    onShowCurrencyRateForm: function(win){
        var form = win.items.get(0).getForm();
        form.findField('cur_id').setValue(win.record.cur_id);
        form.findField('date').setValue(win.record.date);
        form.findField('rate').setValue(win.record.rate);
    },
    
    
    showNextMonth: function(Btn){
        this.getCurrenciesPanel().getStore().reload({
            params: {
                currentdate: this.getCurrenciesPanel().getStore().getAt(0).data.currentdate,
                next: 1
            }
        });
    },
    
    showPrevMonth: function(Btn){
        this.getCurrenciesPanel().getStore().reload({
            params: {
                currentdate: this.getCurrenciesPanel().getStore().getAt(0).data.currentdate,
                prev: 1
            }
        });
    },
    
    cellMouseOver: function(view, record, item, index, event) {        
        var item = event.getTarget('tr', 3, true);
        Ext.fly(item).removeCls("x-grid-row-over");
        Ext.fly(item).removeCls("x-grid-row-selected");
        Ext.fly(item).removeCls("x-grid-row-focused");
    }
});
