Ext.define("OSS.controller.Accounts", {
    extend: 'Ext.app.Controller',
    
    requires: [
        'Ext.tab.Panel',
        'OSS.component.Options',
        'OSS.ux.form.field.date.WithTime',
        'OSS.ux.grid.editor.Window',
        'OSS.model.account.Full',
        'OSS.controller.accounts.Item',
        'OSS.ux.form.field.SearchField'
    ],
    
    stores: [
        'Accounts',
        'accounts.Tariffs',
        'Users',
        'users.Combogrid',
        'Agreements',
        'accounts.Combogrid',
        'Tariffs',
        'accounts.tariffs.History',
        'accounts.Networks',
        'accounts.MacAddresses',
        'accounts.Locks',
        'accounts.telephony.Numbers',
        'accounts.telephony.Trunks',
        'accounts.Usbox',
        'tariffs.Categories',
        'accounts.usbox.Installments',
        'accounts.tariffs.Modifiers',
        'accounts.telephony.TrunksAndNums'
    ],
    
    views: [
        'accounts.item.Telephony',
        'Accounts',
        'users.Window',
        'users.Search',
        'users.TypeColumn',
        'users.Combogrid',
        'Agreements'
    ],

    view: 'Accounts',
    
    refs: [{
        selector: 'accounts',
        ref: 'main'
    }, {
        selector: 'accounts > #list > #wrap',
        ref: 'accountsPanel'
    }, {
        selector: 'accounts > #list > #wrap > #accounts',
        ref: 'accountsGrid'
    }, {
        selector: 'accounts > #list > #filter > #tariff',
        ref: 'tariffsCombo'
    }, {
        selector: 'accounts > #list > #filter > #agent',
        ref: 'agentsCombo'
    }, {
        selector: 'accounts > #list > #filter > combo[name=blocked]',
        ref: 'statusCombo'
    }, {
        selector: 'accounts > #list > #wrap > #accounts > toolbar > combo[name=property]',
        ref: 'property'
    }, {
        selector: 'accounts > #list > #wrap > #accounts #ccard',
        ref: 'ccard'
    }, {
        selector: 'userswin',
        ref: 'usersWindow'
    }, {
        selector: 'userswin > gridpanel > toolbar',
        ref: 'usersWindowToolbar'
    }, {
        selector: 'accountswin',
        ref: 'accountsWindow'
    }, {
        selector: 'tariffswin',
        ref: 'tariffsWindow'
    }, {
        selector: 'tariffsgridwin',
        ref: 'tariffsGridWindow'
    }, {
        selector: 'accounts > #account > #tariffs',
        ref: 'accountTariffsHistory'
    }, {
        selector: 'accounts > #account > #network > #ip > #assigned > grid',
        ref: 'assignedNetworksGrid'
    }, {
        selector: 'accounts > #account > #network > #addresses',
        ref: 'networkAddresses'
    }, {
        selector: 'accounts > #account > #network > #localas',
        ref: 'localAs'
    }, {
        selector: 'accounts > #account > #common',
        ref: 'commonForm'
    }, {
        selector: 'multitariffs',
        ref: 'multitariffsWindow'
    }, {
        selector: 'multitariffs > form',
        ref: 'multitariffsWindowForm'
    }, {
        selector: 'multitariffs > form > #tariff',
        ref: 'multitariffTariffName'
    }, {
        selector: 'accounts > #account > #locks',
        ref: 'locksGrid'
    }, {
        selector: 'accounts > #account > #telephony > #numbers',
        ref: 'telephonyNumbersGrid'
    }, {
        selector: 'telephony',
        ref: 'telephonyWindow'
    }, {
        selector: 'telephony > form',
        ref: 'telephonyWindowForm'
    }, {
        selector: 'accounts > #account > #telephony > #trunks',
        ref: 'telephonyTrunksGrid'
    }, {
        selector: 'tariffswin > form',
        ref: 'tariffForm'
    }, {
        selector: 'tariffswin > form > field[name=tariff]',
        ref: 'choosenTariff'
    }, {
        selector: 'tariffswin > #zone-disc > #modifiers',
        ref: 'categoryModifiersGrid'
    }, {
        selector: 'accounts > #account > #common > #right > fieldset > #tariffs > displayfield',
        ref: 'tariffDisplay'
    }, {
        selector: 'accounts > #account > #periodic',
        ref: 'periodicServices'
    }, {
        selector: 'accounts > #account > #onetime',
        ref: 'onetimeServices'
    }, {
        selector: 'usboxwin',
        ref: 'usboxWindow'
    }, {
        selector: 'accounts > #list > #wrap > #accounts > toolbar > #search',
        ref: 'searchField'
    }, {
        selector: 'accounts > #list > #wrap > #accounts > toolbar > combo[name=property]',
        ref: 'searchPropertyField'
    }, {
        selector: 'accounts > #account > #common > #right > fieldset > #tariffs > #choose',
        ref: 'tariffChooseBtn'
    }, {
        selector: 'accounts > #account > #common > #right > fieldset > #tariffs > #tariff',
        ref: 'tariffShowBtn'
    }, {
        selector: 'accounts > #account > toolbar > #save',
        ref: 'saveButton'
    }, {
        selector: 'accounts > #account > toolbar > #promo',
        ref: 'promoButton'
    }, {
        selector: 'accounts > #account > toolbar > #equipment',
        ref: 'equipmentButton'
    }, {
        selector: 'accounts > #account > toolbar > #statistics',
        ref: 'statisticsButton'
    }, {
        selector: 'accounts > #account > toolbar > #history',
        ref: 'historyButton'
    }, {
        selector: 'accounts > #account > toolbar > #user',
        ref: 'userButton'
    }, {
        selector: 'accounts > #account > #common > #right > #device',
        ref: 'deviceFieldset'
    }, {
        selector: 'accounts > #account > #common > #right > #options',
        ref: 'optionsFields'
    }, {
        selector: 'accounts > #account > #common > #right > #statusAndBalance > #balance > #pay',
        ref: 'payButton'
    }, {
        selector: 'accounts > #account > #network',
        ref: 'networkTab'
    }, {
        selector: 'accounts > #account > #telephony',
        ref: 'telephonyTab'
    }, {
        selector: 'accounts > #account > #common > #left',
        ref: 'leftCommonOptions'
    }, {
        selector: 'accounts > #account > #common > #left > fieldset > #address',
        ref: 'addressFieldContainer'
    }, {
        selector: 'accounts > #account > #common > #left > fieldset > #password > #wrap',
        ref: 'passwordContainer'
    }, {
        selector: 'accounts > #account > #common > #left > fieldset > #doctemplate',
        ref: 'documentsTemplateContainer'
    }],

    init: function() {
        this.control({
            'accounts': {
                afterrender: 'onAccountsRendered'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #actions > #create': {
                click: 'create'
            },
            'accounts > #list > #wrap > #accounts #edit': {
                click: 'edit'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #actions > #remove-accounts': {
                click: 'onRemoveAccounts'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #agentTypeCmb': {
                select: 'selectTbarAgentType'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #actions > #templates': {
                click: 'showTemplates'
            },
            'accounts > #list > #wrap > #templates > toolbar > #actions > #accounts': {
                click: 'showAccounts'
            },
            'accounts > #list > #wrap > #accounts #payments': {
                click: 'showPaymentsPanel'
            },
            'accounts > #list > #wrap > #accounts #rent_charges': {
                click: 'showRentStatisticsPanel'
            },
            'accounts > #list > #filter > #agent': {
                change: 'loadTariffsAccordingToAgentType'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #actions > #status > #turn_on': {
                click: 'turnOnAccounts'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #actions > #status > #turn_off': {
                click: 'turnOffAccounts'
            },
            'accounts > #account > toolbar > #back': {
                click: 'backToList'
            },
            'accounts > #account > #common > #left > fieldset > #user > #choose': {
                click: 'chooseUser'
            },
            'userswin > gridpanel > toolbar > #find': {
                click: 'findUserInWindow'
            },
            'accounts > #account > #common > #left > fieldset > #parent > #choose': {
                click: 'chooseParent'
            },
            'accounts > #account > #common > #right > fieldset > #tariffs > #choose': {
                click: 'chooseTariff'
            },
            'accounts > #account': {
                tabchange: 'accountTabChanged'
            },
            'accounts > #account > #tariffs': {
                tabactivated: 'tariffsTabActivated'
            },
            'accounts > #account > #tariffs #remove': {
                click: 'removeTariff'
            },
            'accounts > #account > #tariffs #edit': {
                click: 'editMultiTariff'
            },
            'tariffswin > form > #tariff > #choose': {
                click: 'tariffsGridWindow'
            },
            'accounts > #account > #network': {
                tabactivated: 'networkTabActivated'
            },
            'accounts > #account > #network > #addresses': {
                expand: 'networkAddressesPanelExpanded'
            },
            'accounts > #account > #network > #localas': {
                expand: 'localAsPanelExpanded'
            },
            'accounts > #account > #network > #ip > #assigned > grid #port': {
                click: 'assignedNetworkGridCheckboxClicked'
            },
            'accounts > #account > #network > #addresses #remove': {
                click: 'removeRec'
            },
            'accounts > #account > #network > #localas #remove': {
                click: 'removeRec'
            },
            'multitariffs > toolbar > #save': {
                click: 'saveMultitariff'
            },
            'accounts > #account > #locks #remove': {
                click: 'removeRec'
            },
            'accounts > #account > #locks': {
                tabactivated: 'locksTabAcitvated'
            },
            'accounts > #account > #telephony': {
                tabactivated: 'telephonyTabActivated'
            },
            'accounts > #account > #telephony > grid #edit': {
                click: 'editTelephonyNumbers'
            },
            'accounts > #account > #telephony > grid #remove': {
                click: 'removeRec'
            },
            'telephony > toolbar > #save': {
                click: 'saveTelephonyNumber'
            },
            'tariffswin > toolbar > #apply': {
                click: 'applyTariff'
            },
            /*'accounts > #account > grid_with_edit_window[usboxTab]': {
                tabactivated: 'loadPeriodicServices',
                windowshow: 'editPeriodicService',
                itemedit: 'onPeriodServiceEdit',
                itemcreate: 'onPeriodSeviceCreate'
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
            },*/
            'accounts > #account > #common > #left > fieldset > #user > combogrid1[name=uid]': {
                change: 'userChanged'
            },
            'accounts > #account > toolbar > #save': {
                click: 'saveVgroup'
            },
            'accounts > #list > #wrap > #accounts > toolbar > #find': {
                click: 'findVgroup'
            }
        });
    },

    /**
     * Редактирует учетную запись
     *
     * @param arguments[5] {OSS.model.Account} Учетная запись
     */
    edit: function() {
        this.__create(arguments[5].get('vg_id'));
    },

    /**
     * Ищет учетные записи
     */
    findVgroup: function() {
        var params = this.getAccountsStore().proxy.extraParams;
        this.getSearchPropertyField().getStore().each(function(item) {
            delete(params[item.get('id')]);
        });
        params[
            this.getSearchPropertyField().
                getValue()
        ] = this.getSearchField()
            .getValue();
        this.getAccountsStore().load();
    },

    /**
     * Валидация по регулярному выражению, содержащемуся в опции <Разрешенные символы в пароле учетной записиш>
     */
    validatePassword: function(value) {
        var pattern = this.allowedPasswordSymbols;
        if ((this.isTpl || (this.vgroupData && this.vgroupData.template)) || !pattern) {
            return true;
        } else {
            return new RegExp(pattern).test(value) ? true : i18n.get({
                msg: 'Incorrect password value: ({regexp})',
                params: {
                    '{regexp}': pattern
                }
            });
        }
    },

    /**
     * Валидация договора
     */
    validateAgreement: function(value) {
        if (value > 0) {
            return true;
        } else {
            return i18n.get('No agreement');
        }
    },

    /**
     * Сохраняет учетную запись
     */
    saveVgroup: function() {
        var record;
        if (!this.getVgroupId()) {
            record = Ext.create('OSS.model.account.Full');
        } else {
            record = Ext.create('OSS.model.account.Full', this.vgroupData);
        }
        record.set('uid', this.param('uid'));
        record.set('agrm_id', this.param('agrm_id'));
        record.set('agent_id', this.param('agent_id'));
        record.set('login', this.param('login'));
        if (this.newTariffData) {
            this.newTariffData.set('agent_id', this.param('agent_id'));
        }
        if (!this.isTpl && !record.get('tempate')) {
            if (record.get('tar_id') === 0 && !this.newTariffData) {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('No tariff'));
                return;
            }
        } else {
            record.set('template', this.isTpl);
        }
        record.save({
            callback: function() {
                var results,
                    id = this.getVgroupId();
                if (!arguments[2]) {
                    return;
                }
                results = Ext.JSON.decode(arguments[1].response.responseText).results;
                if (this.newTariffData) {
                    this.newTariffData.set('vg_id', results);
                }
                if (!id) {
                    this.newTariffData.save({
                        callback: function() {
                            this.vgroupId = results;
                            this.getVgroupData();
                        },
                        scope: this
                    });
                    this.saveCategoryModifiers(results, this.newTariffData.get('tar_id'));
                }
                if (id) {
                    this.vgroupId = results;
                    this.getVgroupData();
                }
            },
            scope: this
        });
    },

    /**
     * Сохраняет модификаторы категорий
     */
    saveCategoryModifiers: function(vg_id, tar_id) {
        if (!this.newCategoryModifiers) {
            return;
        }
        ajax.request({
            url: 'catmodifiers/'+vg_id,
            params: {
                tar_id: tar_id,
                modifiers: this.newCategoryModifiers
            },
            scope: this
        });
    },

    /**
     * Выполняется при изменении значения комбогрида пользователей
     *
     * @param arguments[1] {Integer} ID пользователя
     */
    userChanged: function() {
        var store = this.field('agrm_id').getStore();
        store.proxy.extraParams.uid = arguments[1];
        store.load();
    },

    /**
     * Возвращает хранилище периодических услуг
     *
     * @return {Ext.data.Store} Хранилище
     */
    getPeriodicServicesStore: function() {
        if (!this.periodicServicesStore) {
            this.periodicServicesStore = Ext.create('OSS.store.accounts.Usbox');
        }
        return this.periodicServicesStore;
    },

    /**
     * Возвращает хранилище разовых услуг
     *
     * @return {Ext.data.Store} Хранилище
     */
    getOneTimeServicesStore: function() {
        if (!this.oneTimeServicesStore) {
            this.oneTimeServicesStore = Ext.create('OSS.store.accounts.Usbox');
        }
        return this.oneTimeServicesStore;
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
                tar_id: this.vgroupData.tar_id,
                vg_id: this.vgroupData.vg_id
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
        var form = this.getPeriodicServices().getForm().getForm();
        form.findField('discount_time_from').setMinValue(date);
        form.findField('discount_time_to').setMinValue(date);
        form.findField('time_to').setMinValue(date);
        form.findField('activated').setMinValue(date);
        form.setValues({
            discount_time_from: this.getPeriodicServices().editMode ? undefined : date,
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
        var form = this.getPeriodicServices().getForm().getForm();
        form.setValues({
            discount_time_to: this.getPeriodicServices().editMode ? undefined : date,
            activated: date < form.findField('activated').getDate() ? date: undefined
        });
        form.findField('activated').setMaxValue(date);
        form.findField('discount_time_to').setMaxValue(date);
    },

    /**
     * Выполняется после создания окна редактирования услуги
     *
     * @param panel {OSS.view.accounts.item.UsBox} Панель услуг
     */
    editPeriodicService: function(panel) {
        var combo,
            store,
            form = panel.getForm().getForm();
        combo = form.findField('cat_idx');
        store = combo.getStore();
        form.setValues({
            disctype: panel.getItem().get('discount') > 0 ? 'discount' : 'rate'
        });
        store.setExtraParams({
            tar_id: this.choosenTariffId,
            common: panel.common
        });
        store.loadIfNeccessary();
    },

    /**
     * Выполняется при редактировании услуги UsBox 
     *
     * @param options.panel {OSS.view.accounts.item.UsBox} панель услун
     */
    onPeriodServiceEdit: function(options) {
        this.setFieldsReadOnly(options.panel, true);
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
     * Выполняется при создании периодической UsBox услуги
     *
     * @param options.panel {OSS.view.accounts.item.UsBox} панель услун
     */
    onPeriodSeviceCreate: function(options) {
        options.panel.getItem().set('common', options.panel.common);
        options.panel.getItem().set('vg_id', this.getVgroupId());
        options.panel.getItem().set('tar_id', this.choosenTariffId);
        this.setFieldsReadOnly(options.panel, false);
    },

    /**
     * Возвращает TRUE, если можно редактировать периодическую услугу и возвращает FALSE если нельзя
     *
     * @param record {OSS.model.account.Usbox} Периодическая услуга
     * @return {Boolean}
     */
    canEditPeriodicService: function(record) {
        return this.choosenTariffId == record.get('tar_id');
    },

    /**
     * Загружает данные грида UsBox услуг
     *
     * @param tab {OSS.view.accounts.item.UsBox} грид
     */
    loadPeriodicServices: function(tab) {
        var store = tab.getStore();
        store.setExtraParams({
            vg_id: this.getVgroupId(),
            common: tab.common
        });
        store.loadIfNeccessary();
    },

    /**
     * Применяет выбранный тариф
     */
    applyTariff: function() {
        if (!this.getChoosenTariff().getValue()) {
            return;
        }
        this.newTariffData = Ext.create('OSS.model.account.tariff.History', {
            tar_id_new: this.getChoosenTariff().getValue(),
            change_time: this.getTariffForm().getForm().findField('change_time').getValue(),
            time_to: this.getTariffForm().getForm().findField('time_to').getValue()
        });
        this.newCategoryModifiers = this.getCategoryModifiers();
        this.setTariff(this.getChoosenTariff().getValue(), this.getChoosenTariff().getRawValue());
        this.getTariffsWindow().close();
    },

    /**
     * Получает массив модификаторов категорий
     */
    getCategoryModifiers: function() {
        var store = this.getCategoryModifiersGrid().getStore(),
            data = [];
        if (!store.getCount()) {
            return null;
        }
        store.each(function(record) {
            data.push(record.data);
        });
        return Ext.JSON.encode(data);
    },

    /**
     * Задает значение тарифа учетной записи
     *
     * @param value {Integer} ID тарифа
     * @param display {String} Имя тарифа
     */
    setTariff: function(value, display) {
        this.choosenTariffId = value;
        this.choosenTariffName = display;
        this.getTariffDisplay().setValue(display);
    },

    /**
     * Сохраняет элемент грида <Телефонные номера / MTA> вкладки <Телефония>
     */
    saveTelephonyNumber: function() {
        ajax.request({
            url: (this.getTelephonyWindowForm().down('#device').getValue() == 2 ? 'vgrouptelephonytrunks' : 'vgrouptelephonynumbers') + '/' +this.telephonyNumber.get('record_id'),
            method: 'put',
            params: {
                vg_id: this.getVgroupId(),
                device: this.getTelephonyWindowForm().down('#device').getValue(),
                number: this.getTelephonyWindowForm().down('#number').getValue(),
                time_from: this.getTelephonyWindowForm().down('#time_from').getValue(),
                time_to: this.getTelephonyWindowForm().down('#time_to').getValue(),
                comment: this.getTelephonyWindowForm().down('#comment').getValue(),
                check_duplicate: this.getTelephonyWindowForm().down('#check_duplicate').getValue() ? 1 : 0
            },
            success: function() {
                this.getTelephonyNumbersGrid().getStore().setDataInvalid();
                this.getTelephonyTrunksGrid().getStore().setDataInvalid();
                this.telephonyTabActivated();
                this.getTelephonyWindow().close();
            },
            scope: this
        });
    },

    /**
     * Редактирует элемент грида <Телефонные номера / MTA> вкладки <Телефония>
     *
     * @param arguments[5] {OSS.model.account.telephony.Number} элемент грида
     */
    editTelephonyNumbers: function() {
        this.telephonyNumber = arguments[5];
        if (!this.getTelephonyWindow()) {
            this.getView('accounts.telephony.Window').create();
        }
        this.getTelephonyWindow().show();
        this.setFormValues({
            form: this.getTelephonyWindowForm(),
            fields: [
                'number',
                'device',
                'time_from',
                'time_to',
                'comment'
            ],
            record: this.telephonyNumber
        });
    },

    /**
     * Загружает данные записи хранилища в форму
     *
     * @param params.form {Ext.form.Panel} Форма
     * @param params.fields {[String]} itemId полей формы соответствующие свойствам записи
     * @param params.record {Model} Запись
     */
    setFormValues: function(params) {
        var i,
            fields = params.fields;
        for (i = 0; i < fields.length; i ++) {
            params.form.down('#'+fields[i]).setValue(
                params.record.get(fields[i])
            );
        }
    },

    /**
     * Загружает данные для гридов вкладки <Телефония>
     */
    telephonyTabActivated: function() {
        this.getTelephonyNumbersGrid().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getTelephonyNumbersGrid().getStore().loadIfNeccessary();
        this.getTelephonyTrunksGrid().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getTelephonyTrunksGrid().getStore().loadIfNeccessary();
    },

    /**
     * Загружает данные по блокировкам/активации учетной записи
     */
    locksTabAcitvated: function() {
        this.getLocksGrid().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getLocksGrid().getStore().loadIfNeccessary();
    },

    /**
     * Сохраняет мультитариф
     */
    saveMultitariff: function() {
        ajax.request({
            url: 'vgrouptariffhistory/'+this.editingMultitariff.get('record_id'),
            method: 'put',
            params: {
                vg_id: this.getVgroupId(),
                tar_id_new: this.editingMultitariff.get('tar_id_new'),
                change_time: this.getMultitariffsWindowForm().down('#change_time').getValue(),
                time_to: this.getMultitariffsWindowForm().down('#time_to').getValue(),
                multi_tariff: 1,
                agent_id: this.agentData.agent.agent_id
            }
        });
    },

    /**
     * Выполняется при нажатии на колоку <Редактировати мультитариф> во вкладке <Создать/Редактировать учетную запись>/<Тарифы>
     *
     * @param arguments[5] {OSS.model.account.tariff.History} мультитариф
     */
    editMultiTariff: function() {
        if (!arguments[5].get('is_multi')) {
            return;
        }
        this.editingMultitariff = arguments[5];
        if (!this.getMultitariffsWindow()) {
            this.getView('tariffs.multi.Window').create();
        }
        this.getMultitariffsWindow().show();
        this.setFormValues({
            form: this.getMultitariffsWindowForm(),
            fields: ['tar_new_name', 'time_to', 'change_time'],
            record: this.editingMultitariff
        });
    },

    /**
     * Выполняется после получения данных об агенте, связанном с учетной записью
     */
    onAgentDataLoaded: function() {
        this.getAccountTariffsHistory().enable();
        if (this.isEthernetAgent()) {
            this.field('ip_det').enable();
            this.field('port_det').enable();
        } else {
            this.field('ip_det').disable();
            this.field('port_det').disable();
        }
        if (this.isInternetAgent() || this.isVoIPAgent()) {
            this.field('max_sessions').enable();
        } else {
            this.field('max_sessions').disable();
        }
        if (this.isInternetAgent()) {
            this.getDeviceFieldset().show();
            this.getNetworkTab().enable();
            this.field('shape').enable();
            this.field('tar_shape').enable();
        } else {
            this.getDeviceFieldset().hide();
            this.getNetworkTab().disable();
            this.field('shape').disable();
            this.field('tar_shape').disable();
        }
        if (this.isTelephonyAgent()) {
            this.getTelephonyTab().enable();
        } else {
            this.getTelephonyTab().disable();
        }
        if ((this.isUsBoxAgent() && this.useCerberCript) && this.vgroupData.tar_id > 0) {
            this.field('cu_id').enable();
            this.getPeriodicServices().enable();
            this.getOnetimeServices().enable();
        } else {
            this.field('cu_id').disable();
            this.getPeriodicServices().disable();
            this.getOnetimeServices().disable();
        }
        if (this.isSnmpAgent() || this.isTelephonyAgent() || (this.isUsBoxAgent() && !this.useCerberCript)) {
            this.getOptionsFields().disable();
        } else {
            this.getOptionsFields().enable();
        }
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом UsBox и возвращает FALSE в противном случае
     */
    isSnmpAgent: function() {
        return this.agentData.agent.type == 14;
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом UsBox и возвращает FALSE в противном случае
     */
    isUsBoxAgent: function() {
        return this.agentData.agent.type == 13;
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом телефонии и возвращает FALSE в противном случае
     */
    isTelephonyAgent: function() {
        return this.agentData.agent.type >= 6 && this.agentData.agent.type <= 12;
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом интернет и возвращает FALSE в противном случае
     */
    isInternetAgent: function() {
        return this.agentData.agent.type <= 6;
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом ethernet и возвращает FALSE в противном случае
     */
    isEthernetAgent: function() {
        return this.agentData.agent.type <= 5;
    },

    /**
     * Возвращает TRUE, если агент, связанный с учетной записью, является агентом ethernet и возвращает FALSE в противном случае
     */
    isVoIPAgent: function() {
        return this.agentData.agent.type == 12;
    },

    /**
     * Получает данные об агенте
     *
     * @param callback {Function} функция, которая должна быть выполнена после получения данных об агенте
     * @param scope {Object} Значение this в callback
     */
    getAgent: function(callback, scope) {
        if (this.agentData) {
            Ext.bind(callback, scope)();
        }
        ajax.request({
            url: 'agents/'+this.param('agent_id'),
            method: 'get',
            noAlert: true,
            success: function(result) {
                this.agentData = result;
                Ext.bind(callback, scope)();
            },
            scope: this
        });
    },

    /**
     * Устанавливает значение комбобокса агентов
     */
    setAgent: function() {
        var field = this.field('agent_id'),
            value = this.vgroupData.agent_id,
            display = this.vgroupData.agent_name;
        field.setValueWithDisplay(value, display);
    },

    /**
     * Устанавливает значение комбогрида пользователей соответствующее данным загруженной учетной запси
     */
    setUser: function() {
        var field = this.field('uid'),
            value = this.vgroupData.uid,
            display = this.vgroupData.user_name;
        field.setValueWithDisplay(value, display);
    },

    /**
     * Устанавливает значение комбогрида договоров соответствующие данным загруженной учетной записи
     */
    setAgreement: function() {
        var field = this.field('agrm_id'),
            value = this.vgroupData.agrm_id,
            display = this.vgroupData.agrm_num;
        field.setValueWithDisplay(value, display);
    },

    setCommonFormValues: function() {
        this.setAgent();
        this.setUser();
        this.setAgreement();
        this.setTariff(this.vgroupData.tar_id, this.vgroupData.tar_name);
        this.param('login', this.vgroupData.login);
    },

    /**
     * Получает данные о назначенном на учетку тарифе
     */
    getTariff: function() {
        ajax.request({
            url: 'tariffs/'+this.vgroupData.tar_id,
            method: 'get',
            noAlert: true,
            success: function(result) {
                this.tariffData = result;
                this.onTariffDataLoaded();
            },
            scope: this
        });
    },

    /**
     * Выполняется после получения данных о назначенном на учетку тарифе
     */
    onTariffDataLoaded: function() {
    },

    onVgroupDataLoaded: function() {
        this.setCommonFormValues();
        this.getTariffChooseBtn().disable();
        this.getAgent(this.onAgentDataLoaded, this);
        this.getTariff();
        this.getAgreement();
        this.getAgentOptions();
        this.field('agent_id').setReadOnly(true);
        this.hideOrShowLeftCommonOptions();
        this.getDocumentsTemplateContainer().enable();
        if (this.checkIfManagerCanViewTariff()) {
            this.getTariffShowBtn().enable();
        } else {
            this.getTariffShowBtn().disable();
        }
    },

    /**
     * Проверяет доступен ли для менеджера просмотр тарифа назначенного на учетку
     */
    checkIfManagerCanViewTariff: function() {
        return true;
    },

    /**
     * Скрывает или показывает левую часть вкладки <Общие> в зависимости от того является ли учетная запись созданной на основе шаблона, или нет
     */
    hideOrShowLeftCommonOptions: function() {
        if (this.vgroupData.template > 0 && !this.hasTpl) {
            this.field('uid').setReadOnly(true);
            this.field('agrm_id').setReadOnly(true);
            this.field('pass').setReadOnly(true);
            this.field('parent_vg_id').setReadOnly(true);
            this.field('connected_from').setReadOnly(true);
            this.field('login').setReadOnly(true);
            this.getAddressFieldContainer().disable();
            this.getAccountTariffsHistory().disable();
            this.getLocksGrid().disable();
            this.getPromoButton().disable();
            this.getEquipmentButton().disable();
            this.getStatisticsButton().disable();
            this.getHistoryButton().disable();
            this.getUserButton().disable();
            this.getPayButton().disable();
        } else {
            this.getPromoButton().enable();
            this.getEquipmentButton().enable();
            this.getStatisticsButton().enable();
            this.getHistoryButton().enable();
            this.getUserButton().enable();
            this.getPayButton().enable();
            this.field('uid').setReadOnly(false);
            this.field('agrm_id').setReadOnly(false);
            this.field('pass').setReadOnly(false);
            this.field('parent_vg_id').setReadOnly(false);
            this.field('connected_from').setReadOnly(false);
            this.field('login').setReadOnly(false);
            this.getAddressFieldContainer().enable();
            this.getAccountTariffsHistory().enable();
            this.getLocksGrid().enable();
        }
    },

    /**
     * Получаем опции агента
     */
    getAgentOptions: function() {
        ajax.request({
            url: 'agents/options',
            params: {
                id: this.vgroupData.agent_id
            },
            noAlert: true,
            method: 'get',
            success: function(result) {
                this.agentOptions = result;
                this.onAgentOptionsLoaded();
            },
            scope: this
        });
    },

    /**
     * Выполняется после получения опций агента
     */
    onAgentOptionsLoaded: function() {
    },

    /**
     * Получает данные о договоре, связанном с учетной записью
     */
    getAgreement: function() {
        ajax.request({
            url: 'agreements/'+this.vgroupData.agrm_id,
            method: 'get',
            noAlert: true,
            success: function(result) {
                this.agreementData = result;
                this.onAgreementDataLoaded();
            },
            scope: this
        });
    },

    /**
     * Выполняется после получения данных о договоре
     */
    onAgreementDataLoaded: function() {
    },

    removeTariff: function() {
        if (arguments[5].get('group_id') > 0) {
            this.__removeRec(
                arguments[5],
                'Tariff was assigned from unions. If you delete tariff from account tariff will removed to all accounts of this union. Are you sure to delete tariff?',
                {
                    is_multi: arguments[5].get('is_multi') ? 1 : 0
                }
            );
        } else {
            this.__removeRec(
                arguments[5],
                null,
                {
                    is_multi: arguments[5].get('is_multi') ? 1 : 0
                }
            );
        }
    },

    localAsPanelExpanded: function() {
        this.getLocalAs().getStore().setExtraParams({
            vg_id: this.getVgroupId(),
            local: 1
        });
        this.getLocalAs().getStore().loadIfNeccessary();

    },

    __removeRec: function(record, message, params) {
        var __message = message || 'Do You really want to remove selected records',
            __params = params || {};
        Ext.Msg.confirm(i18n.get('Info'), i18n.get(__message), function(btn) {
             if (btn != 'yes') {
                 return;
             }
             record.destroy({
                 params: __params
             });
        }, this);
    },

    removeRec: function() {
        this.__removeRec(arguments[5]);
    },

    networkAddressesPanelExpanded: function() {
        this.getNetworkAddresses().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getNetworkAddresses().getStore().loadIfNeccessary();
    },

    assignedNetworkGridCheckboxClicked: function() {
        var record = arguments[5];
        record.set('type', (record.get('type') == 1 ? 0 : 1));
        record.save();
    },

    networkTabActivated: function() {
        this.getAssignedNetworksGrid().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getAssignedNetworksGrid().getStore().loadIfNeccessary();
    },

    getVgroupId: function() {
        return this.vgroupId;
    },

    tariffsTabActivated: function() {
        this.getAccountTariffsHistory().getStore().setExtraParams({
            vg_id: this.getVgroupId()
        });
        this.getAccountTariffsHistory().getStore().loadIfNeccessary();
    },

    accountTabChanged: function() {
        arguments[1].fireEvent('tabactivated', arguments[1]);
    },

    tariffsGridWindow: function() {
        if (!this.getTariffsGridWindow()) {
            this.getView('tariffs.Grid').create();
        }
        this.getTariffsGridWindow().show();
    },

    chooseTariff: function() {
        if (this.getTariffChooseBtn().disabled) {
            return;
        }
        if (!this.getTariffsWindow()) {
            this.getView('tariffs.Window').create();
        }
        this.getTariffsWindow().show();
        this.getChoosenTariff().setValue(this.choosenTariffId);
        this.getChoosenTariff().setRawValue(this.choosenTariffName);
    },

    chooseParent: function() {
        if (!this.getAccountsWindow()) {
            this.getView('accounts.Window').create();
        }
        this.getAccountsWindow().show();
    },

    findUserInWindow: function() {
        this.getUsersWindowToolbar().refreshGrid();
    },

    chooseUser: function() {
        if (!this.getUsersWindow()) {
            this.getView('users.Window').create();
        }
        this.getUsersWindow().show();
    },

    backToList: function() {
        this.getMain().getLayout().setActiveItem('list');
    },

    onGeneratePassOptionLoaded: function(option) {
        this.generatePassOption = option;
        this.generatePass();
    },

    /**
     * Выполняется при загрузке опции <Use CerberCrypt>
     */
    onUseCerberCryptOptonLoaded: function(option) {
        this.useCerberCript = (option == '1' ? true : false);
        if (!this.useCerberCript) {
            this.field('cu_id').disable();
        } else {
            this.field('cu_id').enable();
        }
    },

    onPassLengthOptionLoaded: function(option) {
        this.passLengthOption = option;
        this.generatePass();
    },

    onPassNumbersOptionLoaded: function(option) {
        this.passNumbersOption = option;
        this.generatePass();
    },

    generatePass: function() {
        var chars,
            pass = '',
            i;
        if (this.passLengthOption === undefined) {
            return;
        }
        if (this.generatePassOption === undefined) {
            return;
        }
        if (this.passNumbersOption === undefined) {
            return;
        }
        if (this.generatePassOption !== '1') {
            return;
        }
        chars = '1234567890123456789012345';
        if (this.passNumbersOption !== '1') {
            chars += 'bcdfghjkmnpqrstvwxyzBCDFGHJKMNPQRSTVWXYZ-_';
        }
        for (i = 0; i < this.passLengthOption; i ++) {
            pass += chars[Math.round(Math.random() * chars.length) - 1];
        }
        if (!this.getVgroupId()) {
            this.param('pass', pass);
        }
    },

    /**
     * Возвращает поле формы <Общие>
     *
     * @param name {String} имя поля
     * @return {Ext.form.field.Field} поле
     */
    field: function(name) {
        return this.getCommonForm().getForm().findField(name);
    },

    param: function(name, value) {
        var field = this.field(name);
        if (value !== undefined) {
            field.setValue(value);
        } else {
            return field.getValue();
        }
    },

    hasTpl: false,

    getVgroupData: function() {
        this.getSaveButton().disable();
        ajax.request({
            url: 'vgroup/' + this.getVgroupId(),
            method: 'get',
            noAlert: true,
            success: function(result) {
                this.vgroupData = result;
                this.onVgroupDataLoaded();
                this.getSaveButton().enable();
            },
            scope: this
        });
    },

    /**
     * Сбрасывает полученные данные об учетной записи
     */
    clearVgroupData: function() {
        this.getTariffChooseBtn().disable();
        this.getCommonForm().getForm().reset();
        this.vgroupData = null;
        this.agentData = null;
        this.newTariffData = null;
        this.choosenTariffId = null;
    },

    /**
     * Выполняется при получении значения опции <Запретить смену договора учётной записи>
     */
    onCanChangeAgreementOptionLoaded: function(result) {
        this.canChangeAgreement = result == '1' ? false : true;
        this.setAgreementFieldState();
    },

    /**
     * Устанавливает состояние комбогрида договоров в зависимости от настроек интерфейса
     */
    setAgreementFieldState: function() {
        this.field('agrm_id').setReadOnly(this.canChangeAgreement);
        this.field('uid').setReadOnly(this.canChangeAgreement);
    },

    canChangeAgreement: null,

    /**
     * Выполняется после получения значения опции <Разрешенные символы в пароле учетной записи>
     */
    onRegPassLoaded: function(option) {
        var i,
            fields = this.getPasswordContainer().query();
        if (!option || option === '') {
            return;
        }
        this.allowedPasswordSymbols = option;
        this.getPasswordContainer().getLayout().getActiveItem().isValid();
    },
        
    /**
     * Получает права на просмотр пароля. Как не знаю.
     */
    canViewPassword: function() {
        return true;
    },

    __create: function(id) {
        this.getController('OSS.controller.accounts.Item').showForm(id);
    },

    create: function() {
        this.__create();
    },

    /**
     * Выключает выделенные учетные записи
     */
    turnOffAccounts: function() {
        this.changeAccountState('off');
    },

    /**
     * Включает выделенные учетные записи
     */
    turnOnAccounts: function() {
        this.changeAccountState('on');
    },

    /**
     * Меняет состояние учетной записи
     *
     * @param blk {String} тип блокировки
     */
    changeAccountState: function(blk) {
        var records = this.getAccountsGrid().getSelectionModel().getSelection(),
            i,
            vgroups = [];
        for (i = 0; i < records.length; i ++) {
            vgroups.push({
                blocked: records[i].get('blocked'),
                vg_id: records[i].get('vg_id')
            });
        }
        ajax.request({
            url: 'block',
            params: {
                vgroups: Ext.JSON.encode(vgroups),
                state: blk
            }
        });
    },

    /**
     * Загружает в хранилище комбобокса тарифов тарифы соответствующие агенту,
     * выбранному в комбобоксе агентов
     *
     * @param combo {Ext.form.field.ComboBox} комбобокс тарифов
     * @param value {Integer} комбобокс тарифов
     */
    loadTariffsAccordingToAgentType: function(combo, value) {
        var type = combo.getStore().getAt(combo.getStore().findExact(combo.valueField, value)).get('type');
        this.getTariffsCombo().getStore().getProxy().extraParams = { types: Ext.JSON.encode(this.getTariffTypes(type)) };
        this.loadTariffsComboStore();
    },

    /**
     * Загружает хранилище комбобокса агентов
     */
    loadAgentComboStore: function() {
        this.getAgentsCombo().getStore().getProxy().extraParams.no_remulate_on_naid = 1;
        this.loadComboStore(this.getAgentsCombo());
    },

    /**
     * Загружает хранилище комбобокса тарифов
     */
    loadTariffsComboStore: function() {
        this.loadComboStore(this.getTariffsCombo());
    },

    /**
     * Загружает хранилище комбобокса
     */
    loadComboStore: function(combo) {
        combo.getStore().load({
            callback: function() {
                combo.setValue(0);
            },
            scope: this
        });
    },

    /**
     * Добавляет элемент <Все> в комбобокс
     */
    addAllItem: function(combo) {
        combo.getStore().insert(0, { id: 0, name: OSS.Localize.get('All') });
    },

    /**
     * Добавляет элемент <Все> в комбобокс агентов
     */
    addAllAgentsItem: function() {
        this.addAllItem(this.getAgentsCombo());
    },

    /**
     * Добавляет элемент <Все> в комбобокс тарифов
     */
    addAllTariffsItem: function() {
        this.addAllItem(this.getTariffsCombo());
    },

    /**
     * Возвращает тип тарифа соответствующий типу агента
     *
     * @param agentType {Integer} тип агента
     * @return {Integer}
     */
    getTariffTypes: function(agentType) {
        if (agentType >= 1 && agentType <= 5) {
            return [0];
        } else if (agentType == 6) {
            return [1,2];
        } else if (agentType >= 7 && agentType <= 11) {
            return [3];
        } else if (agentType == 12) {
            return [4];
        } else if (agentType == 13) {
            return [5];
        } else if (!agentType) {
            return [];
        } else {
            throw 'invalid type';
        }
    },

    /**
     * Открывает окно виджета статистики списаний
     *
     * @param arguments[5] {OSS.model.Account} выбранная учетная запись
     */
    showRentStatisticsPanel: function() {
        this.showWidgetPanel(arguments[5], 'History');
    },

    /**
     * Открывает окно виджета платежей
     *
     * @param arguments[5] {OSS.model.Account} выбранная учетная запись
     */
    showPaymentsPanel: function() {
        this.showWidgetPanel(arguments[5], 'Payments');
    },

    /**
     * Открывает окно виджета
     *
     * @param vgroup {OSS.model.Account} выбранная учетная запись
     * @param controller {String} название контроллера виджета
     */
    showWidgetPanel: function(vgroup, controller) {
        ajax.request({
            url: 'agreements/' + vgroup.get('agrm_id'),
            method: 'GET',
            success: function(result) {
                Ext.app.Application.instance.getController(controller).showPanel({
                    uid: vgroup.get('uid'), 
                    agrm: Ext.create('OSS.model.users.Agreement', result[0])
                });
            },
            noAlert: true
        });
    },

    /**
     * Вызывается после визуализации панели учетных записей
     */
    onAccountsRendered: function() {
        this.getUseCerberLicenseOption();
        this.loadAgentComboStore();
    },

    /**
     * Получает свойство лицензии usecerber
     */
    getUseCerberLicenseOption: function() {
        ajax.request({
            url: 'license',
            method: 'GET',
            noAlert: true,
            success: function(result) {
                this.usecerber = result.usecerber;
                if (this.usecerber) {
                    this.getProperty().getStore().add({ id: 10, name: OSS.Localize.get('Card') + ' CerberCrypt' });
                    this.getCcard().show();
                }
            },
            scope: this
        });
    },

    showTemplates: function() {
        this.getAccountsPanel().getLayout().setActiveItem('templates');
        this.getStatusCombo().hide();
        this.getAccountsStore().removeAll();
        this.getAccountsStore().getProxy().extraParams.is_template = 1;
    },

    showAccounts: function() {
        this.getAccountsPanel().getLayout().setActiveItem('accounts');
        this.getStatusCombo().show();
        this.getAccountsStore().removeAll();
        this.getAccountsStore().getProxy().extraParams.is_template = 0;
    },
    
    onRemoveAccounts: function() {
        Ext.create('OSS.helpers.DeleteList', {
            panel: this.getAccountsGrid(),
            empty: function() {
                Ext.Msg.show({
                    title: i18n.get('Information'),
                    msg: i18n.get('Please, select some item'),
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
            },
            confirmation: {
                message: i18n.get(
                    'Do you realy want to remove selected accounts?'
                )
            }
        }).run();
    },
    
    selectTbarAgentType: function(combo, record) {
        this.getAccountsGrid().getStore().getProxy().setExtraParam('agent_types', combo.getValue());
        this.getAccountsGrid().getStore().reload();
    }
    
});
