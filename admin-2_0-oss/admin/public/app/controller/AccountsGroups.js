Ext.define("OSS.controller.AccountsGroups", {
    extend: 'Ext.app.Controller',
    views: [
        'AccountsGroups',
        'accountsgroups.List',
        'accountsgroups.Accounts',
        'accountsgroups.Tariffs',
        'accountsgroups.ScheduleForm'
    ],
    view: 'AccountsGroups',
    stores: [
        'accountsgroups.AccountsGroups',
        'accountsgroups.FreeAccounts',
        'accountsgroups.GroupAccounts',
        'accountsgroups.AccountsSearchTypes',
        'Agents',
        'accountsgroups.AccountsBlocksTypes',
        'accountsgroups.Tariffs',
        'accountsgroups.FreeTariffs',
        'accountsgroups.GroupTariffs',
        'accountsgroups.Schedules',
        'accountsgroups.Agents',
        'accountsgroups.SchedulingTariffs'
    ],
    requires: [
        'Ext.grid.plugin.CellEditing'
    ],
    refs: [{
        selector: 'accountsgroups',
        ref: 'mainpanel'
    }, {
        selector: 'groupaccounts',
        ref: 'accountspanel'
    }, {
        selector: 'grouptariffs',
        ref: 'tariffspanel'
    }],
    init: function() {
        this.control({
            'accountsgroups': {
                afterrender:   this.initAccountsGroups
            },
            'accountsgroups > gridpanel > toolbar > #actions > menu > #addGroupBtn': {
                click: this.addGroup
            },
            'groupaccounts > toolbar > #back': {
                click: this.returnToGroupsList
            },
            'grouptariffs > toolbar > #back': {
                click: this.returnToGroupsList
            },
            'grouptariffs > gridpanel #delete': {
                click: this.removeTariffFromGroup
            },
            'grouptariffs > #freeTariffs': {
                afterrender: this.initFreeTariffsGrid
            },
            'grouptariffs > #groupTariffs': {
                afterrender: this.initGroupTariffsGrid
            },
            'grouptariffs > #groupTariffs > toolbar > #actions > menu> #deletePageTariffsBtn': {
                click: this.deleteTariffsOnPage
            },
            'grouptariffs > #freeTariffs > toolbar > #actions > menu> #addPageTariffsBtn': {
                click: this.addTariffsOnPage
            },
            'grouptariffs > #freeTariffs > toolbar > #fullsearch_txt': {
                afterrender: this.refreshGridBind
            },
            'grouptariffs > #groupTariffs > toolbar > #fullsearch_txt': {
                afterrender: this.refreshGridBind
            },
            'grouptariffs > #freeTariffs > toolbar > button#searchbtn': {
                click: this.refreshGrid
            },
            'grouptariffs > #groupTariffs > toolbar > button#searchbtn': {
                click: this.refreshGrid
            },
            'accountsgroups > gridpanel #delete': {
                click: this.deleteGroup
            },
            'accountsgroups > gridpanel #accounts': {
                click: this.showChangeAccountsInGroupLayout
            },
            'accountsgroups > gridpanel #tariffs': {
                click: this.showChangeAvailableTariffsLayout
            },
            'accountsgroups > gridpanel #scheduling': {
                click: this.showScheduleTariffsForm
            },
            'groupaccounts > gridpanel #delete': {
                click: this.removeAccountFromGroup
            },
            'groupaccounts > #freeAccounts': {
                afterrender: this.initFreeAccountsGrid
            },
            'groupaccounts > #groupAccounts': {
                afterrender: this.initGroupAccountsGrid
            },
            'groupaccounts > #groupAccounts > toolbar > #actions > menu> #deleteAllAccountsBtn': {
                click: this.deleteAllAccounts
            },
            'groupaccounts > #groupAccounts > toolbar > #actions > menu> #deletePageAccountsBtn': {
                click: this.deleteAccountsOnPage
            },
            'groupaccounts > #freeAccounts > toolbar > #actions > menu> #addPageAccountsBtn': {
                click: this.addAccountsOnPage
            },
            'groupaccounts > #freeAccounts > toolbar > #fullsearch_txt': {
                afterrender: this.refreshGridBind
            },
            'groupaccounts > #groupAccounts > toolbar > #fullsearch_txt': {
                afterrender: this.refreshGridBind
            },
            'groupaccounts > #freeAccounts > toolbar > button#searchbtn': {
                click: this.refreshGrid
            },
            'groupaccounts > #groupAccounts > toolbar > button#searchbtn': {
                click: this.refreshGrid
            },
            'groupaccounts > #freeAccounts > toolbar > #search_field_cmb': {
                select: this.updateToolbarComponents
            },
            'groupaccounts > #groupAccounts > toolbar > #search_field_cmb': {
                select: this.updateToolbarComponents
            },
            'scheduleform': {
                beforeshow: this.onShowScheduleForm
            },
            'scheduleform > toolbar > #agents': {
                select: this.updateToolbarButtonState
            },
            'scheduleform > toolbar > #addRaspButton': {
                click: this.addRecordOnSchedule
            },
            'scheduleform > gridpanel #delete': {
                click: this.removeRecordFromSchedule
            },
            'scheduleform > gridpanel': {
                beforeedit: this.syncTariffsStoreWithSelectedRecord
            }
        });
    },

    programActivated: function() {
        var tariffsPanel,
            groupTariffsStore,
            freeTariffsStore;
        if (this.getMainpanel().getLayout().getActiveItem().isXType('grouptariffs')) {
            tariffsPanel = this.getTariffspanel();
            groupTariffsStore = tariffsPanel.items.get(0).getStore();
            freeTariffsStore = tariffsPanel.items.get(1).getStore();
            groupTariffsStore.load();
            freeTariffsStore.load();
        }
    },

    /*
     * Hide or show text search
    */
    updateToolbarComponents: function(field, records){
        var key = records[0].get('key'),
            txtField = field.up('toolbar').getComponent("fullsearch_txt"),
            agentsCmbField = field.up('toolbar').getComponent("fullsearch_cmb_agent"),
            blocktypesCmbField = field.up('toolbar').getComponent("fullsearch_cmb_block"),
            tariffsCmbField = field.up('toolbar').getComponent("fullsearch_cmb_tar");

        if (key == 'tar_id' || key == 'blocked' || key == 'agent_id') {
            txtField.hide();
            agentsCmbField[ key == 'agent_id' ? 'show' : 'hide' ]();
            blocktypesCmbField[ key == 'blocked' ? 'show' : 'hide' ]();
            tariffsCmbField[ key == 'tar_id' ? 'show' : 'hide' ]();
        } else {
            txtField.show();
            agentsCmbField.hide();
            blocktypesCmbField.hide();
            tariffsCmbField.hide();
        }
    },

    /*
     * Back to groups list on click button
    */
    returnToGroupsList: function(Btn){
        this.getMainpanel().getLayout().setActiveItem(0);
        this.getAccountsgroupsAccountsGroupsStore().reload();
    },

    /*
     * Refresh grid on press "Enter"
    */
    refreshGridBind: function(field){
        field.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                this.refreshGrid(f);
            }
        }, this);
    },

    /*
     * Refresh grid on click button
    */
    refreshGrid: function(el){
        el.up('gridpanel').getDockedItems('toolbar')[0].refreshGrid();
    },

    /**
     * Refresh main grid of accoutns groups
     * @param   {object} grid
     */ 
    initAccountsGroups: function(grid, store){
        var store = grid.items.get(0).getStore();
        store.load();

        store.on('update', function(store, record, event, rowIndex){
            this.updateGroup(store, record);
        }, this);
    },

    /**
     * Add record with new group to main grid
     */ 
    addGroup: function(){
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/updateRecord"),
            params: {
                group_id: 0,
                descr: OSS.Localize.get('New union'),
                name: OSS.Localize.get('New union')
            },
            callback: function() {
                this.getAccountsgroupsAccountsGroupsStore().reload();
            },
            scope: this
        });
    },


    /**
     * Update group on grid editing
     * @param   {object} store
     * @param   {object} record
     */ 
    updateGroup: function(store, record){
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/updateRecord"),
            params: {
                group_id: record.get('group_id'),
                descr: record.get('descr'),
                name: record.get('name')
            },
            callback: function() {
                this.getAccountsgroupsAccountsGroupsStore().reload();
            },
            scope: this
        });
    },


    /**
     * Delete selected record
     */ 
    deleteGroup: function(grid, el, rowIndex, colIndex, event, record){
        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                record.destroy();
            }
        }, this);
    },

    /**
     * Change accounts in this group
     */ 
    showChangeAccountsInGroupLayout: function(grid, el, rowIndex, colIndex, event, record){

        this.getMainpanel().getLayout().setActiveItem(1);

        var accountsPanel = this.getAccountspanel(),
            groupAccountsStore = accountsPanel.items.get(0).getStore(),
            freeAccountsStore = accountsPanel.items.get(1).getStore();
        
        //accountsPanel.setTitle(OSS.Localize.get("Union") + ' "' + record.get('name') +  '": '+  OSS.Localize.get("Edit accounts list"));
        accountsPanel.group_id = record.get('group_id');
        groupAccountsStore.proxy.extraParams.in_group = record.get('group_id');
        freeAccountsStore.proxy.extraParams.not_in_group = record.get('group_id');
        groupAccountsStore.load();
        freeAccountsStore.load();
    },


    /**
     * Change tariffs available for this group
     */ 
    showChangeAvailableTariffsLayout: function(grid, el, rowIndex, colIndex, event, record){
        this.getMainpanel().getLayout().setActiveItem(2);

        var tariffsPanel = this.getTariffspanel(),
            groupTariffsStore = tariffsPanel.items.get(0).getStore(),
            freeTariffsStore = tariffsPanel.items.get(1).getStore();

        tariffsPanel.group_id = record.get('group_id');
        groupTariffsStore.proxy.extraParams.in_group = record.get('group_id');
        freeTariffsStore.proxy.extraParams.not_in_group = record.get('group_id');
        groupTariffsStore.load();
        freeTariffsStore.load();
    },

    showScheduleTariffsForm: function(grid, el, rowIndex, colIndex, event, record){
        Ext.widget('scheduleform', {
            group_id: record.get('group_id'),
            agent_ids: record.get('agent_ids')
        }).show(); 
    },

    /**
     * Remove account from this group
     */ 
    removeAccountFromGroup: function(grid, el, rowIndex, colIndex, event, record){

        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                this.removeAccountItem(grid.up('gridpanel').up('panel').group_id, record.get('vg_id'));
            }
        }, this);
    },


    removeAccountItem: function(group_id, vg_ids){
        var params = {
            group_id: group_id   
        };

        if (!Ext.isEmpty(vg_ids)) {
            params.vg_ids = vg_ids;
        } else {
            params.remove_all = 1;
        }

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/removeAccount"),
            params: params,
            callback: function() {
                this.getAccountsgroupsFreeAccountsStore().reload();
                this.getAccountsgroupsGroupAccountsStore().reload(); 
            },
            scope: this
        });
    },


    addAccountItem: function(group_id, vg_ids){
        var params = {
            group_id: group_id,
            vg_ids: vg_ids
        };

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/addAccount"),
            params: params,
            callback: function() {
                this.getAccountsgroupsFreeAccountsStore().reload();
                this.getAccountsgroupsGroupAccountsStore().reload(); 
            },
            scope: this
        });
    },

    /**
     * Init grid with the accounts in this group
     */ 
    initGroupAccountsGrid: function(grid){
        grid.getStore().on('add', function(store, records){
            this.addAccountItem(grid.up('panel').group_id, records[0].get('vg_id'));
        }, this);
    },

    /**
     * Init grid with the accounts not in this group
     */ 
    initFreeAccountsGrid: function(grid){
        grid.getStore().on('add', function(store, records){
            this.removeAccountItem(grid.up('panel').group_id, records[0].get('vg_id'));
        }, this);
    },

    /**
     * Delete all accounts from this group
     */ 
    deleteAllAccounts: function(Btn){
        this.removeAccountItem(Btn.up('gridpanel').up('panel').group_id);
    },

    /**
     * Delete accounts on this page
     */
    deleteAccountsOnPage: function(Btn){
        var data = Btn.up('gridpanel').getStore().getRange(),
            ids = [];

        for (var i = 0; i < data.length; ++i) {
            ids.push(data[i].get('vg_id'));
        }

        this.removeAccountItem(Btn.up('gridpanel').up('panel').group_id, ids.join(','));
    },

    /**
     * Add accounts on this page
     */
    addAccountsOnPage: function(Btn){
        var data = Btn.up('gridpanel').getStore().getRange(),
            ids = [];

        for (var i = 0; i < data.length; ++i) {
            ids.push(data[i].get('vg_id'));
        }

        this.addAccountItem(Btn.up('gridpanel').up('panel'), ids.join(','));
    },

    /*
     * Reload stores on show form
     */
    onShowScheduleForm: function (form) {
        var mainStore = form.items.get(0).getStore(),
            agentsStore = form.getDockedItems()[0].items.get(1).getStore(),
            tariffsStore = this.getAccountsgroupsSchedulingTariffsStore();

        tariffsStore.proxy.extraParams.group_id = form.group_id;
        agentsStore.proxy.extraParams.agent_ids = form.agent_ids;
        mainStore.proxy.extraParams.group_id = form.group_id;
        mainStore.reload();

        tariffsStore.on('load', this.filterTariffsStore, this);

        mainStore.on('update', function(store, record, event, columns){

            var saveRecord = function(A){
                Ext.Ajax.request({
                    url:  Ext.Ajax.getRestUrl("api/accountsgroupsschedule/updateRecord"),
                    params: {
                        record_id: record.get('record_id'),
                        agent_id: record.get('agent_id'),
                        group_id: store.proxy.extraParams.group_id,
                        tar_id_new: record.get('tar_id_new'),
                        change_date: Ext.Date.format(record.get('change_date'), 'Y-m-d'),
                        change_time: Ext.Date.format(record.get('change_time'), 'H:i:s'),
                        override: Ext.isEmpty(A.override) ? 0 : A.override
                    },
                    silent: true,
                    failure: function( response ) {
                        var data = Ext.JSON.decode(response.responseText);
                        if (data.details == "Packet will be broken") {
                            Ext.Msg.confirm(OSS.Localize.get('Confirmation'), OSS.Localize.get('Packet will be broken. Are you sure to continue?'), function(button) {
                                if (button === 'yes') { 
                                    saveRecord({override: 1});
                                }
                            }, this);
                        } else {
                            Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get( data.details ));
                        }
                    },
                    success: function() { 
                         store.reload();
                    },
                    scope: this
                });
            }

            if (!Ext.isEmpty(columns) && columns[0] == 'tar_id_new') {
                var tarStore = this.getAccountsgroupsSchedulingTariffsStore();

                if (tarStore.find('tar_id', record.get('tar_id_new')) > -1) {
                    var A = tarStore.getAt(tarStore.find('tar_id', record.get('tar_id_new')));
                    var for_save = Ext.isEmpty(record.data.tar_new_name) ? true : false;
                    record.set("tar_new_name", A.get('tar_name') + ' (' + A.get('symbol') + ')');
                    if (for_save) {
                        saveRecord({});
                    }
                }
            } else if (record.get('tar_id_new') != 0 && record.get('record_id') > 0) {
                saveRecord({});
            }

        }, this);
    },


    /*
     * Enable toolbar button if value is selected
     */
    updateToolbarButtonState: function(combo){
        combo.up('toolbar').down('button').setDisabled(false);
    },

    /*
     * Add record in shedules store
     */
    addRecordOnSchedule: function(Btn){
        var now = new Date(),
            date = Ext.Date.format(new Date(now.getFullYear(), now.getMonth()+1, '01'), 'Y-m-d'),
            mainStore = Btn.up('window').down('gridpanel').getStore(),
            agent_id = Btn.up('toolbar').down('combobox').getValue();

        mainStore.add({ 
            record_id: 0, 
            change_date: date,
            change_time: '00:00:00',
            agent_id: agent_id
        });
    },


    removeRecordFromSchedule: function(grid, b, c, d, e, record){
        if (record.get('record_id') == 0) {
            grid.getStore().remove(record);
        } else {
            record.destroy();
        }
        
    },


    removeTariffFromGroup: function(grid, el, rowIndex, colIndex, event, record){

        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                this.removeTariffItem(grid.up('gridpanel').up('panel').group_id, record.get('tar_id'));
            }
        }, this);
    },


    removeTariffItem: function(group_id, tar_ids){
        var params = {
            group_id: group_id,
            tar_ids: tar_ids
        };

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/removeTariff"),
            params: params,
            callback: function() {
                this.getAccountsgroupsFreeTariffsStore().reload();
                this.getAccountsgroupsGroupTariffsStore().reload(); 
            },
            scope: this
        });
    },

    initFreeTariffsGrid: function(grid){
        grid.getStore().on('add', function(store, records){
            this.removeTariffItem(grid.up('panel').group_id, records[0].get('tar_id'));
        }, this);
    },

    initGroupTariffsGrid: function(grid){
        grid.getStore().on('add', function(store, records){
            this.addTariffItem(grid.up('panel').group_id, records[0].get('tar_id'));
        }, this);
    },

    addTariffItem: function(group_id, tar_ids){
        var params = {
            group_id: group_id,
            tar_ids: tar_ids
        };

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/accountsgroups/addTariff"),
            params: params,
            callback: function() {
                this.getAccountsgroupsFreeTariffsStore().reload();
                this.getAccountsgroupsGroupTariffsStore().reload(); 
            },
            scope: this
        });
    },


    deleteTariffsOnPage: function(Btn){
        var data = Btn.up('gridpanel').getStore().getRange(),
            ids = [];

        for (var i = 0; i < data.length; ++i) {
            ids.push(data[i].get('tar_id'));
        }

        this.removeTariffItem(Btn.up('gridpanel').up('panel').group_id, ids.join(','));
    },

    addTariffsOnPage: function(Btn){
        var data = Btn.up('gridpanel').getStore().getRange(),
            ids = [];

        for (var i = 0; i < data.length; ++i) {
            ids.push(data[i].get('tar_id'));
        }

        this.addTariffItem(Btn.up('gridpanel').up('panel').group_id, ids.join(','));
    },


    syncTariffsStoreWithSelectedRecord: function(plugin, data){
        if (data.field == "tar_id_new") {
            var store = this.getAccountsgroupsSchedulingTariffsStore();
            store.curr_record_agent_id = data.record.get('agent_id').toString();

            if (store.getCount() > 0) {
                this.filterTariffsStore(store);
            }
            
        }
    },


    filterTariffsStore: function(store) {
        store.clearFilter();
        store.filterBy(function(record){
            var agents = record.get('agents').split(",");
            if (-1 != agents.indexOf(store.curr_record_agent_id)) {
                return true;
            }
            return false;
        });
    }
    
});
