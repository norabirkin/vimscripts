/**
 * Автоматическое обновление таблицы генерации документов
 */
Ext.define('OSS.helpers.reports.Reloading', {
    constructor: function(config) {
        this.initConfig(config);
        this.addProgramChangeHandler();
        this.addProgramRemoveHandler();
        this.addGuestStateChangeHandler();
    },
    addProgramRemoveHandler: function() {
        if (this.getController().getProgName() == this.progName) {
            this.getController().on('programremove', this.destroy, this);
        }
    },
    destroy: function() {
        this.getController().un('programchanged', this.onProgramChanged, this);
        this.getController().un('login', this.onLogin, this);
        this.getController().un('logout', this.onLogout, this);
        this.getController().un('programremove', this.destroy, this);
    },
    getController: function() {
        return Ext.app.Application.instance.getController('Viewport');
    },
    addGuestStateChangeHandler: function() {
        this.getController().on('logout', this.onLogout, this);
        this.getController().on('login', this.onLogin, this);
    },
    onLogout: function() {
        if (this.getController().getProgName() == this.progName) {
            this.stopAutoReloading();
        }
    },
    onLogin: function() {
        if (this.getController().getProgName() == this.progName) {
            this.start();
        }
    },
    addProgramChangeHandler: function() {
        this.progName = this.getController().getProgName();
        this.getController().on('programchanged', this.onProgramChanged, this);
    },
    onProgramChanged: function(newName, oldName) {
        if (newName == this.progName) {
            this.start();
        } else if (oldName == this.progName) {
            this.stopAutoReloading();
        }
    },
    config: {
        button: null,
        interval: 10,
        reloadingStateParamName: 'autoreload',
        defaultState: 'off',
        callback: function() {},
        scope: {}
    },
    applyButton: function(value) {
        this.setButton(value);
    },
    setButton: function(value) {
        value.setHandler(Ext.bind(this.toggle, this));
        this.button = value;
    },
    autoReloadInterval: null,
    counter: 0,
    start: function() {
        this.resetCounter();
        if (this.getState() == 'on') {
            this.initAutoReloading();
        }
    },
    setState: function(value) {
        Ext.util.Cookies.set(this.reloadingStateParamName, value,
            Ext.Date.add(new Date(), Ext.Date.DAY, 365),
            Ext.Ajax.getBaseUrl() + '/'
        );
    },
    getState: function() {
        var state = Ext.util.Cookies.get(this.reloadingStateParamName);
        if (!state) {
            state = this.defaultState;
            this.setState(state);
        }
        return state;
    },
    getAutoReloadInterval: function() {
        return this.autoReloadInterval;
    },
    setAutoReloadInterval: function(interval) {
        this.autoReloadInterval = interval;
    },
    setButtonText: function() {
        switch (this.getState()) {
            case "on": 
                this.getButton().setText(i18n.get('Turn off auto reloading') + ' ('+this.counter+')');
                break;
            case "off": 
                this.getButton().setText(i18n.get('Turn on auto reloading'));
                break;
        }
    },
    turnOn: function() {
        this.setState('on');
        this.setButtonText();
        this.initAutoReloading();
    },
    turnOff: function() {
        this.setState('off');
        this.resetCounter();
        this.stopAutoReloading();
    },
    stopAutoReloading: function() {
        clearInterval(this.getAutoReloadInterval());
    },
    countOver: function() {
        return this.counter === 0;
    },
    resetCounter: function() {
        this.counter = this.getInterval();
        this.setButtonText();
    },
    decreaseCounter: function() {
        this.counter --;
        this.setButtonText();
    },
    eachInterval: function() {
        if (this.countOver()) {
            this.resetCounter();
            Ext.bind(this.callback, this.scope)();
        } else {
            this.decreaseCounter();
        }
    },
    initAutoReloading: function() {
        var me = this;
        this.setAutoReloadInterval(window.setInterval(function() {
            me.eachInterval();
        }, 1000));
    },
    toggle: function() {
        if (this.getState() == 'on') {
            this.turnOff();
        } else if (this.getState() == 'off') {
            this.turnOn();
        }
    }
});
