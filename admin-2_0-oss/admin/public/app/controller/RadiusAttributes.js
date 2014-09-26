Ext.define("OSS.controller.RadiusAttributes", {
    extend: 'Ext.app.Controller',
    views: [
        'RadiusAttributes',
        'radiusattributes.Grid',
        'radiusattributes.Form',
        'accounts.item.common.left.Parent',
        'accounts.item.common.right.tariff.Combogrid'
        ],
    view: 'RadiusAttributes',
    stores: [
        'radiusattributes.List',
        'radiusattributes.RadiusAgents',
        'radiusattributes.Dictionary',
        'radiusattributes.AccountsGroups',
        'radiusattributes.Categories',
        'radiusattributes.RnasList',
        'radiusattributes.DeviceGroups'
    ],
    refs: [{
        selector: 'radiusattributes_form',
        ref: 'attributesForm'
    }, {
        selector: 'radisuattributes > toolbar > #actions > menu > #saveBtn',
        ref: 'saveBtn'
    }, {
        selector: 'radisuattributes > toolbar > #actions > menu > #deleteBtn',
        ref: 'deleteBtn'
    }, {
        selector: '#attributsGrid',
        ref: 'attributesGrid'
    }],
    init: function() {
        this.control({
            '#attributsGrid': { 
                render: this.loadGrid,
                itemclick: this.selectAttribute
            },
            '#attributsForm': { 
                afterrender: this.onFormRender
            },
            'radisuattributes > toolbar #searchAttributes': {
                click: this.searchAttributes
            },
            'radisuattributes > toolbar > #actions > menu > #deleteBtn': {
                click: this.deleteAttribute
            },
            'radisuattributes > toolbar > #actions > menu > #saveBtn': {
                click: this.saveAttribute
            },
            'radisuattributes > toolbar > #actions > menu > #addBtn': {
                click: this.addAttribute
            },
            'tarcmbgrid': {
                change: this.loadCategoriesForTariff
            },
            '#agentLink': {  
                change: this.controlAgentLinkedFields
            },
            '#accountgroupLink': {  
                change: this.controlAccountgroupLinkedFields
            },
            '#tariffLink': {  
                change: this.controlTariffLinkedFields
            },
            '#accountLink': {  
                change: this.controlAccountLinkedFields
            },
            '#shapeLink': {  
                change: this.controlShapeLinkedFields
            }
        });
    },

    onFormRender: function (form) {
        var agentcmb = form.getForm().findField('id'),
            nascmb   = form.getForm().findField('nas_id'),
            attrcmb  = form.getForm().findField('attr_id'),
            tarcmb  = form.getForm().findField('tar_id');

        agentcmb.on('change', this.reloadAssignedStores, this);
        nascmb.on('change', this.controlNasGroupsCombo, this);
        attrcmb.on('change', this.controlTagField, this);
        tarcmb.on('change', this.controlTarCategoryField, this);

        this.getRadiusattributesRnasListStore().on('load', function (store, data) {
            store.add({ 
                nas_id: 0, 
                rnas: i18n.get('All')
            });
            store.add({ 
                nas_id: -1, 
                rnas: i18n.get('Group')
            });
            nascmb.setValue(nascmb.getValue());
        }, this);

        this.getRadiusattributesRadiusAgentsStore().load();
        this.getRadiusattributesDeviceGroupsStore().load();
        this.getRadiusattributesDictionaryStore().load();
        this.getRadiusattributesAccountsGroupsStore().load();

    },

    reloadAssignedStores: function (combo, value) {
        var nascmb = combo.up('form').getForm().findField('nas_id');
        nascmb.setValue(0);
        if (Ext.isEmpty(value) || Number(value) < 1) {
            nascmb.disable();
            return;
        }
        nascmb.enable();
        var nasStore = this.getRadiusattributesRnasListStore();
        nasStore.proxy.extraParams.agent_id = value;
        nasStore.load();

        var tarcmb = combo.up('form').getForm().findField('tar_id'),
            tarStore = tarcmb.getStore(),
            agentType = combo.getStore().findRecord('id', value).get('type'),
            tar_types = '0,1,2,5';

        tarcmb.setValue(null);
        tarcmb.setRawValue('');

        if (agentType == 12) {
            tar_types = '4';
        }
        tarStore.proxy.extraParams.tar_types = tar_types;
        tarStore.load();
    },

    controlNasGroupsCombo: function (combo, value) {
        var field = combo.up('form').getForm().findField('dev_group_id');
        field.setDisabled(value != -1);
    },

    controlTagField: function (combo, value) {
        var field = combo.up('form').getForm().findField('tag');
        field.setDisabled(true);
        if (!Ext.isEmpty(record = combo.getStore().findRecord('record_id', value) ) ) {
           if ( record.get('tagged') ) {
                field.setDisabled(false);
           }
        }
    },

    controlTarCategoryField: function (combo, value, oldvalue) {
        if (Ext.isEmpty(oldvalue)) {
            return;
        }
        var field = combo.up('form').getForm().findField('cat_idx');
        field.setValue("");
        field.setDisabled(true);
        if (!Ext.isEmpty(value) && Number(value) > 0) {
            field.setDisabled(false);
        }
    },

    loadCategoriesForTariff: function(combo, value) {
        if (Ext.isEmpty(value) || Number(value) < 1) {
            return;
        }

        var store = this.getRadiusattributesCategoriesStore();
        store.proxy.extraParams.tar_id = value;
        store.load();
    },

    loadGrid: function(grid) {
        grid.getStore().load();
    },

    searchAttributes: function (Btn) {
        var type = Btn.up().items.get('type').getValue(),
            search = Btn.up().items.get('searchField').getValue();

        var store = this.getRadiusattributesListStore();
        store.proxy.extraParams.type = type;
        store.proxy.extraParams.search = search;

        store.reload();
    },

    selectAttribute: function (grid, record) {
        this.getAttributesForm().enable();
        this.getSaveBtn().enable();
        this.getDeleteBtn().enable();

        var form = this.getAttributesForm().getForm();
        form.reset();
        form.setValues(record.data);
        if (record.data.vg_id > 0) {
            form.findField('vg_id').setRawValue(record.data.owner_descr);
        }
        if (record.data.tar_id > 0) {
            form.findField('tar_id').setRawValue(record.data.owner_descr);
        }
        if (record.data.cat_idx >= 0) {
            form.findField('cat_idx').setRawValue(record.data.cat_descr);
        }
        if (record.data.id < 1) {
            form.findField('id').setRawValue("");
        }
        if (record.data.attr_id < 1) {
            form.findField('attr_id').setRawValue("");
        }
    },

    deleteAttribute: function () {
        var records = this.getAttributesGrid().getSelectionModel().getSelection();
        if (records.length < 1) {
            return;
        }
        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                if (records[0].get('id') == 0) {
                    this.getAttributesGrid().getStore().remove(records[0]);
                } else {
                    records[0].destroy();
                }
                this.getAttributesForm().disable();
                this.getAttributesForm().getForm().reset();             
            }
        }, this);
    },

    saveAttribute: function () {
        if (!this.getAttributesForm().getForm().isValid()) {
            return;
        } 

        this.getAttributesForm().submit({
            clientValidation: true,
            url: 'index.php/api/radiusattributeslist/save',
            success: function(form, action) {
               this.getRadiusattributesListStore().reload();
            },
            scope: this
        });
    },

    addAttribute: function () {
        var grid = this.getAttributesGrid();
        var inst = grid.getStore().add({'record_id': 0, 'link': 1, 'radius_code': 2});
        grid.getSelectionModel().select(inst, true, true);
        this.selectAttribute(grid, inst[0]);
    },

    controlAgentLinkedFields: function (el, value) {
        var form = el.up('form').getForm();
        form.findField('service').setDisabled(!value); 
        form.findField('service_for_list').setDisabled(!value); 
    },

    controlAccountLinkedFields: function (el, value) { 
        var form = el.up('form').getForm();
        form.findField('vg_id').setDisabled(!value); 
    },

    controlShapeLinkedFields: function (el, value) { 
        var form = el.up('form').getForm();
        form.findField('shape').setDisabled(!value); 
    },

    controlAccountgroupLinkedFields: function (el, value) { 
        var form = el.up('form').getForm();
        form.findField('group_id').setDisabled(!value); 
    },

    controlTariffLinkedFields: function (el, value) {
        var form = el.up('form').getForm();
        form.findField('cat_idx').setDisabled(!value); 
        form.findField('tar_id').setDisabled(!value); 
    }

});
