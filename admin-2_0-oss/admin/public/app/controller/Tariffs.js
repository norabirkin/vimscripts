Ext.define('OSS.controller.Tariffs', {
    extend: 'OSS.controller.tariffs.Base',
    requires: [
        'OSS.controller.HolidayCalendar',
        'OSS.ux.form.field.SearchField',
        'OSS.model.Tariff'
    ],
    controllers: [
        'tariffs.Categories'
    ],
    stores: [
        'users.searchtemplates.Currencies',
        'tariffs.TariffTypes',
        'tariffs.TariffCalls',
        'tariffs.TariffDailyRent',
        'tariffs.TariffDynamicRent',
        'tariffs.ActBlocks',
        'tariffs.TrafficTypes', 
        'tariffs.TariffCatalog',
        'tariffs.TariffsList',
        'tariffs.MasterCategory',
        'tariffs.bandpass.Size',
        'tariffs.bandpass.Time',
        'tariffs.bandpass.Days',
        'tariffs.ServiceCodes',
        'tariffs.Priority',
        'tariffs.CAS',
        'catalog.Types',
        'tariffs.directions.IP',
        'tariffs.directions.available.IP',
        'tariffs.directions.available.Incoming',
        'tariffs.directions.available.Outgoing',
        'tariffs.directions.Outgoing',
        'tariffs.directions.Incoming'
    ],
    views: [
        'Tariffs',
        'tariffs.TariffsList',
        'tariffs.form.General',
        'tariffs.form.Categories',
        'tariffs.form.BandPass',
        'tariffs.form.bandpass.Time',
        'tariffs.TariffForm',
        'tariffs.form.bandpass.Size',
        'tariffs.form.bandpass.time.Week',
        'tariffs.form.bandpass.time.Calendar',
        'tariffs.form.Back',
        'tariffs.form.servicecode.ComboGrid',
        'tariffs.form.categories.Tabs',
        'tariffs.form.categories.Grid',
        'tariffs.form.servicecode.Fieldset',
        'tariffs.form.categories.tabs.Basic',
        'tariffs.form.categories.Cas',
        'tariffs.form.categories.Master',
        'tariffs.form.categories.Catalogs',
        'tariffs.form.categories.Import',
        'tariffs.form.Discouts',
        'tariffs.form.column.WeekDays',
        'tariffs.form.column.UseWeekEnd',
        'tariffs.form.discounts.Time',
        'tariffs.form.discounts.Size',
        'tariffs.form.categories.tabs.Directions',
        'tariffs.form.categories.tabs.directions.Tel'
    ],
    view: 'Tariffs',
    refs: [{
        selector: 'tariffs',
        ref: 'main'
    }, {
        selector: 'tariffs > tariffs_list',
        ref: 'tariffsList'
    }, {
        selector: 'tariffs > tariff_form',
        ref: 'tabs'
    }, {
        selector: 'tariffs > tariff_form > #wrap > #general',
        ref: 'form'
    }, {
        selector: 'tariffs > tariff_form #categoriesTab',
        ref: 'categories'
    }, {
        selector: 'tariffs > tariff_form #discountsTab2',
        ref: 'usboxDiscountsTab'
    }, {
        selector: 'tariffs > tariff_form #discountsTab2 > toolbar',
        ref: 'usboxDiscountsToolbar'
    }, {
        selector: 'tariffs > tariff_form > #wrap > #general > #right > #traffic > #limit > #amount > label',
        ref: 'limitLabel'
    }, {
        selector: 'tariffs > tariff_form > #wrap > #general > #right > #traffic > #limit > #per > numberfield[name=traff_limit_per]',
        ref: 'limitPer'
    }, {
        selector: 'tariffs > tariff_form > #wrap > #general > #right > #traffic > #limit > #per > #monthOrDays',
        ref: 'monthOrDays'
    }, {
        selector: 'tariffs > tariff_form > #bandpass',
        ref: 'bandPassTab'
    }, {
        selector: 'tariffs > tariff_form > #bandpass > #size > headercontainer > gridcolumn[dataIndex=amount]',
        ref: 'amountRateCol'
    }, {
        selector: 'tariffs > tariff_form > #wrap > #general > #left > #common > #serviceCode > combogrid1[name=sale_dictionary_id]',
        ref: 'saleDic'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #common > #descAndCode > #serviceCode > combogrid1[name=sale_dictionary_id]',
        ref: 'catSaleDic'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #common > #linkAndUuid > #uuid > textfield[name=uuid]',
        ref: 'uuid'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #debiting > #method > combogrid1[name=cat_idx_master]',
        ref: 'masterCategories'
    }, {
        selector: 'tariffs > tariff_form #categoriesActionsBtn > menu > #import',
        ref: 'importCategoriesMenuItem'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #discountsTab > #time',
        ref: 'timeDiscounts'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #discountsTab > #size > headercontainer > gridcolumn[dataIndex=amount]',
        ref: 'sizeDiscountAmountCol'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsTab',
        ref: 'directions'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsOutTab',
        ref: 'directionsOut'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsIncTab',
        ref: 'directionsIn'
    }],
    init: function() {
        this.control({
            'tariffs > tariffs_list': {
                afterrender: this.tariffsListLoad
            },
            'tariffs > tariffs_list > toolbar #addTariffBtn': {
                click: this.add
            },
            'tariffs > tariffs_list > toolbar #holydayCalendarBtn': {
                click: this.showHolydayCalendar
            },
            'tariffs > tariffs_list > toolbar #searchTariffs': {
                click: this.searchTariffs
            },
            'tariffs > tariffs_list #tariffListActionsBtn > menu': {
                beforeshow: this.showMenuTariff
            },
            'tariffs > tariffs_list #editTariffBtn': {
                click: this.edit
            },
            'tariffs > tariffs_list #copyTariffBtn': {
                click: this.copyTariff
            },
            'tariffs > tariffs_list #deleteTariffBtn': {
                click: this.deleteTariff
            },
            'tariffs > tariff_form toolbar > #back': {
                click: this.backToTariffsList
            },
            'tariffs > tariff_form > #wrap > toolbar #saveTariffDataBtn': {
                click: this.save
            },
            /*
            'tariffs > tariff_form #saveCategoryDataBtn': {
                click: this.saveTarCategoryDataSelector
            },
            'tariffs > tariff_form #categoriesGrid': {
                itemclick: this.selectCategory
            },
            */
            /*
            'tariffs > tariff_form #discountsTab2': {
                activate: this.openUsboxDiscountsTab,
                edit: this.saveUsboxDiscountEntry
            },
            'tariffs > tariff_form #discountsTab2 > toolbar #addDiscountBtn': {
                click: this.addUsboxDiscount
            },
            'tariffs > tariff_form #deleteDiscountBtn': {
                click: this.deleteUsboxDiscount
            },
            'tariffs > tariff_form #deleteTarCategoryBtn': {
                click: this.deleteTarCategories
            },
            */
            'tariffs > tariff_form > #wrap > #general > #right > #traffic > #limit > #per > #monthOrDays': {
                change: 'onMonthOrDaysChange'
            },
            'tariffs > tariff_form > #wrap > #general > #right > #traffic > #limit > #per > numberfield[name=traff_limit_per]': {
                enable: 'onTraffLimitperEnable'
            },
            /*
            'tariffs > tariff_form > #bandpass': {
                activate: 'bandPassTabActivate'
            },
            */
            'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #common > #linkAndUuid > #uuid > button': {
                click: 'chooseCas'
            },
            'tariffs > tariff_form #categoriesActionsBtn > menu > #import': {
                click: 'showImportCategoriesWin'
            },
            /*
            'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #discountsTab': {
                activate: 'loadDiscountStores'
            },
            'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsTab': {
                activate: 'loadIPDirections'
            },
            'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsOutTab': {
                activate: 'loadOutDirections'
            },
            'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #directionsIncTab': {
                activate: 'loadInDirections'
            },
            */
            'tariffs > tariff_form > #bandpass > toolbar #addByTime': {
                click: 'addBandByTime'
            },
            'tariffs > tariff_form > #bandpass > toolbar #addBySize': {
                click: 'addBandBySize'
            },
            'tariffs > tariff_form > #bandpass > toolbar #removeByTime': {
                click: 'removeBandByTime'
            },
            'tariffs > tariff_form > #bandpass > toolbar #removeBySize': {
                click: 'removeBandBySize'
            }
        });
    },
    add: function() {
        this.record = new OSS.model.Tariff();
        this.load();
    },
    edit: function() {
        var record = arguments[5];

        this.mask();
        OSS.model.Tariff.load(record.get('tar_id'), {
            scope: this,
            callback: this.unmask,
            success: function(record) {
                this.record = record;
                this.load();
                this.getController('tariffs.Categories').getTabs().hide();
            }
        });
    },
    save: function() {
        if (this.form().isValid()) {
            this.mask();
            this.record.save({
                msg: i18n.get('Tariff saved'),
                scope: this,
                failure: this.unmask,
                ok: this.onSave
            });
        }
    },
    load: function() {
        this.getForm().controllRecord(this.record);           
        this.onLoadOrSave();
        this.form().isValid();
        this.getMain().getLayout().setActiveItem(1);
        this.getTabs().setActiveTab(0);
        this.monthOrDays();
        this.readOnly([
            'coef_high',
            'coef_low',
            'cur_id',
            'rent',
            'block_rent',
            'usr_block_rent',
            'adm_block_rent',
            'act_block'
        ], function() {
            return this.param('used');
        });
    },
    monthOrDays: function() {
        if (this.param('traff_limit_per')) {
            this.getMonthOrDays().setValue(1);
        }
    },
    onSave: function(record, tar_id) {
        record.set('tar_id', tar_id);
        this.onLoadOrSave();
        OSS.component.StoreValidity.setInvalid('tariff');
        this.unmask();
    },
    onLoadOrSave: function() {
        this.getForm().resetOriginalValues();
        this.categoryState();
    },
    categoryState: function() {
        this.getCategories()[this.param('tar_id') > 0 ? 'enable' : 'disable']();
    },
    /**
     * Открывает окно импорта категорий
     */
    showImportCategoriesWin: function() {
        var catalog,
            checkbox,
            apply;
        this.importCategoriesWin = Ext.create('OSS.view.tariffs.form.categories.Import');
        apply = this.importCategoriesWin.down('toolbar > #apply');
        catalog = this.importCategoriesWin.down('form > fieldset > combogrid1[name=catalog_id]');
        checkbox = this.importCategoriesWin.down('form > fieldset > #createCatalog');
        this.getCatalogStoreForImport().setExtraParams({
            type: this.param('type') < 3 ? 1 :  3
        });
        checkbox.on('change', function() {
            catalog[arguments[1] ? 'hide' : 'show']();
            catalog[arguments[1] ? 'disable' : 'enable']();
        });
        this.importCategoriesWin.down('toolbar > #cancel').on('click', function() {
            this.importCategoriesWin.close();
        }, this);
        apply.on('click', this.importCategories, this);
        this.importCategoriesWin.down('form').on('validitychange', function() {
            apply[arguments[1] ? 'enable' :  'disable']();
        });
        this.importCategoriesWin.show();
    },    
    importCategories: function() {
        this.importCategoriesWin.down('form').submit({
            url: 'index.php/api/tariffs/importCategories',
            params: {
                tar_id: this.param('tar_id')
            },
            scope: this,
            success: this.onCategoriesImport,
            waitMsg: i18n.get('File loading')
        });
    },
    onCategoriesImport: function() {
        OSS.ux.HeadMsg.show(i18n.get('Import of categories is successfuly completed.'));
        this.importCategoriesWin.close();
    },
    getCatalogStoreForImport: function() {
        if (!this.catalogStoreForImport) {
            this.catalogStoreForImport = Ext.create('OSS.store.tariffs.Catalogs');
        }
        return this.catalogStoreForImport;
    },
    /**
     * Открывает окно выбора CAS
     */
    chooseCas: function() {
        var win = Ext.create('OSS.view.tariffs.form.categories.Cas');
        win.down('gridpanel > toolbar > button').on('click', function() {
            this.getTariffsCASStore().setExtraParams({
                fullsearch: win.down('gridpanel > toolbar > textfield[name=fullsearch]').getValue()
            });
            this.getTariffsCASStore().load({
                force: true
            });
        }, this);
        win.down('gridpanel').on('itemclick', this.applyCas, this);
        this.getTariffsCASStore().load();
        win.show();
    },
    /**
     * Применяет изменение CAS
     */
    applyCas: function(grid, record) {
        grid.up('window').close();
        this.getUuid().setValue(record.get('tag'));
    },
    /**
     * Вызывается при активации вкладки "Настройки полосы пропускания"
     */
    bandPassTabActivate: function() {
        if (this.param('tar_id')) {
            return;
        }
        var params = {
            tar_id: this.param('tar_id')
        };
        this.getTariffsBandpassSizeStore().setExtraParams(params);
        this.getTariffsBandpassSizeStore().load();
        this.getTariffsBandpassTimeStore().setExtraParams(params);
        this.getTariffsBandpassTimeStore().load();
    },
    /**
     * Вызывается когда текстовое поле времени ограничения трафика активируется
     */
    onTraffLimitperEnable: function() {
        if (!this.getMonthOrDays().getValue()) {
            this.getLimitPer().disable();
        }
    },
    /**
     * Вызывается при изменении значения комбобокса времени ограничения трафика
     */
    onMonthOrDaysChange: function(value) {
        if (value) {
            this.getLimitPer().enable();
        } else {
            this.getLimitPer().disable();
        }
    },
    /*
    * Load tariffs List data
    *
    * @param object grid
    *
    */
    
    tariffsListLoad: function(grid) {
        grid.getStore().load();
    },
    
    /*
    * Press button "Holyday calendar"
    *
    * @param object Btn
    *
    */
    
    showHolydayCalendar: function(Btn) {
        Ext.app.Application.instance.getController('HolidayCalendar').showMainForm(Btn);
    },
    
    
    /*
    * Press button "Show"
    *
    * @param object Btn
    *
    */
    
    searchTariffs: function(Btn) {
        var type = Btn.up().items.get('tariffTypeField').getValue(),
            string = Btn.up().items.get('searchField').getValue();
        this.getTariffsList().getStore().reload({
            params: {
                'type': type,
                'tarsearch': string 
            }
        });
    },

    /*
    * Press "Copy tariff" icon (2nd column)
    *
    * @param object grid
    *
    * @param integer rowIdx
    *
    * @param integer colIdx
    *
    * @param object item
    *
    * @param event event
    *
    * @param object record
    *
    */
    
    copyTariff: function(Btn) {
        var record = this.getTariffsList().getSelectionModel().getSelection();

        Ext.Ajax.request({
            url: 'index.php/api/Tariffs/clone',
            method: 'POST',
            scope: this,
            params: { 
                tar_id: record[0].data.tar_id,
                descr: i18n.get('Copy of')
            },
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }
                this.getTariffsList().getStore().reload();
                
                Ext.Msg.confirm(
                    i18n.get( "Confirmation" ),
                    i18n.get( "Would you like to edit copied tariff" ) + '?',
                    function( button ) {
                        if (button != "yes") {
                            return;
                        }
                        var rec = this.getTariffsList().getStore().findRecord('tar_id', response.results);
                        
                        Ext.Ajax.request({
                            url: 'index.php/api/Tariffs/tariffData',
                            method: 'POST',
                            scope: this,
                            params: { 
                                tar_id: rec.get('tar_id')
                            },
                            success: function() {
                                var response = Ext.JSON.decode(arguments[0].responseText);
                                if (!response.success) {
                                    return;
                                }
                                this.load(response.results);
                            }
                        });
                        
                        
                    }, this);
                
            }
        });
        
    },
    
    
    /*
    * Press "Delete" icon (Last column)
    *
    * @param object grid
    *
    * @param integer rowIdx
    *
    * @param integer colIdx
    *
    * @param object item
    *
    * @param event event
    *
    * @param object record
    *
    */
    
    deleteTariff: function(grid, rowIdx, colIdx, item, event, record) {
        
        Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Do you really want to remove this tariff" ) + '?',
            function( button ) {
                if (button != "yes") {
                    return;
                }
                
                // Removing request
                Ext.Ajax.request({
                    url: 'index.php/api/Tariffs/delete',
                    method: 'POST',
                    params: { 
                        tar_id: record.get('tar_id')
                    },
                    success: function() {
                        var response = Ext.JSON.decode(arguments[0].responseText);
                        if (!response.success) {
                            return;
                        }
                        grid.getStore().reload();
                        OSS.component.StoreValidity.setInvalid('tariff');
                    }
                });
                
            }
        );  
    },
    
    
    /*
    * Press button "Back to tariffs list"
    *
    * @param object Btn
    *
    */
    
    backToTariffsList: function(Btn) {      
        this.getMain().getLayout().setActiveItem(0);
        this.getTariffsList().getStore().reload();
    },
    
    /*
    * Enable or disable buttons on Actions splitbutton expand (Tariffs list form)
    *
    * @param object menu
    *
    */
    
    showMenuTariff: function(menu) {
        var selected = this.getTariffsList().getSelectionModel().hasSelection();
        menu.items.get('copyTariffBtn')[selected ? 'enable' : 'disable']();
    },
    
    
    /*
    * Enable or disable buttons on Actions splitbutton expand (Tariffs categories form)
    *
    * @param object menu
    *
    */
    
    addBandByTime: function() {
        this.getBandPassTab().items.get(0).addItemForRowEditing();
    },
    
    addBandBySize: function() {
        this.getBandPassTab().items.get(1).addItemForRowEditing();
    },
    
    removeBandByTime: function() {
        this.getBandPassTab().items.get(0).onRemoveButtonClick();
    },
    
    removeBandBySize: function() {
        this.getBandPassTab().items.get(1).onRemoveButtonClick();
    },

    getMaskTarget: function() {
        return this.getMain();
    }
});
