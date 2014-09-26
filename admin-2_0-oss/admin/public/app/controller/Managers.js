Ext.define('OSS.controller.Managers', {
    extend: 'Ext.app.Controller',
    views: [
        'managers.RolesEditor',
        'managers.ChangeRules',
        'managers.RulesTree',
        'Managers', 
        'managers.List', 
        'managers.ManagersForm', 
        'managers.RolesList',
        'managers.RolesForm',
        'managers.RolesForManager',
        'managers.TGRoleList',
        'managers.RoleTariffs',
        'managers.RoleGroups'
    ],
    view: 'Managers',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'OSS.ux.form.field.SearchField'
    ],
    stores: [
        'managers.RulesEditor',
        'managers.RulesTree',
        'managers.Managers', 
        'managers.Groups', 
        'managers.GroupsFilter', 
        'ManagersGroupsList', 
        'managers.Paycategories',
        'managers.Roles',
        'managers.AvailableRolesForManager',
        'managers.AssignedRolesForManager',
        'managers.AssignedRoleTariffs',
        'managers.NotAssignedRoleTariffs',
        'managers.AssignedRoleGroups',
        'managers.NotAssignedRoleGroups'
    ],
    refs: [{
        selector: 'ossmanagers', // root
        ref: 'managersRoot'
    }, {
        selector: 'managersform', // window with manager edit/create form
        ref: 'managersForm'
    }, {
        selector: 'rolesformanager',
        ref: 'rolesForManager'
    }, {
        selector: 'managersform > #windowForm', // window with form
        ref: 'managersWindowForm'
    }, {
        selector: '#managersTab', // Tabpanel: Tab Managers
        ref: 'groupsPanel'
    }, {
        selector: '#managersTab > toolbar > #back',  // Tab Managers toolbar: back button
        ref: 'backButton'
    }, {
        selector: '#rolesTab', // Tabpanel: Tab Roles
        ref: 'rolesGrid'
    }, {
        selector: '#managersTab',
        ref: 'managersTab'
    },{
        selector: '#rolesTab',
        ref: 'rolesTab'
    },{
        selector: 'rolesform > #windowForm', // window with form
        ref: 'rolesWindowForm'
    }, {
        selector: '#rulesForRoleGrid',
        ref: 'rulesForRole'
    }, {
        selector: '#roleTariffs',
        ref: 'roleTariffs'
    }, {
        selector: '#roleTariffsTab',
        ref: 'roleTariffsTab'
    }, {
        selector: '#AvailableRolesForManager',
        ref: 'availableRoles'
    }, {
        selector: '#AssignedRolesForManager',
        ref: 'assignedRoles'
    }, {
        selector: '#assignedRoleTariffs',
        ref: 'assignedRoleTariffs'
    }, {
        selector: '#freeRoleTariffs',
        ref: 'freeRoleTariffs'
    }, {
        selector: '#roleGroups',
        ref: 'roleGroups'
    }, {
        selector: '#roleGroupsTab',
        ref: 'roleGroupsTab'
    }, {
        selector: '#assignedRoleGroups',
        ref: 'assignedRoleGroups'
    }, {
        selector: '#freeRoleGroups',
        ref: 'freeRoleGroups'
    }, {
        selector: 'ossmanagers > #rolesTab > #rulesForRoleGrid > toolbar > #actions > menu > #change',
        ref: 'changeRules'
    }],
    
    
    
    init: function() {

        this.control({
            // Managers tab
            '#managersListGrid': {
                render: this.initGrid
            },
            '#managersListGrid > toolbar > button #manageradd': {
                click: this.LaunchManagersForm
            },
            '#managersListGrid > * actioncolumn': {
                click: this.onManagerActionColumn
            },
            '#managersListGrid > toolbar > #searchbtn': {
                click: this.RefreshMainGrid
            },
            'managersform': {
                beforeshow: this.onLaunchManagersForm
            },
            'managersform > toolbar > button#formSaveBtn': {
                click: this.SaveManager
            },
            '#rolesForManager > toolbar > button#back': {
                click: this.BackToManagersList
            },
            '#rolesForManager > toolbar #rolesActionsBtn': {
                arrowclick: this.enableMenuActions,
                click: this.showActionsMenu
            },
            '#rolesForManager #addSelectedRolesBtn': {
                click: this.addRoleToManager
            },
            '#rolesForManager #removeSelectedRolesBtn': {
                click: this.deleteRoleFromManager
            },
            // Roles tab
            '#rolesListGrid': {
                render: this.initGrid
            },
            '#rolesListGrid > toolbar > button #roleadd': {
                click: this.LaunchRolesForm
            },
            '#rolesListGrid > * actioncolumn': {
                click: this.onRoleActionColumn
            },
            'rolesform': {
                beforeshow: this.onLaunchRolesForm
            },
            'rolesform > toolbar > button#formSaveBtn': {
                click: this.SaveRole
            },
            '#rulesForRoleGrid > toolbar > button#back': {
                click: this.BackToRolesList
            },
            '#rulesForRoleGrid': {
                beforeedit: this.filterEditorStore,
                selectionchange: this.onRulesForRoleSelectionChange,
                edit: this.onColumnEdit
            },
            
            // Tariffs
            '#roleTariffsTab': {
                activate: this.activateGroupOrTariffsTab
            }, 
            '#roleTariffsTab #editBtn': {
                click: this.editRoleTariffs
            }, 
            '#roleTariffsTab #addSelectedTariffsBtn': {
                click: this.addSelectedTariffsRecords
            },
            '#roleTariffsTab #removeSelectedTariffsBtn': {
                click: this.removeSelectedTariffsRecords
            }, 
            '#roleTariffsTab #backBtn': {
                click: this.backToFirstItem
            },
            '#roleTariffsTab #assignedRoleTariffs': {
                edit: this.selectTariffRights
            },
            '#roleTariffsTab #roleTariffs > toolbar #actionsBtn': {
                arrowclick: this.enableMenuActions,
                click: this.showActionsMenu
            },
            '#roleTariffsTab #roleTariffs > toolbar #setRoBtn': {
                click: this.setReadWriteSelected
            },
            '#roleTariffsTab #roleTariffs > toolbar #setRwBtn': {
                click: this.setReadWriteSelected
            },
            
            
            
            
            // Groups
            '#roleGroupsTab': {
                activate: this.activateGroupOrTariffsTab
            }, 
            '#roleGroupsTab #editBtn': {
                click: this.editRoleGroups
            }, 
            '#roleGroupsTab #addSelectedGroupsBtn': {
                click: this.addSelectedGroupsRecords
            },
            '#roleGroupsTab #removeSelectedGroupsBtn': {
                click: this.removeSelectedGroupsRecords
            }, 
            '#roleGroupsTab #backBtn': {
                click: this.backToFirstItem
            },
            '#roleGroupsTab #assignedRoleGroups': {
                edit: this.selectGroupRights
            },
            '#roleGroupsTab #roleGroups > toolbar #actionsBtn': {
                arrowclick: this.enableMenuActions,
                click: this.showActionsMenu
            },
            '#roleGroupsTab #roleGroups > toolbar #setRoBtn': {
                click: this.setReadWriteSelected
            },
            '#roleGroupsTab #roleGroups > toolbar #setRwBtn': {
                click: this.setReadWriteSelected
            },
            'ossmanagers > #rolesTab > #rulesForRoleGrid > toolbar > #actions > menu > #change': {
                click: 'openChangeRulesWindow'
            }
            
        });
    },
    
    
    /**
     * Reload store data of grid (using as autoLoad)
     * @param   {object} grid
     */ 
    initGrid: function(grid) {
        grid.getStore().reload();
    },

    openChangeRulesWindow: function() {
        var selection = this.getRulesForRole().getSelectionModel().getSelection();
        this.getManagersRulesEditorStore().clearFilter();
        this.changeRulesWindow = Ext.create('OSS.view.managers.ChangeRules');
        this.changeRulesWindow.show();
        this.changeRulesWindow.down('toolbar > #cancel').on('click', function() {
            this.changeRulesWindow.close();
        }, this);
        this.changeRulesWindow.down('toolbar > #save').on('click', function() {
            this.saveChangedRules(selection, this.changeRulesWindow.down('form').getForm().getValues());
        }, this);
    },
    
    saveChangedRules: function(selection, values) {
        var records = [],
            i,
            j,
            record,
            modified,
            actions = [
                'create',
                'read',
                'delete',
                'update'
            ];
        for (i = 0; i < selection.length; i ++) {
            record = selection[i];
            if (!record.get('enabled')) {
                continue;
            }
            modified = false;
            for (j = 0; j < actions.length; j ++) {
                if (record.get('max_value_'+actions[j])) {
                    record.set('value_'+actions[j], values['value_'+actions[j]]);
                }
                if (record.isModified('value_'+actions[j])) {
                    modified = true;
                }
            }
            if (modified) {
                records.push(record);
            }
        }
        if (!records.length) {
            this.changeRulesWindow.close();
            return;
        }
        this.saveRuleData(this.getManagersRulesTreeStore(), records, function() {
            this.changeRulesWindow.close();
        }, this);
    },
    
    onRulesForRoleSelectionChange: function() {
        var count = arguments[1].length;
        if (count > 0) {
            this.getChangeRules().enable();
        } else {
            this.getChangeRules().disable();
        }
    },
    
    /**
     * Create new window to add new manager
     * @param   {object} item
     */     
    LaunchManagersForm: function(item) {
        var params = {
            title: OSS.Localize.get('Add manager'),
            data: {
                payments: 0,
                person_id: -1
            }
        };
        Ext.widget('managersform', params).show();
    },

    BackToManagersList: function(item) {
        this.getManagersTab().getLayout().setActiveItem(0);
    },

    BackToRolesList: function(item) { 
        this.getRolesTab().getLayout().setActiveItem(0);
    },



    /**
     * Before show window event. Disabling or enabling some form elements
     * @param {object} window
    */
    onLaunchManagersForm: function(win) {
        var form = this.getManagersWindowForm().getForm(),
            paySystemCheckBox = form.findField('payments'),
            allowPaymentsCheckBox = form.findField('useadvance'),
            passwordField = form.findField('pass');

        form.setValues(win.data);
        form.findField('pay_class_id').getStore().load();
        
        if (win.data.payments == 0) {
            allowPaymentsCheckBox.disable();
        }
        if (win.data.person_id == 0) {
            paySystemCheckBox.disable();
            allowPaymentsCheckBox.disable();
        }
        paySystemCheckBox.on('change', function(field, value){
            allowPaymentsCheckBox.setDisabled(!value);
            if (!value) {
                allowPaymentsCheckBox.setValue(false);
            }
        }, this);

        passwordField.on('change', function(field, newValue, oldValue){
            if (newValue != oldValue) {
                form.findField('pass_changed').setValue(true);
            }
        }, this);
        
        // set password empty on form load
        if(form.findField('person_id').getValue()>=0) {
            passwordField.setValue(null);
            form.findField('pass_changed').setValue(false);
        }
    },

    /**
     * Before show window event. Disabling or enabling some form elements
     * @param {object} window
    */
    onLaunchRolesForm: function(win) {
        var form = this.getRolesWindowForm().getForm();
        form.setValues(win.data);
    },

    /**
     * Save manager
     * @param   {object} button
     */ 
    SaveManager: function (Btn) {
        var form = Btn.up('window').down('form'),
        data = form.getForm().getValues();

        if(data.person_id < 0 && data.pass == '') {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('Password cannot be empty'));
            return;
        }
        if(data.login == '') {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('Login cannot be empty'));
            return;
        }
        
        form.submit({
            clientValidation: true,            
            url: 'index.php/api/managers/save',
            success: function(form, action) {
               Btn.up('window').close();
               this.getManagersManagersStore().reload();
               this.getController('Payments').reloadClasses();
               OSS.component.Profile.updateManager(data.person_id);
            },
            scope: this
        });
    },


    /**
     * Save group
     * @param   {object} button
     */ 
    SaveRole: function (Btn) {
        var form = Btn.up('window').down('form');
        form.submit({
            clientValidation: true,            
            url: 'index.php/api/managersroles/save',
            success: function(form, action) {
               Btn.up('window').close();
               this.getManagersRolesStore().reload();
            },
            scope: this
        });
    },

    
    /**
     * Create new window to add group or manager
     * @param   {object} grid
     * @param   {object} el
     * @param   {int} rowIndex
     * and etc
     */
    onManagerActionColumn: function(gridview, el, rowIndex, colIndex, e, scope, rowEl) {
        var record = scope.store.getAt(rowIndex);

        if (e.getTarget('.x-ibtn-edit')) {
            var params = {
                title: OSS.Localize.get('Edit manager'),
                data: record.data
            };
            Ext.widget('managersform', params).show();
            
        } else if (e.getTarget('.x-ibtn-address')) {

            if (record.get('person_id') == 0) {
                return;
            }
            
            this.getManagersTab().getLayout().setActiveItem(1);

            var mainPanel = this.getRolesForManager();
            var assignedStore = mainPanel.items.get(0).getStore(),
                availableStore = mainPanel.items.get(2).getStore(); // 2 , потому что layout=border и id=1 занимает bordersplitter

            var managerName = record.get('fio') ? record.get('fio') : record.get('login')
            
            mainPanel.person_id = record.get('person_id');
            assignedStore.proxy.extraParams.person_id = record.get('person_id');
            assignedStore.proxy.extraParams.unused = 0;
            availableStore.proxy.extraParams.person_id = record.get('person_id');
            availableStore.proxy.extraParams.unused = 1;
            assignedStore.load();
            availableStore.load();

        } else if (e.getTarget('.x-ibtn-delete')) {

            if (record.get('person_id') == 0) {
                return;
            }

            Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
                if (button === 'yes') { 
                    this.record.destroy();
                }
            }, {
                store: scope.store,
                record: record
            });
            
        }
    },


    onRoleActionColumn: function(gridview, el, rowIndex, colIndex, e, scope, rowEl) {
        var record = scope.store.getAt(rowIndex);

        if (e.getTarget('.x-ibtn-edit')) {
            var params = {
                title: OSS.Localize.get('Edit role'),
                data: record.data
            };
            Ext.widget('rolesform', params).show();
            
            
            
        } else if (e.getTarget('.x-ibtn-delete')) {
            
            Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
                if (button === 'yes') { 
                    this.record.destroy();
                }
            }, {
                store: scope.store,
                record: record
            });
            
        } else if (e.getTarget('.x-ibtn-list')) {
            this.getRulesForRole().setTitle(
                i18n.get("Edit rules for role") +
                ' "' +
                record.get('name') +
                '"'
            );
            this.getRolesTab().getLayout().setActiveItem(1);
            this.getManagersRulesTreeStore().proxy.extraParams.role_id = record.get('record_id');
            this.getManagersRulesTreeStore().role_id = record.get('record_id');
            this.mask(true);
            this.getManagersRulesTreeStore().load({
                callback: function() {
                    this.getRulesForRole().expandAll();
                    this.mask(false);
                },
                scope: this
            });
        }
    },

    /**
     * Update rule for selected role on grid update
     * @param   {object} store
     * @param   {object} record
     */ 
    updateRule: function(store, record){
        var modified = false,
            i,
            fields = [
                'value_create',
                'value_delete',
                'value_read',
                'value_update'
            ];
        
        for (i = 0; i < fields.length; i ++) {
            if (record.isModified(fields[i])) {
                modified = true;
                break;
            }
        }
        if (!modified) {
            return;
        }
        this.saveRuleData(store, [record]);
    },
    
    mask: function(state) {
        if (state) {
            this.__mask = new Ext.LoadMask({
                target: this.getRulesForRole()
            });
            this.__mask.show();
        } else {
            if (!this.__mask) {
                return;
            }
            this.__mask.hide();
        }
    },

    saveRuleData: function(store, records, callback, scope) {
        var params = [],
            i,
            record;
        if (!callback) {
            callback = function() {};
        }
        if (!scope) {
            scope = window;
        }
        this.mask(true);
        for (i = 0; i < records.length; i ++) {
            record = records[i];
            params.push({
                'role_id': store.role_id,
                'rule_id': record.get('record_id'),
                'create': record.get('value_create') ? 1 : 0,
                'delete': record.get('value_delete') ? 1 : 0,
                'read': record.get('value_read') ? 1 : 0,
                'update': record.get('value_update') ? 1 : 0
            });
        }
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/managersrolerules/save"),
            params: {
                data: Ext.JSON.encode(params)
            },
            success: function() {
                for (i = 0; i < records.length; i ++) {
                    records[i].commit();
                }
            },
            failure: function(response) {
                var i, j;
                if (!response.JSONResults.data) {
                    return;
                }
                for (i = 0; i < records.length; i ++) {
                    for (j = 0; j < response.JSONResults.data.length; j ++) {
                        if (records[i].get('record_id') == response.JSONResults.data[j]) {
                            records[i].reject();
                        }
                    }
                    records[i].commit();
                }
            },
            callback: function() {
                this.mask(false);
                Ext.bind(callback, scope)();
            },
            scope: this
        });
    },
    
    /**
     * Refresh main grid by click toolbar button
     * @param   {object} Btn
     */ 
    RefreshMainGrid: function (Btn){
        var search = Btn.up('toolbar').down('textfield').getValue();
        Btn.up('panel').getStore().reload({
            params: {
                search: search
            }
        });
    },

    /**
     * Create new window to add new role
     * @param   {object} item
     */     
    LaunchRolesForm: function(item) {
        var params = {
            title: OSS.Localize.get('Add role'),
            data: {
                role_id: 0
            }
        };
        Ext.widget('rolesform', params).show();
    },
    
    filterEditorStore: function() {
        var record = arguments[1].record,
            max_value = 'max_value_'+arguments[1].column.getItemId();
        if (!record.get(max_value) || !record.get('enabled')) {
            this.getManagersRulesEditorStore().filter({
                filterFn: function(item) {
                    return !item.get('value');
                }
            });
        } else {
            this.getManagersRulesEditorStore().clearFilter();
        }
    },

    onColumnEdit: function() {
        this.updateRule(this.getManagersRulesTreeStore(), arguments[1].record);
    },

    /*******************
    * Tariffs tab actions
    ********************/
    
    editRoleTariffs: function() {
        var record = arguments[5];

        this.getRoleTariffsTab().getLayout().setActiveItem(1);
        this.getRoleTariffs().items.get(0).getStore().getProxy().setExtraParam('role_id', record.get('record_id'));
        this.getRoleTariffs().items.get(0).getStore().reload();
        
        this.getRoleTariffs().items.get(1).getStore().getProxy().setExtraParam('role_id', record.get('record_id'));
        this.getRoleTariffs().items.get(1).getStore().getProxy().setExtraParam('un_used', 1);
        this.getRoleTariffs().items.get(1).getStore().reload();
    },
    
    addSelectedTariffsRecords: function() {
        this.moveSelectedTariffsRecords(true);
    },
    
    removeSelectedTariffsRecords: function() {
        this.moveSelectedTariffsRecords(false);
    },
    
    
    moveSelectedTariffsRecords: function(isAdding) {
        var records = isAdding ? this.getFreeRoleTariffs().getSelectionModel().getSelection() : this.getAssignedRoleTariffs().getSelectionModel().getSelection();
        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('You should select some records at first'));
            return;
        }
        
        var tariffs = [];
        Ext.each(records, function(record) {
            Ext.Array.push(tariffs, record.data.tar_id);
        });
        
        var params = {
            role_id:  this.getFreeRoleTariffs().getStore().getProxy().extraParams.role_id,
            tar_id: tariffs.join()
        }
        
        var url = isAdding ? Ext.Ajax.getRestUrl("api/roles/AddTariffs") : Ext.Ajax.getRestUrl("api/roles/RemoveTariffs");
        
        Ext.Ajax.request({
            url:  url,
            params: params,
            callback: function() {
                this.getAssignedRoleTariffs().getStore().reload();
                this.getFreeRoleTariffs().getStore().reload();
            },
            scope: this
        });
    },
    
    
    selectTariffRights: function(editor, data) {
        var params = {
            rights: data.newValues.rights,
            role_id:  this.getAssignedRoleTariffs().getStore().getProxy().extraParams.role_id,
            tar_id: data.newValues.tar_id
        }

        Ext.Ajax.request({
            url: Ext.Ajax.getRestUrl("api/roles/ChangeTariffRights"),
            params: params,
            callback: function() {
                this.getAssignedRoleTariffs().getStore().reload();
            },
            scope: this
        });
    },
    
    /*****************
    * End tariffs actions
    ******************/
    
    
    
    addRoleToManager: function(){

        var records = this.getAvailableRoles().getSelectionModel().getSelection();

        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('You should select some records at first'));
            return;
        }
        var ids = [];
        Ext.each(records, function(record) {
            Ext.Array.push(ids, record.data.role_id);
        });
        
        var params = {
            'role_id': ids.join(),
            'person_id': this.getAvailableRoles().getStore().getProxy().extraParams.person_id
        };

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/managerroles/addRoleToManager"),
            params: params,
            callback: function() {
                var mainPanel = this.getRolesForManager();
                mainPanel.items.get(0).getStore().reload();
                mainPanel.items.get(2).getStore().reload();
            },
            scope: this
        });
    },
    

    deleteRoleFromManager: function(){
        var records = this.getAssignedRoles().getSelectionModel().getSelection();

        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('You should select some records at first'));
            return;
        }
        
        var ids = [];
        Ext.each(records, function(record) {
            Ext.Array.push(ids, record.data.role_id);
        });
        
        var params = {
            'role_id': ids.join(),
            'person_id': this.getAssignedRoles().getStore().getProxy().extraParams.person_id
        };

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/managerroles/deleteRoleFromManager"),
            params: params,
            callback: function() {
                var mainPanel = this.getRolesForManager();
                mainPanel.items.get(0).getStore().reload();
                mainPanel.items.get(2).getStore().reload();
            },
            scope: this
        });
    },
    
    
    
    
    
    /*****************
    * User groups tab actions
    ******************/
    
    
    
    editRoleGroups: function() {
        var record = arguments[5];

        this.getRoleGroupsTab().getLayout().setActiveItem(1);
        this.getRoleGroups().items.get(0).getStore().getProxy().setExtraParam('role_id', record.get('record_id'));
        this.getRoleGroups().items.get(0).getStore().reload();
        
        this.getRoleGroups().items.get(1).getStore().getProxy().setExtraParam('role_id', record.get('record_id'));
        this.getRoleGroups().items.get(1).getStore().getProxy().setExtraParam('un_used', 1);
        this.getRoleGroups().items.get(1).getStore().reload();
    },
    
    addSelectedGroupsRecords: function() {
        this.moveSelectedGroupsRecords(true);
    },
    
    removeSelectedGroupsRecords: function() {
        this.moveSelectedGroupsRecords(false);
    },
    
    
    moveSelectedGroupsRecords: function(isAdding) {
        var records = isAdding ? this.getFreeRoleGroups().getSelectionModel().getSelection() : this.getAssignedRoleGroups().getSelectionModel().getSelection();
        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('You should select some records at first'));
            return;
        }
        
        var groups = [];
        Ext.each(records, function(record) {
            Ext.Array.push(groups, record.data.user_group_id);
        });
        
        var params = {
            role_id:  this.getFreeRoleGroups().getStore().getProxy().extraParams.role_id,
            user_group_id: groups.join()
        }
        
        var url = isAdding ? Ext.Ajax.getRestUrl("api/roles/AddGroups") : Ext.Ajax.getRestUrl("api/roles/RemoveGroups");
        
        Ext.Ajax.request({
            url:  url,
            params: params,
            callback: function() {
                this.getAssignedRoleGroups().getStore().reload();
                this.getFreeRoleGroups().getStore().reload();
            },
            scope: this
        });
    },
   
    
    selectGroupRights: function(editor, data) {
        var params = {
            rights: data.newValues.rights,
            role_id:  this.getAssignedRoleGroups().getStore().getProxy().extraParams.role_id,
            user_group_id: data.newValues.user_group_id
        }

        Ext.Ajax.request({
            url: Ext.Ajax.getRestUrl("api/roles/ChangeGroupsRights"),
            params: params,
            callback: function() {
                this.getAssignedRoleGroups().getStore().reload();
            },
            scope: this
        });
    },
    
    /*****************
    * End UserGroups actions
    ******************/
    
    
    
    
    
    /*****************
    * Universal Tariffs and UserGroups actions
    ******************/
    
    
    enableMenuActions: function(Btn) {
        var menu = Btn.menu.items;
        Ext.each(menu.items, function(item){
            item.disable();
        });
        
        var assigned = Btn.up('toolbar').up('panel').items.get(0).getSelectionModel().getSelection(),
            available = Btn.up('toolbar').up('panel').items.get(2).getSelectionModel().getSelection();
        
        if(assigned.length > 0) {
            menu.get(1).enable();
        } 
        
        if(available.length > 0) {
            menu.get(0).enable();
        }        
    },
    
    
    backToFirstItem: function(Btn) {
        Btn.up('tabpanel').getActiveTab().getLayout().setActiveItem(0);
    },
    
    
    activateGroupOrTariffsTab: function(currentTab, previous) {
        currentTab.items.first().getStore().reload();
        this.getRoleTariffsTab().getLayout().setActiveItem(0);
    },
    
    
    showActionsMenu: function(Btn) {
        this.enableMenuActions(Btn);    
        Btn.showMenu();
    },
    
    
    setReadWriteSelected: function(Btn) {

        var records = Btn.up('toolbar').up('panel').items.get(0).getSelectionModel().getSelection();

        if(records.length == 0) {
            Ext.Msg.alert(i18n.get('Info'), i18n.get('You should select some records at first'));
            return;
        }
        
        var data = [];
        Ext.each(records, function(record) {
            var id = Ext.isEmpty(record.data.tar_id) ? record.data.user_group_id : record.data.tar_id;
            Ext.Array.push(data, id);
        });

        var rights = (Btn.itemId == 'setRoBtn') ? 0 : 1;
            
        var params = {
            role_id:  Btn.up('toolbar').up('panel').items.get(0).getStore().getProxy().extraParams.role_id,
            ids: data.join(),
            for_tariffs: Ext.isEmpty(records[0].data.tar_id) ? 0 : 1,
            rights: rights
        }
                
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/roles/MassChangeRights"),
            params: params,
            callback: function() {
                Btn.up('toolbar').up('panel').items.get(0).getStore().reload();
            },
            scope: this
        });
    }
    
    /********************
    * END Tariffs and UserGroups actions
    *********************/
    
});
