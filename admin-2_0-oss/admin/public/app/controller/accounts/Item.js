/**
 * Управляет созданием и редактированием учетной записи
 */
Ext.define('OSS.controller.accounts.Item', {
    extend: 'Ext.app.Controller',
    requires: [
        'OSS.ux.toolbar.Toolbar',
        'OSS.controller.accounts.tab.Tariffs',
        'OSS.controller.accounts.tab.UsBox',
        'OSS.ux.grid.column.Store',
        'OSS.model.account.Full',
        'OSS.model.Agreement',
        'OSS.model.account.Agent',
        'OSS.helpers.accounts.Agents',
        'OSS.helpers.accounts.Data',
        'OSS.helpers.accounts.Load',
        'OSS.helpers.accounts.Tariff',
        'OSS.helpers.accounts.tariff.Validation',
        'OSS.ux.form.field.Password'
    ],
    stores: [
        'agreements.Types',
        'accounts.Agreements',
        'Tariffs',
        'accounts.Networks',
        'agents.internet.NetworkManagement',
        'accounts.Masks',
        'accounts.FreeNetworks',
        'accounts.MacAddresses',
        'accounts.ASNumbers'
    ],
    views: [
        'accounts.List',
        'accounts.list.Filter',
        'accounts.list.Grid',
        'accounts.Item',
        'accounts.item.Common',
        'accounts.item.common.Left',
        'accounts.item.common.left.Agreements',
        'accounts.item.common.left.Parent',
        'accounts.item.common.Right',
        'accounts.item.common.right.Tariff',
        'accounts.item.common.right.StatusAndBalance',
        'accounts.item.common.right.Options',
        'accounts.item.common.right.Device',
        'accounts.item.common.right.tariff.Combogrid',
        'accounts.item.Tariffs',
        'accounts.item.Locks',
        'accounts.item.UsBox',
        'accounts.item.usbox.OneTime',
        'accounts.item.usbox.Periodic',
        'accounts.item.Toolbar',
        'addresses.Button',
        'accounts.item.Networking',
        'accounts.item.IPCombo'
    ],
    refs: [{
        selector: 'accounts > #form > #common > form > #right > #statusAndBalance > #balance > #pay',
        ref: 'payBtn'
    }, {
        selector: 'accounts > #form > #common > form > #right > #tariff > #rent',
        ref: 'rent'
    }, {
        selector: 'accounts > #form > #common > form > #right > #tariff > #field > #choose',
        ref: 'tariffButton'
    }, {
        selector: 'accounts > #form > #common > form > #right > #tariff',
        ref: 'tariffFieldset'
    }, {
        selector: 'accounts > #form',
        ref: 'tabs'
    }, {
        selector: 'accounts',
        ref: 'main'
    }, {
        selector: 'accounts > #form > #common > form',
        ref: 'common'
    }, {
        selector: 'accounts > #form > #common > toolbar > #actions > #rent',
        ref: 'rentHistory'
    }, {
        selector: 'accounts > #form > #common > form > #left > fieldset > #user > #details',
        ref: 'userDetails'
    }, {
        selector: 'accounts > #list > #wrap > #accounts',
        ref: 'list'
    }, {
        selector: 'accounts > #form > #common > form > #left > fieldset > #password > #wrap',
        ref: 'passwordCard'
    }, {
        selector: 'accounts > #form > #common > form > #left > fieldset > #password > #wrap > #open',
        ref: 'openPass'
    }, {
        selector: 'accounts > #form > #common > form > #left > fieldset > #password > #wrap > #hidden',
        ref: 'hiddenPass'
    }, {
        selector: 'accounts #generatePwdBtn',
        ref: 'generatePwdBtn'
    }, {
        selector: 'accounts #networking',
        ref: 'networkPanel'
    }, {
        selector: 'accounts #networking > #mainCnt > panel > toolbar',
        ref: 'networkTbar'
    }, {
        selector: 'accounts #networking #leftPanel',
        ref: 'leftPanel'
    }, {
        selector: 'accounts #networking #rightPanel',
        ref: 'rightPanel'
    }, {
        selector: 'accounts #networking #segmentsListCmb',
        ref: 'segmentsListCmb'
    }, {
        selector: 'accounts #networking #IPComboList',
        ref: 'IPComboList'
    }, {
        selector: 'accounts #networking #availableGrid',
        ref: 'availableGrid'
    }, {
        selector: 'accounts #networking #assignedGrid',
        ref: 'assignedGrid'
    }, {
        selector: 'accounts #networking #macsGrid',
        ref: 'macsGrid'
    }, {
        selector: 'accounts #networking #numbersGrid',
        ref: 'numbersGrid'
    }, {
        selector: 'accounts #telephony #telephonyForm',
        ref: 'telephonyForm'
    }, {
        selector: 'accounts #telephony #telephonyGrid',
        ref: 'telephonyGrid'
    }],
    init: function() {
        this.callParent(arguments);
        this.initHelpers();
        this.getController('OSS.controller.accounts.tab.Tariffs');
        this.getController('OSS.controller.accounts.tab.UsBox');
        this.control({
            'accounts > #form > #common > form > #left > fieldset > combo[name=agent_id]': {
                change: 'agentChanged'
            },
            'accounts > #form > #common > form > #left > fieldset > #user > combogrid1[name=uid]': {
                change: 'userChanged'
            },
            'accounts > #form > #common > form > #left > fieldset combogrid1[name=agrm_id]': {
                change: 'agreementChanged'
            },
            'accounts > #form > #common > form > #right > #tariff > #field > #choose': {
                click: 'openTariffWindow'
            },
            'accounts > #form > #common > toolbar > #actions > #save': {
                click: 'save'
            },
            'accounts > #form > panel > toolbar > #back': {
                click: 'back'
            },
            'accounts > #form': {
                tabchange: 'onTabChange'
            },
            'accounts > #form > #tariffs': {
                tabactivated: 'onTabActivated'
            },
            'accounts > #form > #locks': {
                tabactivated: 'onTabActivated'
            },
            'accounts > #form > #networking': {
                tabactivated: 'onNetTabActivated'
            },
            'accounts > #form > #telephony': {
                tabactivated: 'onTelTabActivated'
            },
            'accounts > #form > grid_with_edit_window[usboxTab]': {
                tabactivated: 'onTabActivated'
            },
            'accounts > #form > #common > form > #right > #statusAndBalance > #balance > #pay': {
                click: 'pay'
            },
            'accounts > #form > panel > toolbar > #actions > #rent': {
                click: 'showRentHistory'
            },
            'accounts > #form > panel > toolbar > #actions > #addonsBtn': {
                click: 'addonsWidget'
            },
            'accounts > #form > #common > form > #left > fieldset > #user > #details': {
                click: 'showUser'
            },
            'accounts  #generatePwdBtn': {
                click: 'generatePassword'
            },
            'accounts #networking > #mainCnt > panel > toolbar > button': {
                click: 'switchNetworkPanel'
            },
            'accounts #networking #linkWithIP': {
                change: 'linkWithIPSwitch'
            },
            'accounts #networking #calcBtn': {
                click: 'calcIP'
            },
            'accounts #networking #addSelectedBtn': {
                click: 'addSelectedIP'
            },
            'accounts #networking #removeIP': {
                click: 'removeIP'
            },
            'accounts #networking #removeMAC': {
                click: 'removeMAC'
            },
            'accounts #networking #removeNumber': {
                click: 'removeIP'
            },
            'accounts #networking #addMacBtn': {
                click: 'addMacAddress'
            },
            'accounts #networking #addNumBtn': {
                click: 'addNumber'
            },
            'accounts #telephony > toolbar > #actionsBtn': {
                arrowclick: 'telActionsMenuShow',
                click: 'telActionsMenuShow'
            },
            'accounts #telephony > toolbar > #actionsBtn > #createBtn': {
                click: 'clearTelForm'
            },
            'accounts #telephony > toolbar > #actionsBtn > #saveBtn': {
                click: 'saveTelForm'
            },
            'accounts #telephony > toolbar > #actionsBtn >  #removeBtn': {
                click: 'removeTelEntries'
            },
            'accounts #telephony > grid #editTelEntry': {
                click: 'editTelEntry'
            }
        });
    },
    /**
     * Выполняется после загрузки данных в форму
     */
    afterFormFill: function() {
        this.allowGenPassword();
        this.setOpenPassState();
        this.getCommon().isValid();
    },
    /**
     * Скрывает или открывает пароль в зависимости от настроек менеджера
     */
    setOpenPassState: function(nofake) {
        if (
            OSS.helpers.accounts.Data.getManager().get('open_pass') ||
            !OSS.helpers.accounts.Data.getAccount().get('vg_id')
        ) {
            this.getPasswordCard().setOpen(true);
        } else {
            this.getPasswordCard().setOpen(false);
            if (nofake) {
                this.getPasswordCard().setValue(
                    OSS.helpers.accounts.Data.getAccount().get('pass')
                );
            } else {
                this.getPasswordCard().setValue(
                    OSS.helpers.accounts.Data.getAccount().get('fake_pass')
                );
            }
        }
    },
    /**
     * Переход в раздел <Пользователи>
     */
    showUser: function() {
        var account = OSS.helpers.accounts.Data.getAccount();
        this.mask(true);
        OSS.model.User.load(account.get('uid'), {
            success: function(record) {
                this.getController('viewport.Menu').addProgram('users');
                this.getController('Users').showUserForm(record);
                this.mask(false);
            },
            failure: function() {
                this.mask(false);
            },
            scope: this
        });
    },
    /**
     * Открывает окно платежей
     */
    pay: function() {
        if (this.getPayBtn().disabled) {
            return;
        }
        this.getController('Payments').showPanel({
            uid: OSS.helpers.accounts.Data.getAccount().get('uid'),
            agrm: OSS.helpers.accounts.Data.getAgreement(),
            onBalanceChanged: Ext.bind(this.onBalanceChanged, this)
        });
    },
    /**
     * Выполняется при изменении баланса в результате манипуляций в форме платежей
     */
    onBalanceChanged: function(balance) {
        OSS.helpers.accounts.Data.
            getAgreement().
            set('balance', balance);
        this.displayAgreement();
    },
    /**
     * Открывает окно истории списаний
     */
    showRentHistory: function() {
        if (this.getRentHistory().disabled) {
            return;
        }
        this.getController('History').showPanel({
            uid: this.field('uid').getValue(),
            agrm: this.field('agrm_id').getRecord()
        });
    },
    /**
     * Создает хелперы
     */
    initHelpers: function() {
        this.load = Ext.create('OSS.helpers.accounts.Load', {
            controller: this
        });
        this.tariff = Ext.create('OSS.helpers.accounts.Tariff', {
            controller: this
        });
        this.agents = Ext.create('OSS.helpers.accounts.Agents', {
            controller: this
        });
    },
    /**
     * Показывает форму создания/редактирования учетной записи
     *
     * @param vg_id {Integer} ID учетки
     */
    showForm: function(vg_id, params) {
        this.getTabs().setActiveTab(0);
        this.getMain().getLayout().setActiveItem('form');
        this.load.initAccount(vg_id, params);
    },
    /**
     * Выполняется при изменении значения комбобокса агентов
     */
    agentChanged: function(field) {
        if (!this.load.fillingForm) {
            OSS.helpers.accounts.Data.setAgent(field.getRecord());
        }
        this.tariff.checkSchedulingAvailability();
        this.agents.refresh();
    },
    /**
     * Выполняется при изменении значение комбогрида пользователей
     */
    userChanged: function() {
        this.getUserDetails()[arguments[1] ? 'enable' : 'disable']();
        this.setUid('agrm_id', arguments[1]);
        this.setUid('parent_vg_id', arguments[1]);
        this.field('agrm_id').getStore().reload();
    },
    /**
     * Задает параметр uid для запроса комбогрида
     *
     * @param field {String} имя комбогрида
     * @param uid {Integer} значение uid
     */
    setUid: function(field, uid) {
        field = this.field(field);
        field.setReadOnly(uid ? false : true);
        field.setValue(null);
        field.getStore().proxy.extraParams.uid = uid;
    },
    /**
     * Выполняется при изменении значения комбогрида договоров
     */
    agreementChanged: function(field) {
        if (!this.load.fillingForm) {
            OSS.helpers.accounts.Data.setAgreement(field.getRecord());
        }
        this.tariff.checkSchedulingAvailability();
        this.displayAgreement();
    },
    /**
     * Присваивает значение полю баланса и типа договора
     */
    displayAgreement: function() {
        this.getPayBtn()[
            OSS.helpers.accounts.Data.getAgreement() && OSS.helpers.accounts.Data.getAccount().get('vg_id') ?
            'enable' :
            'disable'
        ]();
        this.getCommon().getForm().setValues({
            balance: (
                OSS.helpers.accounts.Data.getAgreement() ?
                this.formatPrice(
                    OSS.helpers.accounts.Data.getAgreement().get('balance'),
                    OSS.helpers.accounts.Data.getAgreement().get('symbol')
                ) :
                ''
            ),
            payment_method: (
                OSS.helpers.accounts.Data.getAgreement() ?
                OSS.helpers.accounts.Data.getAgreement().get('payment_method') :
                ''
            )
        });
    },
    /**
     * Открывает окно планирования тарифа
     */
    openTariffWindow: function() {
        this.tariff.openWindow();
    },
    /**
     * Сохраняет данные учетной записи
     */
    save: function() {
        if (this.checkTariff()) {
            this.mask(true);
            OSS.helpers.accounts.Data.getAccount().save({
                ok: this.onSave,
                msg: i18n.get(
                    OSS.helpers.accounts.Data.getAccount().get('vg_id') ?
                    'Account successfully updated' :
                    'Account successfully created'
                ),
                failure: function() {
                    this.mask(false);
                },
                scope: this
            });
        }
    },
    /**
     * Выполняется после сохранения учетной записи
     */
    onSave: function(account, vg_id) {
        account.set('vg_id', vg_id);
        this.agents.refresh();
        this.displayAgreement();
        this.setOpenPassState(true);
        this.getCommon().resetOriginalValues();
        this.mask(false);
    },
    /**
     * Проверяет назначен ли тариф на учетную запись
     */
    checkTariff: function() {
        if (!OSS.helpers.accounts.Data.getAccount().get('tar_id')) {
            Ext.Msg.alert(
                i18n.get('Info'),
                i18n.get('No tariff choosen'),
                this.tariff.openWindow,
                this.tariff
            );
            return false;
        } else {
            return true;
        }
    },
    /**
     * Назад к списку
     */
    back: function() {
        this.getMain().getLayout().setActiveItem('list');
    },
    /**
     * Выполняется при смене вкладки
     */
    onTabChange: function() {
        var tab = arguments[1];
        tab.fireEvent('tabactivated', tab);
    },
    /**
     * Выполняется при активации вкладки
     */
    onTabActivated: function(tab) {
        tab.getStore().addExtraParams({
            vg_id: OSS.helpers.accounts.Data.getAccount().get('vg_id')
        }).loadIfNeccessary();
    },
    /**
     * Возвращает поле формы
     */
    field: function(name) {
        return this.getCommon().getForm().findField(name);
    },
    /**
     * Цель для маски загрузки
     */
    getMaskTarget: function() {
        return this.getCommon();
    },
    /**
     * Форматирует стоимость
     */
    formatPrice: function(value, symbol) {
        return Ext.Number.toFixed(value, 2) + ' (' + symbol + ')';
    },
    
    
    /*
    * Generate password by click the button
    *
    * @params object combo
    *
    */
    
    generatePassword: function(Btn) {
        ajax.request({
            url: 'userForm/GenPassword',
            method: 'GET',
            scope: this,
            success: function(result) {
                if (result) {
                    this.getPasswordCard().setOpen(true);
                    this.getPasswordCard().setValue(result);
                } else {
                    Ext.Msg.alert(i18n.get('Error'), i18n.get('Password is empty or was not generated'));
                }                                
            },
            noAlert: true
        });
    },
    
    
    /*
    * Allow generate password
    */
    
    allowGenPassword: function() {
        this.getGeneratePwdBtn().disable();
        ajax.request({
            url: 'userForm/AllowGenPassword',
            method: 'GET',
            scope: this,
            success: function(result) {
                if(result) {
                    this.getGeneratePwdBtn().enable();
                }
            },
            noAlert: true
        });
    },
    
    addonsWidget: function() {
        Ext.app.Application.instance.getController('AdditionalFieldsWidget');       
        var win = Ext.create('OSS.view.AdditionalFieldsWidget');
        
        win.config.displayData = 2; // set config param to display valid tab (press Setup btn)
        win.config.vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id'); // set vg_id to show data
        win.setTitle(win.title + ': ' + i18n.get('Accounts')); // Set beautiful window title 
        win.getLayout().setActiveItem(1); // set active card: additional fields on agreement
        win.items.get(1).reconfigure('addons.AddonsValuesVgroups');

        win.show();
    },
    
    //******************
    /* TELEPHONY TAB */
    //******************
    
    /**
     * Выполняется при активации вкладки
     */
    onTelTabActivated: function(tab) {
        this.getTelephonyForm().getForm().reset();
        var vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id');
        this.getTelephonyForm().getForm().findField('vg_id').setValue(vg_id);
        this.getTelephonyGrid().getStore().getProxy().setExtraParam('vg_id', vg_id);
        this.getTelephonyGrid().getStore().reload();
    },
    
    telActionsMenuShow: function(Btn) {
        Btn.showMenu();
        var records = this.getTelephonyGrid().getSelectionModel().getSelection();
        
        Btn.menu.down('[itemId=removeBtn]')[records.length>0 ? 'enable' : 'disable']();
    },
    
    
    clearTelForm: function(Btn) {   
        var form = this.getTelephonyForm().getForm(),
        vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id');
        Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Do you realy want to clear the form?" ),
            function( button ) {
                if (button != "yes") {
                    return;
                }
                form.reset();
                form.findField('vg_id').setValue(vg_id);
            }, 
        this);
    },
    
    saveTelForm: function(Btn) {
        
        var form = this.getTelephonyForm().getForm();
        if(form.findField('number').getValue() == '') {
            Ext.Msg.showError({ msg: { error: { code: '0100', message: i18n.get('Please fill required fields') } }, title: i18n.get('Error')  });
            return;
        }
        
        var params = form.getValues();
        params.type = (form.findField('device').getValue() == 2) ? 2 : 1;
        
        ajax.request({
            url: (form.findField('record_id').getValue() > 0) ? 'vgrouptelephony/'+params.record_id : 'vgrouptelephony',
            method: (form.findField('record_id').getValue() > 0) ? 'PUT' : 'POST',
            params: params,
            success: function() {
                this.getTelephonyGrid().getStore().reload();
            },
            scope: this
        });
    },
    
    removeTelEntries: function(Btn) {
        var form = this.getTelephonyForm().getForm(),
            records = this.getTelephonyGrid().getSelectionModel().getSelection(),
            ids = [];   
            
        Ext.each(records, function(record){
            ids.push(record.get('record_id'));
        });
        
        ajax.request({
            url: 'vgrouptelephony/0',
            method: 'DELETE',
            params: {
                records: ids.join(','),
                type: (form.findField('device').getValue() == 2) ? 2 : 1
            },
            success: function() {
                this.getTelephonyGrid().getStore().reload();
            },
            scope: this,
            confirmation: OSS.Localize.get('Do you realy want to delete selected users?')
        });
    },
    
    
    editTelEntry: function() {
        var form = this.getTelephonyForm().getForm(),
            data = arguments[5].data,
            vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id');

        form.reset();
        data.vg_id = vg_id;
            
        if(data.time_from != '') {
            var timeFrom = Ext.Date.parse(data.time_from, 'Y-m-d H:i:s');
                data.h_from  = Ext.Date.format(timeFrom, 'H');
                data.m_from = Ext.Date.format(timeFrom, 'i');
                data.s_from = Ext.Date.format(timeFrom, 's');
                data.date_from = Ext.Date.format(timeFrom, 'Y-m-d');
        }
        
        if(data.time_to != '') {
            var timeTill = Ext.Date.parse(data.time_to, 'Y-m-d H:i:s');
                data.h_till = Ext.Date.format(timeTill, 'H');
                data.m_till = Ext.Date.format(timeTill, 'i');
                data.s_till = Ext.Date.format(timeTill, 's');
                data.date_till = Ext.Date.format(timeTill, 'Y-m-d');
        }
        
        form.setValues(data);
    },
    
    
    //******************
    /* NETWORKING TAB */
    //******************
    
    /**
     * Выполняется при активации вкладки
     */
    onNetTabActivated: function(tab) {
        this.setToggled('ipBtn');
        var vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id'),
            agent_id = OSS.helpers.accounts.Data.getAccount().get('agent_id');
        
        this.getSegmentsListCmb().getStore().getProxy().setExtraParam('agent_id', agent_id);    
        this.getIPComboList().getStore().getProxy().setExtraParam('vg_id', vg_id);
        
        // clear some values
        this.getAvailableGrid().getStore().getProxy().setExtraParam('agent_id', 0);
        this.getAssignedGrid().getStore().getProxy().setExtraParam('agent_id', agent_id);
        this.getAvailableGrid().getStore().getProxy().setExtraParam('broadcast', '');
        
        this.getMacsGrid().getStore().getProxy().setExtraParam('agent_id', agent_id);
        this.getMacsGrid().getStore().getProxy().setExtraParam('vg_id', vg_id);    
        this.getNumbersGrid().getStore().getProxy().setExtraParam('agent_id', agent_id);
        this.getNumbersGrid().getStore().getProxy().setExtraParam('vg_id', vg_id);    
            
        this.switchPanelsById(0);
    },
    
    setToggled: function(id) {
        var buttons = this.getNetworkTbar().items.items;
        Ext.each(buttons, function(Btn) {
            if(Btn.xtype != 'button') return;
            Btn.toggle(false);
            if(Btn.itemId == id) {
                Btn.toggle(true);
            }
        });        
    },
    
    indexById: function(itemId) {
        var idx = (itemId == 'ipBtn') ? 0 : ((itemId == 'macBtn') ? 1 : 2);
        return idx;
    },
    
    switchNetworkPanel: function(Btn) {
        if(Btn.xtype=='back') {
            this.getMain().getLayout().setActiveItem('list');
            return;
        }
        var idx = this.indexById(Btn.itemId);
        this.setToggled(Btn.itemId);
        this.switchPanelsById(idx);
    },
    
    switchPanelsById: function(id) {
        this.getLeftPanel().getLayout().setActiveItem(id);
        this.getRightPanel().getLayout().setActiveItem(id);        
        this.getRightPanel().getLayout().getActiveItem().getStore().reload();
    },
    
    linkWithIPSwitch: function(checkbox, state) {
        this.getIPComboList().setDisabled(state ? false : true);
        this.getIPComboList().setValue(null);
        this.getIPComboList().setRawValue(null);
    },
    
    calcIP: function(Btn) {
        var form = Btn.up('form'),
            vals = form.getForm().getValues();
        
        var vg_id = OSS.helpers.accounts.Data.getAccount().get('vg_id'),
            agent_id = OSS.helpers.accounts.Data.getAccount().get('agent_id');

        
        var record = form.getForm().findField('segment_ip').getStore().findRecord('ip', vals.segment_ip);
        if(record == null) {
            return;
        }
        
        vals.segment_mask = record.get('mask');
        // Назначаем extraparam чтобы грид перегружался корректно
        var grid = this.getAvailableGrid().getStore().getProxy();
        grid.setExtraParam('agent_id', agent_id);
        grid.setExtraParam('vg_id', vg_id);
        grid.setExtraParam('segment_ip', vals.segment_ip);
        grid.setExtraParam('segment_mask', record.get('mask'));
        grid.setExtraParam('broadcast', vals.broadcast);
        grid.setExtraParam('mask', vals.mask);
        
        this.getAvailableGrid().getStore().currentPage = 1;
        this.getAvailableGrid().getStore().load();
    },
    
    addSelectedIP: function(Btn) {
        var grid = Btn.up('gridpanel'),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection();
        
        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Error'), i18n.get('Nothing was selected'));
            return;
        }
        
        var data = [];
        Ext.each(records, function(record) {
            data.push(record.data);
        });
        
        data = Ext.JSON.encode(data);

        ajax.request({
            url: 'networking/SetStaff',
            method: 'PUT',
            scope: this,
            params: {
                records: data,
                type: 0,
                vg_id: OSS.helpers.accounts.Data.getAccount().get('vg_id')
            },
            success: function(result) {
                this.getAssignedGrid().getStore().reload();
                this.getAvailableGrid().getStore().reload();
            },
            noAlert: true
        });
        
    },
    
    
    
    removeIP: function(Btn) {
        var grid = Btn.up('gridpanel'),
            records = grid.getSelectionModel().getSelection();
            
            if(records.length == 0) {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('Nothing was selected'));
                return;
            }
        
            var data = [];
            Ext.each(records, function(record) {
                data.push(record.get('record_id'));
            });
        
            data = Ext.JSON.encode(data);

            ajax.request({
                url: 'networking/delete',
                method: 'DELETE',
                scope: this,
                params: {
                    records: data
                },
                success: function(result) {
                    this.getAssignedGrid().getStore().reload();
                    this.getAvailableGrid().getStore().reload();
                    this.getNumbersGrid().getStore().reload();
                },
                confirmation: i18n.get('Do you realy want to delete selected entries?'),
                noAlert: true
            });    
            
    },
    
    
    removeMAC: function(Btn) {
        var grid = Btn.up('gridpanel'),
            records = grid.getSelectionModel().getSelection();
            
            if(records.length == 0) {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('Nothing was selected'));
                return;
            }
    
            var data = [];
            Ext.each(records, function(record) {
                data.push(record.get('record_id'));
            });
    
            data = Ext.JSON.encode(data);

            ajax.request({
                url: 'networking/DeleteMacs',
                method: 'DELETE',
                scope: this,
                params: {
                    records: data
                },
                success: function(result) {
                    this.getMacsGrid().getStore().reload();
                },
                confirmation: i18n.get('Do you realy want to delete selected entries?'),
                noAlert: true
            });                
    },

    
    addMacAddress: function(Btn) {
        var form = Btn.up('form'),
            mac = form.getForm().findField('macaddress').getValue(),
            ip = form.getForm().findField('ipaddress').getValue()
        
            if(mac == '') {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('Fill the mac field please'));
                return;
            }
        
        ajax.request({
            url: 'networking/SetMacStaff',
            method: 'PUT',
            scope: this,
            params: {
                mac: mac,
                network: ip,
                vg_id: OSS.helpers.accounts.Data.getAccount().get('vg_id')
            },
            success: function(result) {
                this.getMacsGrid().getStore().reload();
            },
            noAlert: true
        });
        
    },
    
    addNumber: function(Btn) {
        var form = Btn.up('form'),
            as_num = form.getForm().findField('as_num').getValue();
            
            if(as_num == '') {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('Fill the number please'));
                return;
            }
            
        ajax.request({
            url: 'networking/SetNumbers',
            method: 'PUT',
            scope: this,
            params: {
                as_num: as_num,
                vg_id: OSS.helpers.accounts.Data.getAccount().get('vg_id')
            },
            success: function(result) {
                this.getNumbersGrid().getStore().reload();
            },
            noAlert: true
        });
        
    }
    
    
});
