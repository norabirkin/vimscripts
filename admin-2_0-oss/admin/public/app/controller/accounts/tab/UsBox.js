/**
 * Управляет вкладками UsBox
 */
Ext.define('OSS.controller.accounts.tab.UsBox', {
    extend: 'Ext.app.Controller',
    refs: [{
        selector: 'accounts > #form > #periodic',
        ref: 'periodic'
    }],
    init: function() {
        this.callParent(arguments);
        this.control({
            'accounts > #form > grid_with_edit_window[usboxTab]': {
                tabactivated: 'addCommonParam',
                windowshow: 'windowShow',
                itemedit: 'editService',
                itemcreate: 'createService'
            },
            '#periodic_editform > fieldcontainer[name=time_from]': {
                change: 'usboxTimeFromChanged'
            },
            '#periodic_editform > fieldcontainer[name=time_to]': {
                change: 'usboxTimeToChanged'
            },
            'window[usboxTab] > form > combo[name=cat_idx]': {
                change: 'setCategoryDiscount'
            },
            'window[usboxTab] > form > combo[name=disctype]': {
                change: 'onDiscountTypeChanged'
            }
        });
    },
    /**
     * Выполняется при изменении типа скидки
     *
     * @param field {Ext.form.field.ComboBox} Поле типа скидки
     * @param value {String} Тип скидки
     */
    onDiscountTypeChanged: function(field, value) {
        if (value) {
            field.up('form').down('#discount_fields').getLayout().setActiveItem(arguments[1]);
        }
    },
    /**
     * Устанавливает значение поля скидки в соответствии выбранной в комбобоксе категории тарифа
     *
     * @param field {Ext.form.field.ComboBox} Поле
     * @param value {Integer} ID категории тарифа
     */
    setCategoryDiscount: function(field, value) {
        ajax.request({
            url: 'tarcategory/rate',
            params: {
                cat_idx: value,
                tar_id: OSS.helpers.accounts.Data.getAccount().get('tar_id'),
                vg_id: OSS.helpers.accounts.Data.getAccount().get('vg_id')
            },
            noAlert: true,
            success: function(result) {
                field.up('form').getForm().setValues({
                    rate: result,
                    disctype: 'rate'
                });
            },
            scope: this
        });
    },
    /**
     * Вызывается при изменении значения поля выбора начала действия перидической услуги
     *
     * @param value {String} Форматированная дата
     * @param date {Date} Выбранная в поле дата
     */
    usboxTimeFromChanged: function(value, date, field) {
        var form = this.getPeriodic().getForm().getForm();
        form.findField('discount_time_from').setMinValue(date);
        form.findField('discount_time_to').setMinValue(date);
        form.findField('time_to').setMinValue(date);
        form.findField('activated').setMinValue(date);
        form.setValues({
            discount_time_from: this.getPeriodic().editMode ? undefined : date,
            activated: date
        });
        form.isValid();
    },
    /**
     * Вызывается при изменении значения поля выбора конца действия периодической услуги
     *
     * @param value {String} Форматированная дата
     * @param date {Date} Выбранная в поле дата
     */
    usboxTimeToChanged: function(value, date) {
        var form = this.getPeriodic().getForm().getForm();
        form.setValues({
            discount_time_to: this.getPeriodic().editMode ? undefined : date,
            activated: date < form.findField('activated').getDate() ? date: undefined
        });
        form.findField('activated').setMaxValue(date);
        form.findField('discount_time_to').setMaxValue(date);
    },
    /**
     * Выполняется при редактировании услуги UsBox 
     *
     * @param options.panel {OSS.view.accounts.item.UsBox} панель услун
     */
    editService: function(options) {
        this.setFieldsReadOnly(options.panel, true);
    },
    /**
     * Выполняется при создании периодической UsBox услуги
     *
     * @param options.panel {OSS.view.accounts.item.UsBox} панель услун
     */
    createService: function(options) {
        options.panel.getItem().set('common', options.panel.common);
        options.panel.getItem().set('vg_id', OSS.helpers.accounts.Data.getAccount().get('vg_id'));
        options.panel.getItem().set('tar_id', OSS.helpers.accounts.Data.getAccount().get('tar_id'));
        this.setFieldsReadOnly(options.panel, false);
    },
    /**
     * Устанавливает значение свойства readOnly для некоторых полей формы создания/редактирования периодической UsBox услуги
     *
     * @param value {Boolen} Значение свойства
     */
    setFieldsReadOnly: function(panel, value) {
        var i,
            fields = panel.readOnlyOnEdit();
        for (i = 0; i < fields.length; i++) {
            panel.getForm().getForm().findField(fields[i]).setReadOnly(value);
        }
    },
    /**
     * Добавляет параметр common в запрос списка услуг
     *
     * @param tab {OSS.view.accounts.item.UsBox} грид
     */
    addCommonParam: function(tab) {
        tab.getStore().addExtraParams({
            common: tab.common
        });
    },
    /**
     * Выполняется после создания окна редактирования услуги
     *
     * @param panel {OSS.view.accounts.item.UsBox} Панель услуг
     */
    windowShow: function(panel) {
        var combo,
            store,
            form = panel.getForm().getForm();
        combo = form.findField('cat_idx');
        store = combo.getStore();
        form.setValues({
            disctype: panel.getItem().get('discount') > 0 ? 'discount' : 'rate'
        });
        store.setExtraParams({
            tar_id: OSS.helpers.accounts.Data.getAccount().get('tar_id'),
            common: panel.common
        });
    }
});
