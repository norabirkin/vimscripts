Ext.define( 'OSS.controller.AdditionalFieldsWidget', {
    extend: 'Ext.app.Controller',
    views: ['AdditionalFieldsWidget'],
    view: 'AdditionalFieldsWidget',
    stores: [
        'addons.AddonsStaffVgroups',
        'addons.AddonsStaffUsers',
        'addons.AddonsStaffAgreements',
        'addons.AddonsValuesVgroups',
        'addons.AddonsValuesUsers',
        'addons.AddonsValuesAgreements',
        'addons.ParamsGrid',
        'Agents'
    ],
    refs: [{
        selector: 'additionalfieldswidget',
        ref: 'mainWindow'
    },{
        selector: 'additionalfieldswidget > gridpanel',
        ref: 'valuesPanel'
    }, {
        selector: 'additionalfieldswidget > tabpanel',
        ref: 'tabPanel'
    }, { 
        selector: 'additionalfieldswidget > gridpanel',
        ref: 'valuesGrid'
    }, { 
        selector: 'additionalfieldswidget #editingPanel',
        ref: 'editingPanel'
    }, { 
        selector: 'additionalfieldswidget #editingForm',
        ref: 'editingForm'
    }, { 
        selector: 'additionalfieldswidget #editingGrid',
        ref: 'editingGrid'
    }],
    
    init: function() {
        this.control({
            'additionalfieldswidget': {
                show: this.showWidget,
                beforehide: this.hideWidget
            },
            'additionalfieldswidget > gridpanel #setupAddonsBtn': {
                click: this.switchToSetup
            },
            'additionalfieldswidget > tabpanel': {
                tabchange: this.reloadGridStores
            },
            'additionalfieldswidget > tabpanel #addAddonBtn': {
                click: this.addNewEntry
            },
            'additionalfieldswidget > tabpanel #agreementsTab #edit': {
                click: this.editAddonStaff
            },
            'additionalfieldswidget > tabpanel #vgroupsTab #edit': {
                click: this.editAddonStaff
            },
            'additionalfieldswidget > tabpanel #accountsTab #edit': {
                click: this.editAddonStaff
            },
            'additionalfieldswidget > tabpanel #agreementsTab #delete': {
                click: this.deleteAddonStaff
            },
            'additionalfieldswidget > tabpanel #vgroupsTab #delete': {
                click: this.deleteAddonStaff
            },
            'additionalfieldswidget > tabpanel #accountsTab #delete': {
                click: this.deleteAddonStaff
            },
            'additionalfieldswidget > tabpanel #backToAddonValuesBtn': {
                click: this.backToValues
            },
            'additionalfieldswidget > gridpanel': {
                itemdblclick: this.setRowEditor,
                edit: this.setAddonValue
            },
            'additionalfieldswidget #editingForm #fieldType': {
                change: this.changeFieldTypeValue
            },
            'additionalfieldswidget #editingForm #back': {
                click: this.backToCurrentTab
            },
            'additionalfieldswidget #editingPanel #addParam': {
                click: this.addRecordToParams
            },
            'additionalfieldswidget #editingPanel #deleteParam': {
                click: this.deleteParam
            },
            'additionalfieldswidget #editingPanel #saveData': {
                click: this.saveStaffData
            }
        }); 
    },

    setRowEditor: function(gridview, record, item, index) {
        
        var cell = gridview.getHeaderCt().gridDataColumns[2];
         
        var editors = {
            'combo': {
                xtype: 'combo',
                editable: false,
                mode: 'local',
                valueField: 'idx',
                displayField: 'value',
                triggerAction: 'all',
                store: { 
                    xtype: 'jsonstore',
                    url: 'index.php/api/AddonsValues', 
                    fields:['idx', 'value'], 
                    data: record.get('values')
                }
            },            
            'textfield': { 
                xtype: 'textfield', 
                selectOnFocus: true 
            },
            'bool' : {
                xtype: 'checkbox'
            }
        };
        
        if(record.get('type') == 2) {
            editor = editors.bool;
        } else if(record.get('type') == 1) {
            editor = editors.combo;
        } else {
            editor = editors.textfield;
        }

        cell.setEditor(editor, cell);

    },
    
    
    /*
    * Hide window. Clear config values.
    *
    * @param object win
    *
    */

    hideWidget: function(win) {
        win.config.agrm_id = 0;
        win.config.user_id = 0;
        win.config.vg_id = 0;
        this.getValuesPanel().getStore().removeAll();
    },
    
    
    /*
    * Show window. Load grid data
    */
    
    showWidget: function() {
        this.getValuesPanel().getStore().load({
            params: {
                'agrm_id': this.getMainWindow().config.agrm_id,
                'user_id': this.getMainWindow().config.user_id,
                'vg_id': this.getMainWindow().config.vg_id
            }
        });
    },
    
    
    /*
    * Hide window. Clear config values.
    *
    * @param object win
    *
    */
    
    switchToSetup: function(Btn) {
        var win = Btn.findParentByType('window');
        win.getLayout().setActiveItem(0);
       
        var item = win.getLayout().getActiveItem();     
        item.getDockedItems()[1].items.get(2).show();
        item.setActiveTab(win.config.displayData);
        
        item.getActiveTab().items.first().getStore().reload();
    },
    

    /*
    * Turn back from settings to values panel
    *
    * @param object Btn
    *
    */
    
    
    backToValues: function(Btn) {
        this.getMainWindow().getLayout().setActiveItem(1);
        this.getMainWindow().getLayout().getActiveItem().getStore().reload();
    },
    
    
    /*
    * Add new entry. Switch to third panel (form)
    *
    * @param object win
    *
    */
    
    addNewEntry: function(Btn) {
        var form = this.getEditingForm().getForm(),
            tabIdx = this.getTabPanel().items.findIndex('id', this.getTabPanel().getActiveTab().id);
        
        form.findField('type').setReadOnly(false);
        form.findField('addonsType').setValue(tabIdx);
        
        form.findField('agent_id')[(tabIdx == 2) ? 'enable' : 'disable']();
        form.findField('agent_id')[(tabIdx == 2) ? 'show' : 'hide']();
        
        this.getEditingPanel().down('grid').disable();
        this.getMainWindow().getLayout().setActiveItem(2); 

    },
    
    reloadGridStores: function() {
        this.getTabPanel().getActiveTab().items.first().getStore().reload();
    },
    
    setAddonValue: function(editor, context) {
        var params = context.record.data;

        if(this.getMainWindow().config.user_id != 0) {
            var url = 'index.php/api/AddonsValuesAccounts/set';
            params.user_id = this.getMainWindow().config.user_id;
        } else if(this.getMainWindow().config.vg_id != 0) {
            var url = 'index.php/api/AddonsValuesVgroups/set';
            params.vg_id = this.getMainWindow().config.vg_id;
        } else {
            var url = 'index.php/api/AddonsValuesAgreements/set';
            params.agrm_id = this.getMainWindow().config.agrm_id;
        }

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: params,
            scope: this,
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }                
                var data = response.results;
                this.getValuesPanel().getStore().reload();
            }
        });
        
    },
    
    
    
    editAddonStaff: function() {
        var record = arguments[5],
            form = this.getEditingForm().getForm(),
            tabIdx = this.getTabPanel().items.findIndex('id', this.getTabPanel().getActiveTab().id);
        
        // add some values to record
        record.data.addonsType = tabIdx;
        
        // prepair form fields
        form.findField('agent_id')[(tabIdx == 2) ? 'enable' : 'disable']();
        form.findField('agent_id')[(tabIdx == 2) ? 'show' : 'hide']();
        
        //enable or disable grid in editing form
        form.findField('type').setReadOnly(true);
        this.getEditingPanel().down('grid')[ (record.data.type == 1) ? 'enable' : 'disable']();
        
        // Set form values from record and switch it on
        if(record.data.type == 1) {
            this.getEditingPanel().down('grid').getStore().load({
                params: {
                    name: record.data.name,
                    type: tabIdx
                }
            });
        }
        
        form.setValues(record.data);
        
        if(tabIdx == 0 && record.get('agent_id') != '') {
            form.findField('agent_id').setRawValue(record.get('agent_name'));
        } 
        // show card
        this.getMainWindow().getLayout().setActiveItem(2);
        
        // set anchor of list values grid
        var height = this.getEditingForm().getHeight();
        this.getEditingGrid().anchor = '100% -' + height;
        this.getEditingGrid().doLayout();
        
    },
    
    changeFieldTypeValue: function(combo) {
        this.getEditingPanel().down('grid').getStore().removeAll();
        this.getEditingPanel().down('grid')[ (combo.getValue() == 1) ? 'enable' : 'disable']();
        if(combo.getValue() == 1) {
            // set anchor of list values grid
            var height = this.getEditingForm().getHeight();
            this.getEditingGrid().anchor = '100% -' + height;
            this.getEditingGrid().doLayout();
        }
    },
    
    backToCurrentTab: function() {
        this.getEditingForm().getForm().reset();
        this.getEditingForm().getForm().findField('type').setReadOnly(false);
        this.getEditingPanel().down('grid').getStore().removeAll();
        this.getMainWindow().getLayout().setActiveItem(0);
       
        this.getTabPanel().getActiveTab().down('gridpanel').getStore().reload();
    },
    
    addRecordToParams: function() {
        var grid = this.getEditingPanel().down('grid'),
            store = grid.getStore(),
            node = new store.model();
        
        store.insert(0, node);
    },
    
    
    saveStaffData: function() {
        var form = this.getEditingForm().getForm(),
            grid = this.getEditingPanel().down('grid'),
            store = grid.getStore();

        var tmp = [];    
        Ext.each(store.data.items, function(record) {
            if(record.get('value') != '') {
                tmp.push(record.data);
            }
        });    
        
        var gridParams = Ext.JSON.encode(tmp),
            formData = form.getValues();
    
        formData.values = gridParams;
        
        Ext.Ajax.request({
            url: 'index.php/api/addonsStaff/Set',
            method: 'POST',
            params: formData,
            scope: this,
            msg: i18n.get('Data successfully saved'),
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }
                if( form.findField('type').getValue() == 1) {
                    store.reload({
                        params: {
                            name: form.findField('name').getValue(),
                            type: form.findField('addonsType').getValue()
                        }
                    });
                }
                form.findField('type').setReadOnly(true);
            }
        });
    },
    
    
    
    deleteParam: function() {
        var record = arguments[5],
            form = this.getEditingForm().getForm(),
            store =  this.getEditingPanel().down('grid').getStore(),
            tabIdx = this.getTabPanel().items.findIndex('id', this.getTabPanel().getActiveTab().id);
        
        if(record.get('idx') == 0) {
            store.remove(record);
            return;
        }        
        
        var tmp = [];    
        Ext.each(store.data.items, function(record) {
            tmp.push(record.data);
        });    
        
        var params = {
            values: Ext.JSON.encode(tmp),
            addonsType: form.findField('addonsType').getValue(),
            name: form.findField('name').getValue(),
            idx: record.get('idx')
        }
        
        ajax.request({
            url: 'addonsStaff/deleteParams',
            params: params,
            success: function(result) {
                store.reload();
            },
            scope: this,
            confirmation: i18n.get('Do you realy want to delete this entry?')
        });
    },
    
    
    deleteAddonStaff: function() {
        var record = arguments[5],
            grid = arguments[0],
            tabIdx = this.getTabPanel().items.findIndex('id', this.getTabPanel().getActiveTab().id);
        
        var params = {
            addonsType: tabIdx,
            name: record.get('name')
        }
        
        // send delete ajax request
        ajax.request({
            url: 'addonsStaff/DeleteAddon',
            params: params,
            success: function(result) {
                grid.getStore().reload();
            },
            scope: this,
            confirmation: i18n.get('Do you realy want to delete this entry?')
        });
    }
    
});
