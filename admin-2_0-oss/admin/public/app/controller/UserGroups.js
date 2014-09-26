Ext.define('OSS.controller.UserGroups', {
    extend: 'Ext.app.Controller',
    requires: ['OSS.ux.form.field.SearchField'],
    views: [ 'UserGroups', 'usergroups.List', 'usergroups.Form', 'usergroups.AddGroupWindow' ],
    view: 'UserGroups',
    
    stores: [ 'UserGroupsList', 'usergroups.UsersAssigned', 'usergroups.UsersAvailable' ],
    
    refs: [{
        selector: 'usergrp',
        ref: 'userGroups'
    }, {
        selector: 'usergroups_list',
        ref: 'groupsListView'
    }, {
        selector: 'usergroups_addingform',
        ref: 'addingForm'
    }, {
        selector: 'usergroups_form',
        ref: 'groupForm'
    }, {
        selector: 'usergroups_list > gridpanel',
        ref: 'groupsListGrid'
    }, {
        selector: 'usergroups_form > panel',
        ref: 'mainPanel'
    }, {
        selector: 'usergroups_form > panel #assignedGrid ',
        ref: 'assignedGrid'
    }, {
        selector: 'usergroups_form > panel #availableGrid ',
        ref: 'availableGrid'
    }, {
        selector: 'usergroups_form #topForm ',
        ref: 'topForm'
    }, {
        selector: 'usergroups_form > toolbar combo[name=search_template]',
        ref: 'templateCombo'
    }, {
        selector: 'usergroups_form > panel #availableGrid > toolbar',
        ref: 'availableToolbar'
    },{
        selector: 'usergroups_form > panel #assignedGrid > toolbar',
        ref: 'assignedToolbar'
    }, {
        selector: 'usergrp > usergroups_form > #grids',
        ref: 'groupContent'
    }, {
        selector: 'usergroups_list > toolbar > #actions > menu > #remove',
        ref: 'removeBtn'
    }, {
        selector: 'usergrp > usergroups_form > #properties > #topForm > #promisedPayment',
        ref: 'promisedPayment'
    }, {
        selector: 'usergrp > usergroups_form > #grids > #availableGrid > toolbar > #actions > menu > #add',
        ref: 'addCurrentPageBtn'
    }, {
        selector: 'usergrp > usergroups_form > #grids > #assignedGrid > toolbar > #actions > menu > #deleteCurrent',
        ref: 'deleteCurrentPageBtn'
    }, {
        selector: 'usergrp > usergroups_form > #grids > #assignedGrid > toolbar > #actions > menu > #deleteAll',
        ref: 'deleteAllBtn'
    }],
    
    init: function() {
        this.control({
            'usergroups_list > gridpanel': {
                afterrender: this.loadUserGroupsList,
                selectionchange: this.setRemoveButtonState
            },
            'usergroups_list > gridpanel #editColumn': {
                click: this.editGroup
            },
            'usergroups_list > toolbar > #actions > menu > #add': {
                click: this.createGroup
            },
            'usergroups_list > toolbar > #actions > menu > #remove': {
                click: this.deleteGroup            
            },
            'usergroups_form > toolbar #back': {
                click: this.backToList
            },
            'usergroups_form > toolbar #saveUserGroupBtn': {
                click: this.saveGroupData
            },
            'usergroups_addingform > form #saveNewGroupBtn': {
                click: this.saveNewGroup
            },
            'usergroups_addingform > form #cancelFormBtn': {
                click: this.cancelSavingNewGroup
            },
            'usergroups_form > panel #assignedGrid > gridview': {
                 drop: this.addRecordsToAssigned,
                 beforedrop: this.beforeDrop
            },
            'usergroups_form > panel #availableGrid > gridview': {
                 drop: this.addRecordsToAvailable,
                 beforedrop: this.beforeDrop
            },
            'usergroups_form > toolbar combo[name=search_template]': {
                //render: this.loadSearchTemplates
            },
            'usergroups_form > toolbar #templates': {
                click: this.showTemplatesWindow
            },
            'usergroups_form > panel #availableGrid > toolbar > #searchbtn': {
                click: this.availableGridSearch
            },
            'usergroups_form > panel #assignedGrid > toolbar > #searchbtn': {
                click: this.assignedGridSearch
            },
            'usergrp > usergroups_form > #properties > #topForm > checkbox[name=promiseallow]': {
                change: 'onPromiseallowChanged'
            },
            'usergrp > usergroups_form > #grids > #availableGrid > toolbar > #actions > menu > #add': {
                click: 'addUsersOnPage'
            },
            'usergrp > usergroups_form > #grids > #assignedGrid > toolbar > #actions > menu > #deleteCurrent': {
                click: 'removeUsersOnPage'
            },
            'usergrp > usergroups_form > #grids > #assignedGrid > toolbar > #actions > menu > #deleteAll': {
                click: 'removeAll'
            }
        });
    },

    beforeDrop: function() {
        if (!this.currentGroupId) {
            return false;
        }
    },

    removeAll: function() {
        Ext.Ajax.request({
            url: 'index.php/api/usergroups/removeAll',
            params: {
                group_id: this.getTopForm().getForm().findField('groupid').getValue()
            },
            success: this.onChangeGroup,
            scope: this
        });     
    },

    onChangeGroup: function(res) {
        var response = Ext.JSON.decode(arguments[0].responseText);
        if (!response.success) {
            return;
        }
        this.getAssignedGrid().getStore().reload(); // reload Assigned's grid store on success
        this.getAvailableGrid().getStore().reload(); // reload Available's grid store on success
    },

    removeUsersOnPage: function(Btn) {
        this.requestSendGroupData(this.getGridRecords(Btn), 1);
    },

    addUsersOnPage: function(Btn) {
        this.requestSendGroupData(this.getGridRecords(Btn), 0);
    },

    getGridRecords: function(Btn) {
        var data = Btn.up('gridpanel').getStore().getRange(),
            ids = [];

        for (var i = 0; i < data.length; ++i) {
            ids.push(data[i].get('uid'));
        }
        return ids;
    },
    
    sendGroupData: function( data, doDelete ) {
        var items = [];
        
        Ext.Array.each(data.records, function(record) {
            items.push(record.get('uid'));
        });

        this.requestSendGroupData(items, doDelete);
    },

    requestSendGroupData: function(uids, doDelete) {
        Ext.Ajax.request({
            url: 'index.php/api/usergroups/setToGroup',
            params: {
                group_id: this.getTopForm().getForm().findField('groupid').getValue(),
                uids: Ext.JSON.encode(uids),
                del: doDelete
            },
            success: this.onChangeGroup,
            scope: this
        });     
    },

    onPromiseallowChanged: function() {
        var checked = arguments[1];
        this.getPromisedPayment()[checked ? 'enable' : 'disable']();
    },

    setRemoveButtonState: function() {
        var selection = arguments[1];
        this.getRemoveBtn().setDisabled(!selection.length);
    },

    availableGridSearch: function() {
        this.getAvailableToolbar().refreshGrid();
    },
    
    assignedGridSearch: function() {
        this.getAssignedToolbar().refreshGrid();
    },

    addRecordsToAssigned: function(node, data) {
        this.sendGroupData(data, 0);
    },
    
    addRecordsToAvailable: function(node, data) {
        this.sendGroupData(data, 1);
    },

    loadUserGroupsList: function(grid) {
        grid.getStore().reload();
    },
    
    showTemplatesWindow: function() {
        Ext.app.Application.instance.getController('SearchTemplates').openWindow({ 
            templatesCombo: this.getTemplateCombo(),
            searchFunction: Ext.bind( this.search, this )
        });
    },
    
    loadSearchTemplates: function( combo ) {
        combo.loadTemplates();
    },
    
    saveNewGroup: function (Btn) {
        Btn.up('form').submit({
            url: Ext.Ajax.getRestUrl('api/usergroups/addNewGroup', 0),
            method: 'PUT',
            clientValidation: true,
            scope: this,
            success: function(form, action) {
                var response = Ext.JSON.decode(action.response.responseText);
                if (!Ext.isEmpty(response.results)) {
                    var groupid = response.results.group_id;
                    Ext.Msg.confirm( i18n.get( "Confirmation" ), i18n.get('Continue editing') + '?', function(B) {
                        if (B == 'yes') {
                            var data = { 
                                name: Btn.up('form').getForm().findField('name').getValue(),
                                groupid: groupid,
                                description: Btn.up('form').getForm().findField('description').getValue()
                            };                       
                            this.showEditGroupForm(groupid, Btn.up('form').getForm().findField('name').getValue(), data);                   
                        } else {
                            this.getGroupsListGrid().getStore().reload();
                        }
                        Btn.up('window').close();
                    }, this);
                }
            }
        });
    },
    
    
    cancelSavingNewGroup: function(Btn) {
        Btn.up('form').getForm().reset();
        Btn.up('window').close();
    },
    
    saveGroupData: function(Btn) {
        this.getTopForm().getForm().submit({
            url: Ext.Ajax.getRestUrl('api/usergroups/saveGroupData'),
            method: 'POST',
            clientValidation: true,
            msg: true,
            scope: this,
            success: function(form, action) {               
                var response = Ext.JSON.decode(action.response.responseText);
                if (!Ext.isEmpty(response.success) && response.success) {
                    this.getTopForm().getForm().findField('groupid').setValue(response.results.group_id);
                    this.enableGroupContentTab(response.results.group_id);
                    this.getTopForm().resetOriginalValues();
                }
            }
        });
    },
    
    
    editGroup: function (view, cell, rowIndex, cellIndex, event, record) {
        this.showEditGroupForm(record.get('groupid'), record.get('name'), record.data);
    },
    
    createGroup: function() {
        this.showEditGroupForm(-1,'',{
            groupid: -1
        });
    },

    enableGroupContentTab: function(groupid) {
        var availableGridStore = this.getAvailableGrid().getStore(),
            assignedGridStore = this.getAssignedGrid().getStore();

        this.currentGroupId = groupid;
        if (!groupid) {
            this.getAddCurrentPageBtn().disable();
            this.getDeleteCurrentPageBtn().disable();
            this.getDeleteAllBtn().disable();
        } else {
            this.getAddCurrentPageBtn().enable();
            this.getDeleteCurrentPageBtn().enable();
            this.getDeleteAllBtn().enable();
        }
        this.getGroupContent().enable();
        availableGridStore.proxy.extraParams.groupid = groupid;
        assignedGridStore.proxy.extraParams.groupid = groupid;
        availableGridStore.load();
        assignedGridStore.load();
    },
    
    showEditGroupForm: function(groupid, name, data) {
        if (groupid == -1) {
            this.getGroupContent().disable();
        } else {
            this.enableGroupContentTab(groupid);
        }
        this.getTopForm().restoreOriginalValues();
        this.getTopForm().getForm().reset();
        this.getTopForm().getForm().setValues(data); //load data to form
        
        this.getUserGroups().getLayout().setActiveItem(1);
        //this.getGroupForm().setTitle( i18n.get('User group') + ': ' + name);
        this.getTopForm().resetOriginalValues();
    },
    
    
    deleteGroup: function () {
        var record = this.getGroupsListGrid().getSelectionModel().getSelection()[0];
        
        Ext.Msg.confirm( i18n.get( "Confirmation" ), i18n.get('Do you realy want to delete this entry?'), function(B) {
            if (B == 'yes') {
                
                Ext.Ajax.request({
                    url: 'index.php/api/usergroups/delete',
                    params: {
                        groupid: record.get('groupid')
                    },
                    success: function() {
                        var response = Ext.JSON.decode(arguments[0].responseText);
                        if (!response.success) {
                            return;
                        }
                        this.getGroupsListGrid().getStore().reload(); // reload grid store on success
                    },
                    scope: this
                });
                
            } else {
                return;
            }

        }, this);
        
    },
    
    backToList: function(Btn) {
        // clear grids
        this.getAvailableGrid().getStore().removeAll();
        this.getAssignedGrid().getStore().removeAll();
        // switch to groups list
        this.getUserGroups().getLayout().setActiveItem(0);
        this.getGroupsListGrid().getStore().reload();
    }
});
