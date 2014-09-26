/**
 * Controller: Viewport
 * 
 */
Ext.define('OSS.controller.Viewport', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.util.Cookies',
        'Ext.data.proxy.Rest',
        'Ext.data.ArrayStore',
        'Ext.layout.*',
        'Ext.toolbar.*',
        'Ext.form.*',
        'Ext.grid.*',
        'Ext.Msg.*',
        'Ext.selection.*',
        'OSS.ux.button.Back',
        'OSS.ux.toolbar.Toolbar'
    ],
    
    views: [
       'Viewport', 
       'Authorize'
    ],
    
    stores: [
       'Programs'
    ],
    
    refs: [{
        selector: 'viewport',
        ref: 'appView'
    }, {
        selector: 'viewport > #appBody',
        ref: 'appBody'
    }, {
        selector: 'viewport [region=north]',
        ref: 'north'
    }, {
        selector: 'viewport [region=south]',
        ref: 'south'
    }, {
        selector: 'authorize',
        ref: 'authPanel'
    }, {
        selector: 'authorize > form',
        ref: 'authForm'
    }, {
        selector: 'authorize > form #authorize',
        ref: 'authButton'
    }, {
        selector: 'authorize > form #autherrormsg',
        ref: 'authErrorMsg'
    },  {
        selector: 'ossmenu',
        ref: 'ossMenu'
    }, {
        selector: 'ossheader > #info > #manager > #name',
        ref: 'managerName'
    }],
    
    /**
     * 
     */
    isGuest: Ext.undefined,
    
    
    /**
     * 
     */
    allowHistory: true,
    
    /**
     * A template method that is called when your application boots. 
     * It is called before the Application's launch function is executed so gives a hook 
     * point to run any code before your Viewport is created.
     */
    init: function(app) {
        // Init History
        Ext.History.init();
        
        // Bind Guest to the Ext.data.Connection
        Ext.override(Ext.data.Connection, {
            /**
             * Set guest state to the authorization controller
             */
            setGuest: Ext.Function.bind(this.setGuest, this),
        
            /**
             * Return isGuest current value
             * @return {Boolean}
             */
            getGuest: Ext.Function.bind(this.getGuest, this)
        });
        
        this.control({
            'viewport': {
                beforerender: this.restoreHeadersState
            },
            'authorize > form > toolbar > button': {
                click: this.Authorize
            },
            'authorize > form field': {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.Authorize();
                    }
                }
            },
            'ossmenu': {
                render: 'initRules'
            }
        });
    },

    /**
     * Authorize
     * if passed main application view, the first step need to query
     * @param  object, main application view
     */
    Authorize: function() {
        var form = this.getAuthPanel().down('form').getForm();
        if (form.isValid()) {
            this.getAuthButton().setIconCls('x-ibtn-loading x-ibtn-def');
            this.addErrorMsgMaskCls();
            form.submit({
                url: Ext.Ajax.getRestUrl('api','login', 'authorize', 0),
                method: 'PUT',
                clientValidation: true,
                scope: this,
                success: this.successLogin,
                failure: this.failLogin
            });
        }
    },

    identityRequest: function(params) {
        this.addErrorMsgMaskCls();
        Ext.Ajax.request({
            url: 'index.php/api/login/identity',
            scope: this,
            silent: true,
            success: function(response) {
                this.removeErrorMaskCls();
                this.setManager(response.JSONResults);
                this.setGuest(false);
                Ext.bind(params.callback, params.scope)();
                this.displayManagerName();
                OSS.component.Profile.load(response.JSONResults.profile);
            },
            failure: function(response) {
                this.setGuest(true);
                this.setAuthErrorMessage(response);
                Ext.bind(params.callback, params.scope)();
            }
        });
    },

    getManager: function() {
        return this.manager;
    },

    displayManagerName: function() {
        this.getManagerName().tpl.overwrite(this.getManagerName().getEl(), {
            manager: Ext.util.Format.ellipsis(this.getManager().fio || this.getManager().login, 30)
        });
    },

    setManager: function(data) {
        this.manager = data;
    },

    initRules: function() {
        if (this.getGuest()) {
            return;
        }
        this.rules = {};
        this.disallowedByRole = [];
        Ext.each(this.manager.rules, function(item) {
            this.rules[item.name] = item.rw_flags.read;
        }, this);
        this.checkRules();
        if (this.allowHistory && !this.isGuest) {

            if(Ext.History.getToken() != '') {
                this.historyChange(Ext.History.getToken());
            }
            if (!this.historyChangeHandlerBinden) {
                this.historyChangeHandlerBinden = true;
                Ext.History.on('change', function(token) {
                    this.historyChange(token);
                }, this);
            }
        }
    },

    checkRules: function(menu) {
        menu = menu || this.getOssMenu();
        menu.items.each(function(item) {
            if (!item.rule || this.rules[item.rule]) {
                item.enable();
                if (item.menu) {
                    this.checkRules(item.menu);
                }
            } else {
                item.disable();
                this.disallowByRole(item.controller);
            }
        }, this);
    },
    
    
    /**
     * Return isGuest value
     * @param state
     */
    getGuest: function() {
        return this.isGuest;
    },

    
    /**
     * Set isGuest flag value
     * @param  object, this controller
     * @param  boolean, state to set
     */
    setGuest: function(state) {
        this.isGuest = Ext.isBoolean(state) ? state : true;
        if (this.isGuest) {
            this.addErrorMsgMaskCls();
            if (!this.getAuthPanel()) {
                this.fireEvent('logout');
                this.getView('Authorize').create();
            }
        }
    },

    /**
     * Removes programs
     */
    removePrograms: function() {
        var store = this.getStore('Programs');
        store.each(function(item) {
            this.fireEvent('programremove', item.get('name'));
            Ext.getCmp(item.get('item')).destroy();
        }, this);
        this.getStore('Programs').removeAll();
    },

    /**
     * private
     */
    successLogin: function(form, action) {
        var login = this.getAuthForm().getForm().findField('login').getValue();
        this.removeErrorMaskCls();
        this.getAuthButton().setIconCls('x-button-authorize-icon-dummy');
        this.getAuthPanel().close();
        if (this.getManager() && this.getManager().login != login) {
            this.removePrograms();
        }
        this.identityRequest({
            callback: this.onSuccessfullLoginAfterIdentityRequest,
            scope: this
        });
        this.fireEvent('login');
    },

    onSuccessfullLoginAfterIdentityRequest: function() {
        this.initRules();
    },

    addErrorMsgMaskCls: function() {
        Ext.Msg.setMaskCls('authorize');
    },

    removeErrorMaskCls: function() {
        Ext.Msg.setMaskCls(null);
    },
    
    /**
     * If login failed this function will show debug message if
     * debug mode is on
     */
    failLogin: function(form, action) {
        try {
            this.setAuthErrorMessage(action.response);
        } catch (e) {
        }
    },

    setAuthErrorMessage: function(response) {
        var data = response.JSONResults,
            msg;
        this.getAuthButton().setIconCls('x-button-authorize-icon-dummy');
        if (data.error.trace) {
            Ext.Ajax.showErrorMessage(response);
        } else {
            msg = this.getAuthErrorMsg();
            msg.tpl.overwrite(msg.getEl(), { message: data.error.message || data.error.title});
            
            if (msg && !msg.isVisible()) {
                msg.show();
            }
            
            msg.stopAnimation();
            
            msg.animate({
                duration: 5,
                to: {
                    opacity: 1
                }
            });
            
            msg.animate({
                duration: 5000,
                to: {
                    opacity: 0
                }
            });
        }
    },
    
    
    /**
     * Change header and footer state
     * @params     {boolean}, true - show otherwise hide
     */
    setHeadersState: function( state ) {
        this.getNorth()[state ? 'expand' : 'collapse']();
        this.getSouth()[state ? 'expand' : 'collapse']();
    },
    
    
    /**
     * Restore headers state after page reload
     */
    restoreHeadersState: function() {
        var states = Ext.state.Manager.getProvider().state || {};
        
        if (states['oss-headers-state'] && states['oss-headers-state']['pressed'] === true) {
            this.getNorth().collapsed = true;
            this.getSouth().collapsed = true;
        }
        this.initRules();
    },
    
    
    /*
    * Change controller by using browser history    
    */
    
    historyChange: function( token ) {
        Ext.onReady(function() {
            if(token) {
                this.addProgram({
                    name: token
                });     
            }
        }, this);
    },

    disallowedPrograms: [],
    disallowedByRole: [],

    disallowProgram: function(name) {
        if (name) {
            this.disallowedPrograms.push(name);
        }
    },

    disallowByRole: function(name) {
        if (name) {
            this.disallowedByRole.push(name);
        }
    },

    programAvailable: function(name) {
        return !Ext.Array.contains(this.disallowedPrograms, name) &&
               !Ext.Array.contains(this.disallowedByRole, name);
    },
    
    /**
     * Register widget to the global store
     * add to the viewport body
     * @params     {object}
     */
    addProgram: function(data) {
        var data = data || {
            name: null  
        },
        store = this.getStore('Programs'),
        record, 
        widget, 
        controller,
        progId,
        progName = this.progName,
        me = this;
        if (!this.programAvailable(data.name)) {
            return;
        }
        
        var fireProgramChanged = function() {
            var controller = Ext.app.Application.instance.getController(Ext.String.capitalize(data.name));
            if (me.progName != data.name) {
                me.progName = data.name;
                me.fireEvent('programchanged', me.progName, progName);
                controller.fireEvent('programactivated');
                controller.programActivated();
            }
        };
        if (!(record = store.getProccess({
            property: 'name',
            value: data.name 
        }))) {
            controller = this.getController(Ext.String.capitalize(data.name));
            widget = Ext.widget(controller.getView(Ext.String.capitalize(controller.view)));
            progId = (store.max('id') || 0) + 1;
            
            record = store.add({
                id: progId,
                title: data.title || widget.title,
                name: data.name,
                state: 'show',  
                item: widget.getId()
            })[0];
            
            fireProgramChanged();
            this.getAppBody().add(widget);
        } else {
            fireProgramChanged();
            widget = Ext.getCmp(record.get('item'));
        }
        
        this.getAppBody().getLayout().setActiveItem(record.get('item'));
        
        return widget ? widget : null;
    },

    /**
     * Returns program name
     */
    getProgName: function() {
        return this.progName;
    },

    progName: 0,
    
    
    /**
     * Logout
     * public
     */
    Logout: function() {
        Ext.Ajax.request({
            url: Ext.Ajax.getRestUrl('api','login', 'logout', 0),
            method: 'PUT',
            scope: this,
            callback: function() {
                this.setGuest(this, true);
            }
        });
    }
});
