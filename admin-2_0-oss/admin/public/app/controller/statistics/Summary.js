/**
 * Контроллер управляющий панелью <Итого> в разделе <Статистика>
 */
Ext.define('OSS.controller.statistics.Summary', {
    extend: 'Ext.app.Controller',
    refs: [{
        selector: 'statistics > #main > #summary',
        ref:'container'
    }],
    init: function() {
        this.control({
            'statistics > #main > #grids > grid': {
                load: this.loadSummaryStore
            },
            'statistics > #filter > #basic > combo[name=repnum]': {
                change: this.onRepnumChange
            }
        });
    },
    /**
     * Вызывается при смене значения комбобокса агентов
     */
    onRepnumChange: function() {
        this.getContainer().hide();
    },
    /**
     * Возвращает панель <Итого> соответствующию типу выбранного агенту
     *
     * @return {OSS.view.statistics.Summary}
     */
    getSummaryGrid: function() {
        var className = Ext.app.Application.instance.getController('Statistics').getHelper().getSummaryGridClass();
        if (!this.grids) {
            this.grids = {};
        }
        if (!this.grids[className]) {
            this.grids[className] = Ext.create(className);
            this.getContainer().add(this.grids[className]);
        }
        return this.grids[className];
    },
    /**
     * Удаляет все данные для панели <Итого>
     */
    resetSummary: function() {
        this.getSummaryGrid().getStore().removeAll();
        this.summary = [];
        this.currencyIndex = 0;
        this.currencies = [];
    },
    /**
     * Возвращает индекс элемента массива данных для панели <Итого> соответствующий определенной валюте
     *
     * @param currency {Integer} валюта
     * @return {Array}
     */
    getCurrencyIndex: function( currency ) {
        if (this.currencies[currency] === undefined) {
            this.currencies[currency] = this.currencyIndex; this.currencyIndex ++;
        }
        return this.currencies[currency];
    },
    /**
     * Увеличивает значение поля записи панели <Итого>
     *
     * @param currency {Number} валюта
     * @param record текущая в данной итерации запись таблицы статистики
     * @param field имя поля
     * @return {Number} увеличенное значение
     */
    increaseSummaryValue: function( currency, record, field ) {
        var result = Ext.app.Application.instance.getController('Statistics').getHelper().increaseSummaryValue( currency, record, field, this.summary );
        if (result === false) {
            return this.summary[currency][field] + record.get(field);
        } else {
            return result;
        }
    },
    /** 
     * Добавляет запись таблицы статистики в очередь для обработки
     * с целью формирования массива данных для панели <Итого>
     *
     * @param currency {Integer} валюта
     * @param record {Ext.data.Model} запись таблицы статистики
     */
    addSummary: function( currency, record ) {
        var i,
            summaryFields = Ext.app.Application.instance.getController('Statistics').getHelper().getSummaryFields(),
            field;
        currency = this.getCurrencyIndex(currency);
        if (!this.summary[currency]) {
            this.summary[currency] = {curr_symbol: record.get('curr_symbol')};
        }
        for (i = 0; i < summaryFields.length; i ++) {
            field = summaryFields[i];
            this.summary[currency][field] = (this.summary[currency][field] !== undefined) ? this.increaseSummaryValue(currency, record, field) : record.get(field);
        }
    },
    /**
     * Заполняет хранилище панели <Итого>
     *
     * @param store {Ext.data.Store} хранилище таблицы статистики
     * @param records {Ext.data.Model[]} записис хранилища таблицы статистики
     */
    loadSummaryStore: function( store, records ) {
        var i,
            summaryStore = this.getSummaryGrid().getStore();
        this.resetSummary();
        if (store.getCount() == 0) {
            this.getContainer().hide();
            return;
        }
        for (i = 0; i < records.length; i ++) {
            this.addSummary( records[i].get('curr_id'), records[i] );
        }
        for (i = 0; i < this.summary.length; i ++) {
            summaryStore.add( this.summary[i] );
        }
        this.getContainer().getLayout().setActiveItem(this.getSummaryGrid());
        this.getContainer().show();
    }
});
