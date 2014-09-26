Ext.define('OSS.controller.Users', {
    extend: 'Ext.app.Controller',
    // Documents statuses
    STATUS_DONE: 0,
    STATUS_LOADING: 1,
    STATUS_CANCELED: 3,
    STATUS_ERROR: 4,
    requires: [
        'OSS.controller.AdditionalFieldsWidget',
        'OSS.ux.form.field.SearchField',
        'OSS.ux.HeadMsg',
        'OSS.ux.button.DinamicMenu',
        'OSS.controller.Addresses'
    ],
    stores: [
        'searchtemplates.Distinct',
        'SearchTemplates',
        'Users',
        'Agreements',
        'currency.Grid',
        'users.UserDocuments',
        'users.Operators',
        'users.Categories',
        'users.Agreements',
        'OperatorsList',
        'users.OwnerOperators',
        'users.Groups',
        'users.UserAgreements',
        'users.UserTypes',
        'users.UserVgroups',
        'users.UserBillsDelivery',
        'users.UserDocuments',
        'users.DocumentTypes',
        'documenttemplates.UserDocuments'
    ],
    views: [
        'users.searchtemplate.toolbar.Combo',
        'Users',
        'Addresses',
        'users.List',
        'users.Agreements',
        'users.Terminate',
        'AdvancedSearch',
        'users.Adresses',
        'users.Search',
        'users.TypeColumn',
        'users.UserForm',
        'printforms.AccountsComboGrid',
        'printforms.AgreementsComboGrid'
    ],
    view: 'Users',
    refs: [{
        selector: 'users > users_list > toolbar > #actions > menu > #remove',
        ref: 'remove'
    }, {
        selector: 'users > users_agreements',
        ref: 'agreements'
    }, {
        selector: 'users > user_form',
        ref: 'userForm'
    }, {
        selector: 'users > users_list',
        ref: 'usersList'
    }, {
        selector: 'users > user_form #userAgreementsTab',
        ref: 'userAgreementsTab'
    }, {
        selector: 'users > user_form #vgroupsGrid',
        ref: 'userVgroupsGrid'
    }, {
        selector: 'users > user_form #agreementForm',
        ref: 'agreementForm'
    }, {
        selector: 'users > user_form #agreementsGrid',
        ref: 'userAgreementsGrid'
    }, {
        selector: 'users > user_form #userInformationForm',
        ref: 'userInformationForm'
    }, {
        selector: 'users > user_form > #userInformationTab > form > #userInformationByType',
        ref: 'userInformationByType'
    }, {    
        selector: 'users > user_form > #userDocumentsTab',
        ref: 'userDocumentsTab'
    }, {    
        selector: 'users > user_form > toolbar #actionsBtn',
        ref: 'actionsBtn'
    }, {
        selector: 'users',
        ref: 'main'
    }, {
        selector: 'users > users_list > toolbar',
        ref: 'toolbar'
    }, {
        selector: 'users > users_list > toolbar #searchField',
        ref: 'topSearchField'
    }, {
        selector: 'users > users_list > toolbar #searchType',
        ref: 'topSearchCombo'
    }, {
        selector: 'users_terminate',
        ref: 'usersTerminate'
    }, {
        selector: 'users_terminate > form',
        ref: 'usersTerminateForm'
    }, {
        selector: 'users > users_list > toolbar > #advanced > combo[name=search_template]',
        ref: 'templateCombo'
    }, {
        selector: 'users > user_form #namingsCtn',
        ref: 'namingContainer'
    }, {
        selector: 'users > user_form #createVgroupBtn',
        ref: 'createVgroupBtn'
    }, {    
        selector: 'users > user_form > #userDocumentsTab > form',
        ref: 'userDocumentsForm'
    },{    
        selector: 'users > user_form > #userDocumentsTab > gridpanel',
        ref: 'userDocumentsGrid'
    }, {
        selector: 'users > user_form > toolbar > splitbutton > menu',
        ref: 'mainFormMenu'
    }, {
        selector: 'users > user_form > #userDocumentsTab > form #apCnt',
        ref: 'apCnt' // abon. plata ;)
    }, {
        selector: 'users > user_form > #userInformationTab > #userInformationForm > fieldset > fieldcontainer > #password > #genPasswordBtn',
        ref: 'genPasswordBtn'
    }, {
        selector: 'users > user_form > #userInformationTab > #userInformationForm > fieldset > fieldcontainer > #password > #wrap',
        ref: 'passwordCard'
    }, {
        selector: 'users > user_form > #userAgreementsTab > tabpanel > #agreementForm > #basic > #inner > #number > #templates',
        ref: 'numberTemplates'
    }, {
        selector: 'users > user_form > #userAgreementsTab > tabpanel > #agreementForm > #basic > #inner > #number > #templates > menu',
        ref: 'numberTemplatesMenu'
    }],
    init: function() {
        this.control({
            'users > users_list': {
                render: this.loadUsers,
                selectionchange: this.setRemoveBtnState
            },
            'users > users_list #agreements': {
                click: this.onAgreementsButtonClicked
            },
            'users > users_agreements #back': {
                click: this.showList
            },
            'users > users_list > toolbar > #find': {
                click: this.search
            },
            'users > users_list > toolbar > #actions > menu > #remove': {
                click: this.removeUsers
            },
            'users > users_list #payments': {
                click: this.showUserPayments
            },
            'users > users_list #address': {
                click: this.showAddress
            },
            'users > users_list #rent_charges': {
                click: this.showRentCharges
            },
            'users > users_agreements #payments': {
                click: this.showAgreementsPayments
            },
            'users > users_agreements #rent_charges': {
                click: this.showAgreementsRentCharges
            },
            'users > users_list #terminate': {
                click: this.showUsersTerminateAgreements
            },
            'users_terminate > toolbar > #save': {
                click: this.terminateAgreement
            },
            'users > users_list > toolbar > #advanced > #templates': {
                click: this.showTemplatesWindow
            },
            'users > users_list #editUserBtn': {
                click: this.onEditButtonClicked
            },
            'users > user_form > toolbar #back': {
                  click: this.backToUserList
            },
            'users > user_form > #userDocumentsTab': {
                activate: this.activateDocumentsTab,
                deactivate: this.deactivateDocumentsTab
            },
            'users > user_form > panel > panel > gridpanel > toolbar #backToUserAgreementsBtn': {
                  click: this.backToUserAgreements
            },
            'users > user_form > toolbar #saveUserBtn': {
                  click: this.saveUserData
            },
            'users > user_form > toolbar #showAddons': {
                  click: this.showAddonsWidget
            },
            'users > users_list > toolbar > #actions > menu > #userCreateBtn': {
                click: this.addNewUser
            },
            'users > users_list #findUserBtn': {
                click: this.userSearch
            },
            'users > user_form > #userInformationTab > form #userType': {
                  select: this.changeUserType
            },
            'users > user_form #addAgreement': {
                click: this.addNewAgreement
            },
            'users > user_form #addNewDocumentBtn': {
                click: this.addNewDocument
            },
            'users > user_form #createVgroupBtn': {
                click: this.createVgroup
            },
            'users > user_form #agreementsGrid': {
                itemclick: this.loadAgreementForm
            },
            'users > user_form #editVgroupBtn': {
                click: this.editVgroup
            },
            'users > user_form #showChargesBtn': {
                click: this.showVgCharges
            },
            'users > user_form #creditField': {
                focus: this.onCreditFieldFocus
            },
            
            'users > user_form > toolbar #cancelAgrmBtn': {
                click: this.showAgreementsTerminateAgreements
            },
            'users > user_form > toolbar #removeAgrmBtn': {
                click: this.deleteAgreement
            },
            'users > user_form > toolbar #blockVgBtn': {
                click: this.blockAgrmAccounts
            },
            'users > user_form > toolbar #unblockVgBtn': {
                click: this.activateAgrmAccounts
            },
            
            'users > user_form > #userInformationTab > form #copyToFirstBtn': {
                  click: this.copyAddressFields
            },
            'users > user_form > #userInformationTab > form #copyToSecondBtn': {
                  click: this.copyAddressFields
            },
            'users > user_form > #userInformationTab > form #copyToThirdBtn': {
                  click: this.copyAddressFields
            },
            'users > user_form > #userInformationTab > form #copyToAllBtn': {
                  click: this.copyAddressFields
            },
            
            'users > user_form > #userInformationTab > form #addressLegalBtn': {
                  click: this.setUserAddress
            },
            'users > user_form > #userInformationTab > form #addressPostalBtn': {
                  click: this.setUserAddress
            },
            'users > user_form > #userInformationTab > form #addressDeliveryBtn': {
                  click: this.setUserAddress
            },
            'users > user_form > #userInformationTab > form #clearFirstAddressBtn': {
                  click: this.clearUserAddress
            },
            'users > user_form > #userInformationTab > form #clearSecondAddressBtn': {
                  click: this.clearUserAddress
            },
            'users > user_form > #userInformationTab > form #clearThirdAddressBtn': {
                  click: this.clearUserAddress
            },
            'users > user_form > #userInformationTab > form #genPasswordBtn': {
                  click: this.generatePassword
            },
            'users > user_form > #userDocumentsTab > form #agreementsCG': {
                afterrender: this.onAgrmRender, // CG is combogrid
                change: this.onChangeAgrm
            },
            'users > user_form > #userDocumentsTab > form #accountsCG': {
                afterrender: this.onRenderCG
            },
            'users > user_form > #userAgreementsTab': {
                //render: this.addTemplatesMenu,
                activate: this.activateAgreementsTab,
                deactivate: this.deactivateAgreementsTab
            },
            'users > user_form > #userDocumentsTab templateslist': {
                afterrender: this.templatesListRender,
                change: this.selectTemplate
            },
            'users > user_form > #userDocumentsTab > gridpanel #saveDocumentBtn': {
                click: this.saveDocument
            },
            'users > user_form > #userDocumentsTab > form #apCbox': {
                change: this.apCheckboxSet
            },
            'users > user_form > #userAgreementsTab > tabpanel > #agreementForm > #basic > #inner > #number > #templates > menu > menuitem': {
                click: 'chooseTemplate'
            }, 
            'users > user_form #vgroupsGrid': {
                afterrender: 'onVgroupsRender'
            }
        });
        OSS.component.Profile.onChanged('change_usertype', function(value) {
            this.getUserInformationForm().getForm().findField('type').setReadOnly((
                this.getUserInformationForm().getForm().findField('uid').getValue() > 0 &&
                value
            ) ? true : false);
        }, this);
    },

    addTemplatesMenu: function() {
        var store = this.getController('Settings').getSettingsAgreementTemplatesStore();
        store.load({
            received: function() {
                store.on('load', this.onAgreementTemplatesLoaded, this);
                this.onAgreementTemplatesLoaded();
            },
            scope: this
        });
    },

    onAgreementTemplatesLoaded: function() {
        var items = [];
        this.getController('Settings').getSettingsAgreementTemplatesStore().each(function(item) {
            items.push({
                text: item.get('value')+' ('+Ext.util.Format.ellipsis(item.get('descr'), 60)+')',
                value: item.get('value')
            });
        });
        this.getNumberTemplatesMenu().removeAll();
        this.getNumberTemplatesMenu().add(items);
    },

    chooseTemplate: function(item) {
        Ext.Ajax.request({
            url: 'index.php/api/agreements/autoNumber',
            params: {
                templ: item.value
            },
            success: function(response) {
                this.getAgreementForm().getForm().findField('agrm_num').setValue(response.JSONResults.agrm_num);
            },
            scope: this
        });
    },


    /**
     * Creates vgroup
     */
    createVgroup: function() {
        var agrm_id = 0;
        if (
            this.getUserForm().getActiveTab().itemId == 'userAgreementsTab' &&
            this.getAgreementForm().getForm().findField('agrm_id').getValue()
        ) {
            agrm_id = this.getAgreementForm().getForm().findField('agrm_id').getValue();
        }
        this.goToVgroups(null, {
            scope: this,
            onClear: function() {
                OSS.helpers.accounts.Data.getAccount().set('uid', this.getUserForm().user_id);
                OSS.helpers.accounts.Data.getAccount().set('user_name', this.getUserForm().user_name);
            },
            onFormFilled: function() {
                this.getController('OSS.controller.accounts.Item').load.setAgreement(
                    agrm_id
                );
            }
        });
    },

    /*
    * Press 'edit' in vgroups grid
    *
    */
    
    editVgroup: function() {
        var record = arguments[5];
        this.goToVgroups(record.get('vg_id'));
        // Press edit btn in vgroups grid (user agreements form)
    },
    
    /**
     * Goes to accounts section
     */
    goToVgroups: function(vg_id, params) {
        this.getController('viewport.Menu').addProgram('accounts');
        this.getController('OSS.controller.accounts.Item').showForm(vg_id, params);
    },
    
    setRemoveBtnState: function( component, selections ) {
        this.getRemove().setDisabled( selections.length == 0 );
        this.getRemove().setIconCls( selections.length == 0 ? 'x-ibtn-def-dis x-ibtn-delete' : 'x-ibtn-def x-ibtn-delete' );
    },
    removeUsers: function() {
        Ext.create('OSS.helpers.DeleteList', {
            panel: this.getUsersList(),
            confirmation: {
                message: i18n.get('Do you realy want to delete selected users?')
            }
        }).run();
    },
    saveAddress: function( address ) {
        var type = parseInt(address.type)+1;
        this.getUserInformationForm().getForm().findField( 'address_code_' + type ).setValue(address.code);
        this.getUserInformationForm().getForm().findField( 'address_' + type ).setValue(address.address);
        this.getUserInformationForm().getForm().findField( 'address_descr_' + type ).setValue(address.address);
    },
    showAddress: function() {
        if(Ext.isEmpty(arguments[5])) {
            var user = this.getUserForm().user_id;
        } else {
            var user = arguments[5];
        }

        Ext.create('OSS.view.users.Adresses', {
            user: user
        }).show();
    },
    showTemplatesWindow: function() {
        Ext.app.Application.instance.getController('SearchTemplates').openWindow({ 
            templatesCombo: this.getTemplateCombo(),
            searchFunction: Ext.bind( this.search, this )
        });
    },
    showAgreementsTerminateAgreements: function() {
        var record = this.getUserAgreementsGrid().getSelectionModel().getSelection();
        this.showTerminateAgreements(null, record[0].data.agrm_id);
        this.setTerminateAgreementsTitle(record[0]);
    },
    showUsersTerminateAgreements: function() {
        this.showTerminateAgreements(arguments[5]);
        this.setTerminateAgreementsTitle(arguments[5]);
    },
    setTerminateAgreementsTitle: function(record) {
        this.getUsersTerminate().setTitle(i18n.get('Termination of agreement')+': ('+record.get('agrm_id')+') '+record.get('agrm_num'));
    },
    showTerminateAgreements: function(record, agrm_id) {
        if (record) {
            this.setAgreementsUid(record);
        }
        if (!this.getUsersTerminate()) {
            this.getView('users.Terminate').create({
                agrm_id: agrm_id
            });
        }
        this.getUsersTerminate().show();
    },
    terminateAgreement: function() {
        var agrm_id = this.getUsersTerminateForm().getForm().findField('agrm_id').getValue(),
            mask = new Ext.LoadMask({
                target: this.getAgreementForm()
            });
            mask.show();
        Ext.Ajax.request({
            url: 'index.php/api/agreements/close',
            params:  this.getUsersTerminateForm().getValues(),
            success: function() {
                this.reloadAgreementForm(agrm_id, function() {
                    mask.hide();
                });
            },
            failure: function() {
                mask.hide();
            },
            scope: this
        });
        this.getUsersTerminate().hide();
    },

    reloadAgreementForm: function(agrm_id, callback) {
        OSS.model.Agreement.load(agrm_id, {
            success: function(record) {
                this.loadAgreementForm(this.getUserAgreementsGrid(), record);
                callback();
            },
            failure: function() {
                callback();
            },
            msg: true,
            scope: this
        });
    },

    getAgreementsStore: function() {
        if (!this.agreementsStore) {
            this.agreementsStore = OSS.ux.form.field.ComboGrid.createStore('OSS.store.Agreements');
        }
        return this.agreementsStore;
    },
    setAgreementsUid: function( record ) {
        this.getAgreementsStore().proxy.extraParams = {
            uid: record.get('uid')
        };
    },       
    blockRequest: function(params) {
        ajax.request({
            url: 'block',
            method: 'POST',
            params: params,
            success: function(result) {
                this.getUserVgroupsGrid().getStore().reload();
            },
            scope: this
        });
    },
    blockAgrmAccounts: function() {
        var record = this.getUserAgreementsGrid().getSelectionModel().getSelection(),
            agrm_id = record[0].data.agrm_id;
        
        if(agrm_id <= 0) {
            return;
        }
        
        this.blockRequest({
            agrm_id: agrm_id,
            state: 'off'
        });
    },
    activateAgrmAccounts: function() {
        var record = this.getUserAgreementsGrid().getSelectionModel().getSelection(),
            agrm_id = record[0].data.agrm_id;
            
        if(agrm_id <= 0) {
            return;
        }
        
        this.blockRequest({
            agrm_id: agrm_id,
            state: 'on'
        });
    },
    showAgreementsRentCharges: function() {
        var record = arguments[5];
        Ext.app.Application.instance.getController('History').showPanel({
            uid: this.selectedUserID,
            agrm: record
        });
    },
    showRentCharges: function() {
        var record = arguments[5];
        Ext.app.Application.instance.getController('History').showPanel({ uid: record.get('uid') });
    },
    showUserPayments: function() {
        var record = arguments[5];
        Ext.app.Application.instance.getController('Payments').showPanel({ uid: record.get('uid') });
    },
    showAgreementsPayments: function() {
        var record = arguments[5];
        Ext.app.Application.instance.getController('Payments').showPanel({
            uid: this.selectedUserID, 
            agrm: record
        });
    },
    search: function() {
        this.getToolbar().refreshGrid();
    },
    loadUsers: function(panel) {
        panel.getStore().load();
    },
    showAgreements: function() {
        var store = this.controller.getAgreements().getStore();
        this.controller.getMain().getLayout().setActiveItem( this.controller.getAgreements() );
        store.proxy.extraParams = { uid: this.record.get('uid') };
        store.load();
    },
    selectedUserID: 0,
    onAgreementsButtonClicked: function() {
        var store = this.getOperatorsListStore(),
            record = arguments[5],
            scope = { controller: this, record: record };
        this.selectedUserID = record.get( "uid" );
        if (store.getCount() === 0) {
             store.load({ scope: scope, callback: this.showAgreements });
        } else {
            Ext.bind( this.showAgreements, scope )();
        }
    },
    showList: function() {
        this.getMain().getLayout().setActiveItem( 0 );
    },
    
    showAddonsWidget: function() {
        var records = this.getUserAgreementsGrid().getSelectionModel().getSelection();
        if(this.getUserForm().getActiveTab().itemId == 'userAgreementsTab') {
            if(records.length > 0 && records[0].data.agrm_id > 0) {
                this.showAgrmAddonsWidget();
            } else {
                Ext.Msg.alert(i18n.get('Info'), i18n.get('Please select agreement to display additional fields'));
            }
        } else {
            this.showUserAddonsWidget();
        }
    },
    
    showAgrmAddonsWidget: function() {
        // find controller and create view
        Ext.app.Application.instance.getController('AdditionalFieldsWidget');       
        var win = Ext.create('OSS.view.AdditionalFieldsWidget'),
            records = this.getUserAgreementsGrid().getSelectionModel().getSelection();

        win.config.displayData = 1; // set config param to display valid tab (press Setup btn)
        win.config.agrm_id = records[0].data.agrm_id; // set config param to display valid tab (press Setup btn)
        win.setTitle(win.title + ': ' + i18n.get('Agreements')); // Set beautiful window title 
        win.getLayout().setActiveItem(1); // set active card: additional fields on agreement
        win.items.get(1).reconfigure('addons.AddonsValuesAgreements');
        
        win.show();
    },
    
    showUserAddonsWidget: function() {
        // find controller and create view
        Ext.app.Application.instance.getController('AdditionalFieldsWidget');       
        var win = Ext.create('OSS.view.AdditionalFieldsWidget');
        
        win.config.displayData = 0; // set config param to display valid tab (press Setup btn)
        win.config.user_id = this.getUserInformationForm().getForm().findField('uid').getValue(); // set config param to display valid tab (press Setup btn)
        win.setTitle(win.title + ': ' + i18n.get('Users')); // Set beautiful window title 
        win.getLayout().setActiveItem(1); // set active card: additional fields on agreement
        win.items.get(1).reconfigure('addons.AddonsValuesUsers');

        win.show();
    },
    
    
    /************** User Form **************/
    
    
    /*
    * Load store for Combo-Grid widget (agreements list in combo)
    *
    */    
    
    getUserAgrmStore: function() {
        if (!this.agreementsStore) {
            this.agreementsStore = OSS.ux.form.field.ComboGrid.createStore('OSS.store.Agreements');
            //this.agreementsStore.proxy.extraParams.uid = uid;
        }
        return this.agreementsStore;
    },
    
    
    /*
    * Load vgroup list of agreement to grid
    *
    * @param object grid
    *
    * @param object record
    *
    */
    
    loadAgreementForm: function(grid, record) {
        
        var form = this.getAgreementForm().getForm();
        if (this.getUserAgreementsGrid().getStore().findExact('agrm_id', record.get('agrm_id')) == -1) {
            return;
        }
        this.showVgroups(grid, record);    
        
        this.getAgreementForm().enable();
        
        form.findField('oper_id').getStore().load();
        form.findField('owner_id').getStore().load();
        
        /*********************
        * If agreement exist
        **********************/
        if(record.data.agrm_id > 0) {
            
            var arr = ['blockVgBtn', 'unblockVgBtn', 'removeAgrmBtn', 'cancelAgrmBtn', 'secondSeparator'];
            Ext.each(this.getMainFormMenu().items.items, function(item){
                if(Ext.Array.indexOf(arr, item.itemId) >= 0) {
                    item.show();
                    item.enable();
                }            
            });
            
            Ext.Ajax.request({
                url: 'index.php/api/agreements/findPromissedPayment',
                params: {
                    agrm_id: record.data.agrm_id,
                    uid: record.data.uid
                },
                success: function() {
                    var response = Ext.JSON.decode(arguments[0].responseText);
                    if (!response.success) {
                        return;
                    }

                    form.findField('promissedExist').setValue( (!Ext.isEmpty(response.results)) ? 1 : 0);
                    this.getAgreementForm().resetOriginalValues();
                    form.findField('credit').setFieldStyle( (!Ext.isEmpty(response.results)) ? 'color: red;' : 'color: black;');
                },
                scope: this
            });
            
            
        } else {
            
            /*********************
            * If agreement NOT exist
            **********************/
            
            var arr = ['blockVgBtn', 'unblockVgBtn', 'cancelAgrmBtn', 'secondSeparator'];
            Ext.each(this.getMainFormMenu().items.items, function(item){
                item.enable();
                if(Ext.Array.indexOf(arr, item.itemId) >= 0) {
                    item.disable();
                }
            });
            
            Ext.Ajax.request({
                url: 'index.php/api/settings/0',
                method: 'get',
                params: {
                    name: 'default_operator'
                },
                scope: this,
                success: function(response) {
                    var oper_id = Ext.Ajax.res(response);
                    if (form.findField('oper_id').getStore().findExact('uid', oper_id) != -1) {
                        form.findField('oper_id').setValue(parseInt(oper_id, 0));
                        this.getAgreementForm().resetOriginalValues();
                    } else {
                        form.findField('oper_id').getStore().load({
                            callback: function() {
                                form.findField('oper_id').setValue(parseInt(oper_id, 0));
                                this.getAgreementForm().resetOriginalValues();
                            },
                            scope: this
                        });
                    }
                }
            });
            Ext.create('OSS.store.currency.Grid').load({
                callback: function(records) {
                    var i,
                        me = this;
                    for (i = 0; i < records.length; i ++) {
                        this.eachCurrency(records[i]);
                    }
                },
                scope: this
            });
        } // end else
        
        
        this.getAgreementForm().restoreOriginalValues();
        form.reset();
        form.setValues(record.data);
        
        if(Ext.isEmpty(record.data.owner_id) || record.data.owner_id < 0) {
            form.findField('owner_id').setValue(null);
            form.findField('owner_id').setRawValue(null);
        }
        
        if(Ext.isEmpty(record.data.oper_id) || record.data.oper_id < 1) {
            form.findField('oper_id').setValue(null);
            form.findField('oper_id').setRawValue(null);
        }
        
        form.findField('friend_agrm_id').setRawValue(record.data.friend_number);
        form.findField('parent_agrm_id').setRawValue(record.data.parent_number);
        
        switch(record.data.balance_status) {
            case 1:
                status = i18n.get('unknown');
            break;
            case 2:
                status = i18n.get('debtor');
            break;
            case 3:
                status = i18n.get('denouncement');
            break;
            case 4:
                status = i18n.get('partner');
            break;
            default: 1
        }
        form.findField('balance_status').setValue(status);
        this.getAgreementForm().resetOriginalValues();
    },

    eachCurrency: function(record) {
        var me = this,
            form = this.getAgreementForm().getForm();
            callback = function() {
            form.findField('cur_id').setValue(record.get('id'));
            me.getAgreementForm().resetOriginalValues();
        };
        if (record.get('is_def')) {
            if (form.findField('cur_id').getStore().findExact('id', record.get('id')) != -1) {
                callback();
            } else {
                form.findField('cur_id').getStore().load({
                    callback: callback
                });
            }
        }
    },
    
    
    /*
    * Load vgroup list of agreement to grid
    *
    * @param object grid
    *
    * @param object record
    *
    */
    
    showVgroups: function(grid, record) {
        if(record.get('agrm_id') == 0) {
            return;
        }
        var grid = this.getUserVgroupsGrid();
        grid.getStore().getProxy().extraParams.agrm_id = record.get('agrm_id');
        grid.getStore().reload();
    },
    
    
    /*
    * Function which load form data and set some properties to form's components
    *
    * @param object data
    *
    */
    
    loadUserForm: function( data ) {
        var form = this.getUserInformationForm().getForm(),
            agrmForm = this.getAgreementForm().getForm(),
            data = data || {};
            
        this.getAgreementForm().disable();    
        this.getGenPasswordBtn().disable();
        // Load data to form
        if(!Ext.isEmpty(data) && data.uid > 0) {
            form.setValues(data);
            this.getUserVgroupsGrid().getStore().removeAll();
            
            agrmForm.findField('parent_agrm_id').getStore().getProxy().extraParams.uid = data.uid;
            agrmForm.findField('parent_agrm_id').getStore().reload();
            agrmForm.findField('cur_id').getStore().load();
            this.getUserAgreementsTab().enable();
            this.getUserDocumentsTab().enable();
            this.getCreateVgroupBtn().enable();
            
        } else {
            data.uid = 0;
        }
        
        
        
        ajax.request({
            url: 'userForm/AllowGenPassword',
            method: 'GET',
            scope: this,
            success: function(result) {
                if(result) {
                    this.getGenPasswordBtn().enable();
                }
            },
            noAlert: true
        });
        
        form.findField('type').setReadOnly((
            data.uid > 0 &&
            OSS.component.Profile.get('change_usertype')
        ) ? true : false);
        form.findField('category').setReadOnly((data.uid > 0) ? true : false);            
        this.setOpenPassState(data);
    },

    setOpenPassState: function(data) {
        if (data.uid > 0) {
            OSS.model.managers.Managers.load(
                Ext.app.Application.instance.getController(
                    'Viewport'
                ).getManager().person_id, {
                    success: function(record) {
                        if (record.get('open_pass')) {
                            this.getPasswordCard().setOpen(true);
                        } else {
                            this.getPasswordCard().setOpen(false);
                            if (data.fake_pass) {
                                this.getPasswordCard().setValue(data.fake_pass);
                            } else {
                                this.getPasswordCard().setValue(data.pass);
                            }
                            this.getUserInformationForm().resetOriginalValues();
                            this.getUserInformationForm().isValid();
                        }
                    },
                    scope: this
                }
            );
        } else {
            this.getPasswordCard().setOpen(true);
        }
    },
    
    
    /*
    * Switch subpanels in user's form panel
    *
    * @param integer type
    *
    */
    
    changeInfoPanel: function( type ) {
        type = parseInt(type);
        this.getNamingContainer().items.get( (type > 1) ? 0 : 1 ).hide();
        this.getNamingContainer().items.get( (type < 2) ? 0 : 1 ).show();
        this.getUserInformationByType().items.get( (type > 1) ? 0 : 1 ).disable();
        this.getUserInformationByType().items.get( (type < 2) ? 0 : 1 ).enable();
        this.getUserInformationByType().getLayout().setActiveItem( (type < 2) ? 0 : 1 );
        
        // change address label text
        var address = this.getUserInformationForm().getForm().findField('address_1').up('container').items.get(0); // find address field, get up to container, get label
        address.setText( (type == 2) ? i18n.get('Registered address') : i18n.get('Legal address') );
        
    },
    
    
    /*
    * Prepair user's form, loading data
    *
    */
    
    onEditButtonClicked: function() {
        this.showUserForm(arguments[5]);
    },
    
    /**
     * Shows user form
     */
    showUserForm: function(record) {
        var params = {
            uid: record.get('uid')
        };
        this.getUserForm().user_id = record.get('uid') || 0;
        this.getUserForm().is_template = record.get('is_template');        
        this.getUserForm().user_name = record.get('name');        
        
        this.changeInfoPanel(record.get('type'));
        
        this.getMain().getLayout().setActiveItem( this.getUserForm() );
        this.getUserForm().setActiveTab(0);
        //this.getUserAgreementsTab().getLayout().setActiveItem(0);
        
        // Load agreements grid
        
        this.getUserAgreementsGrid().store.proxy.extraParams = params;
        var userAgreementsStore = this.getUserAgreementsGrid().store;
        userAgreementsStore.load();
        
        this.getUserInformationForm().setLoading(true);
        
        Ext.Ajax.request({
            url: 'index.php/api/userForm/getUserData',
            method: 'GET',
            params: params,
            scope: this,
            callback: function() {
                this.getUserInformationForm().setLoading(false);
            },
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }                
                var data = response.results;
                this.loadUserForm(data);
                this.getUserInformationForm().resetOriginalValues();
            }
        });
    },
    
    
    /*
    * Push button "Back to users list" action
    *
    */
    
    backToUserList: function() {
        this.getMain().getLayout().setActiveItem(0);
        this.getUserInformationForm().restoreOriginalValues();
        this.getAgreementForm().restoreOriginalValues();
        this.getUserInformationForm().getForm().reset();
        this.getAgreementForm().getForm().reset();
        this.getUserAgreementsGrid().getStore().removeAll();
        
        this.getUserVgroupsGrid().getStore().getProxy().extraParams.agrm_id = 0;
        this.getUserVgroupsGrid().getStore().removeAll();
    },
    
    
    /*
    * Get back from vgroups list to agreements list
    *
    */
    
    backToUserAgreements: function() {
        this.getUserAgreementsTab().getLayout().setActiveItem(0);
    },
    
    
    /*
    * Prepairing and saving user form data OR agreement data
    *
    */
    
    saveUserData: function() {
        if(this.getUserForm().getActiveTab().itemId == 'userAgreementsTab') {
            // Save Agrm from
            if (!this.getAgreementForm().isValid()) {
                return;
            }
            var data = this.getAgreementForm().getForm().getValues(),
                agrmField = this.getAgreementForm().getForm().findField('agrm_id'),
                uid = this.getUserInformationForm().getForm().findField('uid').getValue();
                
                if(Ext.isEmpty(data.oper_id)) {
                    Ext.Msg.alert(i18n.get('Info'), i18n.get('Operator should not be empty'));
                    return;
                }
                
                data.uid = uid;
                
                Ext.Ajax.request({
                    url: 'index.php/api/Agreements/save',
                    method: uid > 0 ? 'POST' : 'PUT',
                    params: data,
                    scope: this,
                    msg: i18n.get('Agreement data saved'),
                    success: function() {
                        var response = Ext.JSON.decode(arguments[0].responseText);
                        if (!response.success) {
                            return;
                        }                
                        var data = response.results;
                        
                        this.getUserAgreementsGrid().getStore().proxy.extraParams.uid = uid;
                        this.getUserAgreementsGrid().getStore().load();
                        
                        // Set id to new agrm
                        if (agrmField.getValue() == 0) {
                            agrmField.setValue(data);
                        }
                        this.getAgreementForm().resetOriginalValues();
                    }
                });
            
        } else {
            // Save user form
            var data = this.getUserInformationForm().getForm().getValues();
            if (!this.getUserInformationForm().isValid()) {
                return;
            }
            
            if(data.login == '') {
                Ext.Msg.alert(i18n.get('Error'), i18n.get('Login field is required'));
                return;
            }

            if(Ext.isEmpty(data.pass)) {
                Ext.Msg.showError({ msg: { error: { code: '0100', message: i18n.get('Password could not be empty') } }, title: i18n.get('Error')  });
                return;
            }

            var pass = data.pass;
            
            data.uid = this.getUserForm().user_id;
            data.is_template = this.getUserForm().is_template;
        
            Ext.Ajax.request({
                url: 'index.php/api/userForm/saveUser',
                method: this.getUserForm().user_id > 0 ? 'POST' : 'PUT',
                params: data,
                scope: this,
                msg: i18n.get('User data saved'),
                success: function() {
                    var response = Ext.JSON.decode(arguments[0].responseText);
                    if (!response.success) {
                        return;
                    }                
                    var data = response.results;
                    
                    // Set id to new user
                    if (this.getUserForm().user_id == 0) {
                        this.getUserForm().user_id = data;
                        this.getUserInformationForm().getForm().findField('uid').setValue(data);
                        this.getUserAgreementsTab().enable();
                        this.getUserDocumentsTab().enable();
                        this.getCreateVgroupBtn().enable();
                        this.setOpenPassState({
                            uid: data,
                            pass: pass
                        });
                    }
                    this.getOperatorsListStore().load();
                    this.getUserInformationForm().resetOriginalValues();
                }
            });
        }
        
    },
    
    /*
    * Prepair form to create new user
    *
    */
    
    addNewUser: function() {
        // set user data
        this.getUserForm().user_id = 0;
        this.getUserForm().is_template = 0;        
        
        // load some values and change form's components states
        this.loadUserForm();
        //change user form panel to default state
        this.changeInfoPanel(0);
        //set tabpanel to form
        this.getUserForm().setActiveTab(0);
        // set agreements tab panel to default state (card with agreements)
        //this.getUserAgreementsTab().getLayout().setActiveItem(0);
        // switch from users list to user card tabpanel
        this.getMain().getLayout().setActiveItem( this.getUserForm() );
        this.getUserAgreementsTab().disable();
        this.getCreateVgroupBtn().disable();
    },
    
    /*
    * Change user form's subpanels state while selecting "User type" selector values 
    *
    * @param object combo
    *
    */
    
    changeUserType: function(combo) {
        var type = combo.getValue();
        this.changeInfoPanel(type);
    },
    
    
    /*
    * Save new address string
    *
    * @param object Btn
    *
    */
    
    setUserAddress: function(Btn) {
        var field = Btn.up().findParentByType('container').items;

        Ext.app.Application.instance.getController('Addresses').openWindow({
            address: {
                address: field.get(6).getValue(),
                code: field.get(3).getValue(),
                type: field.get(5).getValue(),
                uid: this.getUserInformationForm().getForm().findField('uid').getValue()
            },
            onSave: Ext.app.Application.instance.getController('Users').saveAddress,
            scope: Ext.app.Application.instance.getController('Users')
        });
    },
    
    
    /*
    * Adding new entry to agreements grid
    *
    */

    addNewAgreement: function() {
        if(this.getUserForm().getActiveTab().itemId != 'userAgreementsTab') {
            this.getUserForm().setActiveTab(1);
        }
        var grid = this.getUserAgreementsGrid(),
            store = grid.getStore(),
            node = new store.model();
            
        store.insert(0, node);
        var row = grid.getView().getNode( node ),
        column = Ext.get( row ).child("td:nth-child(2)");
        
        column.fireEvent("click");  
        
    },

    removeAgreementFromStore: function(record) {
        this.getUserAgreementsGrid().getStore().remove(record);
        this.getAgreementForm().restoreOriginalValues();    
        this.getAgreementForm().getForm().reset();
        this.getAgreementForm().disable();    
    },

    
    /*
    * Delete agreement from the grid
    *
    */

    deleteAgreement: function() {
        var record = this.getUserAgreementsGrid().getSelectionModel().getSelection(),
            agrmId = record[0].data.agrm_id;
        if(agrmId == 0) {
            this.removeAgreementFromStore(record[0]);
            return;
        }
        
        Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Do you realy want to delete this entry?" ),
            function( button ) {
                if (button != "yes") {
                    return;
                }
                this.removeAgreementFromStore(record[0]);

                Ext.Ajax.request({
                    url: 'index.php/api/Agreements/closeAndDelete',
                    method: 'POST',
                    scope: this,
                    params: {
                        agrm_id: agrmId
                    },
                    success: function() {
                        var response = Ext.JSON.decode(arguments[0].responseText);
                        this.getUserAgreementsGrid().getStore().reload();
                        // call this method to disable menu buttons
                        this.activateAgreementsTab();
                    }
                });

        }, this);
    },
    
    
    /*
    * Press on search button in toolbar
    *
    */
    
    userSearch: function() {
        var value = this.getTopSearchField().getValue(),
            type = this.getTopSearchCombo().getValue();
        this.getUsersList().getStore().setExtraParams({
            stype: type,
            svalue: value
        });
        this.getUsersList().getStore().load();
    },
    
    /*
    * Press on 'Show charges' icon in vgroups grid
    *
    * @param object grid
    *
    * @param object record
    *
    */
    
    showVgCharges: function(grid, record) {
        this.showPaymentsWidget(arguments[5], 'History');
    },
    
    
    /*
    * Show payments widget method
    *
    * @param object vgroup
    *
    * @param string controller
    *
    */
    
    showPaymentsWidget: function(vgroup, controller) {
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
    
    
    
    /*
    * Press 'Clear address'. Clear user address fields
    * 
    * @param object Btn
    *
    */
    
    clearUserAddress: function(Btn) {
        var field = Btn.up().findParentByType('container').items,
            uid = this.getUserInformationForm().getForm().findField('uid').getValue();
        
        field.get(3).setValue(null);
        field.get(4).setValue(null);
        field.get(6).setValue(null);
        
        if(uid > 0) {
            Ext.Ajax.request({
                url: 'index.php/api/userForm/deleteUserAddress',
                params: {
                    type: field.get(5).getValue(),
                    uid: this.getUserInformationForm().getForm().findField('uid').getValue()
                },
                success: function() {
                    var response = Ext.JSON.decode(arguments[0].responseText);
                    if (!response.success) {
                        return;
                    }
                },
                scope: this
            });
        }
        
    },
    
    
    /*
    * Show alert with warning message
    * 
    * @param object field
    *
    */
    
    onCreditFieldFocus: function(field) {
        var value = field.getValue(),
            promissed = field.up('form').getForm().findField('promissedExist').getValue();
            
        if(promissed > 0) {
            var message = i18n.get('The credit was extended with a promised payment.') + ' ' + i18n.get('Do not edit this field until the promised payment is effected or annulled at the end of the period');
            Ext.Msg.alert(i18n.get('Info'), message);
        }        
    },
    
    
    /*
    * Action on document template select
    * 
    * @param object combo
    *
    * @param integer value
    *
    */

    selectTemplate: function(combo, value) {
        var record = combo.getStore().findRecord('doc_id', combo.getValue()),
            form = this.getUserDocumentsForm().getForm();
        if(Ext.isEmpty(record.data)) {
            return;
        }

        switch(record.data.on_fly) {
            case 0:
               this.getApCnt()[(record.data.payable<2) ? 'hide' : 'show']();
                form.findField('vg_id').hide(); 
                this.showCorrectPeriod(record.data.document_period);
            break; 
            case 1:
            case 2:
                this.getApCnt().hide();
                form.findField('vg_id').show();
                this.showCorrectPeriod(record.data.document_period);
                break;
        }
        
        this.getApCnt().down('textfield').setValue(null);
        this.getUserDocumentsForm().getForm().findField('on_fly').setValue(record.data.on_fly);
        this.getUserDocumentsForm().getForm().findField('doc_per').setValue(record.data.document_period);
    },
    
    
    /*
    * Show or hide date fields
    * 
    * @param object data
    *
    */
    
    showCorrectPeriod: function(data) {
        var form = this.getUserDocumentsForm().getForm();
        switch(data) {
            case 0:
                form.findField('period_year').up('container').show();
                form.findField('period_since').up('container').hide();
                form.findField('date').hide();
                break;
            case 1:
                form.findField('period_year').up('container').hide();
                form.findField('period_since').up('container').show();
                form.findField('date').hide();
                break; 
            case 2:
                form.findField('period_year').up('container').hide();
                form.findField('period_since').up('container').hide();
                form.findField('date').show();
                break; 
        }
    },
    
    
    /*
    * Show menu buttons on deactivate Agreements tab
    *
    */
    
    activateAgreementsTab: function() {
        var agrmId = this.getAgreementForm().getForm().findField('agrm_id').getValue(),
            arr = ['blockVgBtn', 'unblockVgBtn', 'removeAgrmBtn', 'cancelAgrmBtn', 'secondSeparator'];
            
        Ext.each(this.getMainFormMenu().items.items, function(item){
            // все, кроме кн. генерации документа
            item[item.itemId != "addNewDocumentBtn" ? 'show' : 'hide']();
            
            if(Ext.Array.indexOf(arr, item.itemId) >= 0) {
                item[agrmId > 0 ? 'enable' : 'disable']();    
            }
                    
        });
    },
    
    
    /*
    * Hide menu buttons on deactivate Agreements tab
    * 
    */
    
    deactivateAgreementsTab: function() {
        var arr = ['blockVgBtn', 'unblockVgBtn', 'removeAgrmBtn', 'cancelAgrmBtn', 'secondSeparator'];
        Ext.each(this.getMainFormMenu().items.items, function(item){
            if(Ext.Array.indexOf(arr, item.itemId) >= 0) {
                item.hide();
                item.disable();
            }            
        });
    },
    
    
    
    /*
    * Load stores and show fields on Activate tab event
    *
    */
    
    activateDocumentsTab: function() {
        var grid = this.getUserDocumentsGrid();
        this.onRenderCG(grid);
        grid.getStore().load();        

        this.onRenderCG(this.getUserDocumentsForm().getForm().findField('vg_id'));
        this.onRenderCG(this.getUserDocumentsForm().getForm().findField('agrm_id'));
        Ext.each(this.getMainFormMenu().items.items, function(item){
            item[item.itemId == "addNewDocumentBtn" ? 'show' : 'hide']();
        });
    },
    
    
    /*
    * Clear stores on deactivate Documents Tab
    * 
    */
    
    deactivateDocumentsTab: function() {
        this.getUserDocumentsGrid().getStore().removeAll();
        this.getUserDocumentsForm().getForm().findField('vg_id').getStore().removeAll();
        this.getUserDocumentsForm().getForm().findField('agrm_id').getStore().removeAll();
        
        Ext.each(this.getMainFormMenu().items.items, function(item){
            item[(item.itemId == "addNewDocumentBtn" || item.itemId == '') ? 'hide' : 'show']();
        });
    },
    
    
    /*
    * Press 'Create document' button. Sending request to server
    * 
    * @param object Btn
    *
    */
    
    addNewDocument: function(Btn) {
        var data = this.getUserDocumentsForm().getForm().getValues();
        data['uid'] = this.getUserInformationForm().getForm().findField('uid').getValue();
        
        if(data['uid'] == '' || data['doc_id'] == '' || data['agrm_id'] == '' ) {
            return;
        }
        
        Ext.Ajax.request({
            url: 'index.php/api/userForm/AddDocument',
            method: 'PUT',
            params: data,
            scope: this,
            msg: i18n.get('Document created'),
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }                
                var data = response.results;
                
                this.getUserDocumentsGrid().getStore().reload();

            }
        });
    },
    
    
    /*
    * Set extraParam uid to comboGrid on afterrender event
    * 
    * @param object comp
    *
    */
    
    onRenderCG: function(comp) {
        // CG = ComboGrid
        var uid = this.getUserInformationForm().getForm().findField('uid').getValue();
        var store = comp.getStore();
        store.getProxy().setExtraParam('uid', uid );

    },
    
    
    /*
    * Set extraParams and zero record for agreements combogrid
    * 
    * @param object combo
    *
    */
    
    onAgrmRender: function(combo) {
        // CG = ComboGrid
        combo.getStore().removeAll();
        var uid = this.getUserInformationForm().getForm().findField('uid').getValue();
        var store = combo.getStore();
        store.getProxy().setExtraParam('uid', uid );

        combo.getStore().on('load', function(store){
            var record = Ext.data.Model([ { agrm_id: 0, agrm_num: i18n.get('All')} ]);
            store.insert( 0, record );
        });
    },


    /*
    * Download created document
    *
    */
    
    saveDocument: function() {
        var record = arguments[5];
        OSS.Download.get({
            url: "index.php/api/documentsqueue/download",
            params: {
                last_order_id: record.get('order_id')
            }
        });
    },
    
    
    /*
    * Set teplates list extraParams on afterrender event
    * 
    * @param object combo
    *
    */
    
    templatesListRender: function(combo) {
        combo.getStore().getProxy().setExtraParam('on_fly', '0,1,3,7');
    },
    
    
    /*
    * Enable or disable textfield of Summ container by clicking checkbox
    * 
    * @param object checkbox
    *
    * @param boolean state
    *
    */
    
    apCheckboxSet: function(checkbox, state) {
        this.getApCnt().down('textfield')[state ? 'disable' : 'enable']();
    },
    
    
    
    /*
    * Action on render agreements combogrid. Adding zero value on each store load
    *
    * @params object combo
    *
    */
    
    onChangeAgrm: function(combo) {
        if(combo.getValue() != '' && combo.getRawValue() == '') {
            combo.setRawValue(combo.getValue());
        }
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
                if(result != '') {
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
    * Enable or disable Blocks buttons in 'actions' menu if vgroups grid is empty
    *
    * @params object grid
    *
    */
    
    onVgroupsRender: function(grid) {
        grid.getStore().on('load', function(store) {
            var arr = ['blockVgBtn', 'unblockVgBtn'];
            Ext.each(this.getMainFormMenu().items.items, function(item){
                if(Ext.Array.indexOf(arr, item.itemId) >= 0) {
                    item[ (store.getCount() > 0) ? 'enable' : 'disable' ]();
                }
            });
        }, this);
    },
    
    copyAddressFields: function(Btn) {
        var cnt = Btn.up('button').up(),
            address = '',
            address_full = '',
            code = '';
        
        Ext.each(cnt.items.items, function(item) {
            if(item.xtype == 'hidden') {
                if(item.itemId == 'address_code') {
                    code = item.getValue();
                }
                if(item.itemId == 'address_full') {
                    address_full = item.getValue();
                }
            }           
            if(item.xtype == 'textfield') {
                address = item.getValue();
            }           
        }, this);
        
        
        var fieldsArr = [];
        
        switch(Btn.itemId) {
            case 'copyToFirstBtn':
                fieldsArr = [1];                                
            break;
            case 'copyToSecondBtn':
                fieldsArr = [2];
            break;
            case 'copyToThirdBtn':
                fieldsArr = [3];
            break;
            case 'copyToAllBtn':
                fieldsArr = [1,2,3];
            break;
        }
        
        if(fieldsArr.length == 0) return;
        if(code == '' || address_full == '' || address == '') {
            Ext.Msg.showError({ msg: { error: { code: '0100', message: i18n.get('Copied field should not be empty') } }, title: i18n.get('Error')  });
            return;
        }
        
        var form = cnt.up('form').getForm();

        Ext.each(fieldsArr, function(id) {
            form.findField('address_code_'+id).setValue(code);
            form.findField('address_'+id).setValue(address);
            form.findField('address_descr_'+id).setValue(address_full);
        }, this);
        
    }
    
    
});
