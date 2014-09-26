Ext.define('OSS.controller.DocumentTemplates', {
    extend: 'Ext.app.Controller',
    
    views: [ 
        'DocumentTemplates', 
        'documenttemplates.List', 
        'documenttemplates.Form'
    ],
    view: 'DocumentTemplates',
    
    stores: [ 
        'documenttemplates.List',
        'currency.Grid',
        'documenttemplates.AccountsGroups',
        'documenttemplates.UserGroups',
        'documenttemplates.TemplateFiles'
    ],

    refs: [{
        selector: 'doctempl',
        ref: 'documentTemplates'
    }, {
        selector: 'documenttemplates_form',
        ref: 'documentForm'
    }],
    
    init: function() {
        this.control({
            'documenttemplates_list > gridpanel': {
                afterrender: this.loadList
            },
            'documenttemplates_list > gridpanel #editColumn': {
                click: this.editDocument
            },
            'documenttemplates_list > toolbar #addNewDocumentBtn': {
                click: this.addNewDocument
            },
            'documenttemplates_list > gridpanel #deleteColumn': {
                click: this.deleteDocument            
            },
            'documenttemplates_form > toolbar #back': {
                click: this.backToList
            },
            'documenttemplates_form > toolbar > #actions > menu > #saveDocumentBtn': {
                click: this.saveDocumentData
            },
            'documenttemplates_form': {
                afterrender: this.onDocumentFormRender
            },
            'documenttemplates_form > form > #leftColumnCnt #classOfDocument': {
                select: this.onClassOfDocumentChange
            },
            'documenttemplates_form > form > #rightColumnCnt > fieldset > #ugroupCnt > #uGroupRadio': {
                change: this.onGroupFlagChange
            },
            'documenttemplates_form > form > #rightColumnCnt > fieldset > #agroupCnt > #aGroupRadio': {
                change: this.onGroupFlagChange
            }
        });
    },

    loadList: function(grid) {
        grid.getStore().load();
    },

    deleteDocument: function (view, cell, rowIndex, cellIndex, event, record) {
        
        Ext.Msg.confirm( i18n.get( "Confirmation" ), i18n.get('Do you realy want to delete this entry?'), function(B) {
            if (B == 'yes') {
                record.destroy();
            } 
        }, this);

    },

    editDocument: function (view, cell, rowIndex, cellIndex, event, record) {
        this.showDocumentForm(record.data);
    },

    addNewDocument: function (Btn) {
        this.showDocumentForm({'on_fly': 1});
    },

    showDocumentForm: function(data){

        if (!data) {
            var data = [];
        }

        var form                = this.getDocumentForm().down('form').getForm(),
            groupedOrdersCnt    = this.getDocumentForm().down('form').items.get('rightColumnCnt').items.get('groupedOrdersCnt'),
            usrGroupField       = form.findField('user_group_id'),
            accGroupField       = form.findField('group_id'),
            docPeriodField      = form.findField('document_period');

        this.getDocumentTemplates().getLayout().setActiveItem(1);

        this.getDocumentForm().down('form').restoreOriginalValues();
        form.reset();
        form.setValues(data);
        groupedOrdersCnt.hide();

        Ext.Ajax.request({
            url: 'index.php/api/documenttemplates/isUseGroupedOrders',
            method: 'GET',
            scope: this,
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }               
                var data = response.results;
                if (!Ext.isEmpty(data) && data == 1) {
                    groupedOrdersCnt.show();
                }
            },
            failure: this.failure
        });

        this.getCurrencyGridStore().load();

        if (data.group_type != 1) {
            usrGroupField.setValue(' - ');
        }
        if (data.group_type != 2) {
            accGroupField.setValue(' - ');
        }

        this.onClassOfDocumentChange();
        this.onGroupFlagChange(usrGroupField, data.group_type == 1);
        this.onGroupFlagChange(accGroupField, data.group_type == 2);
        usrGroupField.getStore().reload();
        accGroupField.getStore().reload();
        this.getDocumentForm().down('form').resetOriginalValues();
    },

    

    backToList: function(Btn) {
        this.getDocumentTemplates().getLayout().setActiveItem(0);
        this.getDocumenttemplatesListStore().reload();
    },

    saveDocumentData: function() {
        this.getDocumentForm().down('form').getForm().submit({
            url: Ext.Ajax.getRestUrl('api/documenttemplates/save'),
            method: 'POST',
            clientValidation: true,
            scope: this,
            msg: true,
            success: function(form, action) {               
                var response = Ext.JSON.decode(action.response.responseText);
                var docIdField = this.getDocumentForm().down('form').getForm().findField('doc_id');
                // Set id to new document
                if (docIdField.getValue() == 0) {
                    docIdField.setValue(response.results);
                }
                this.getDocumentForm().down('form').resetOriginalValues();
            },
            failure: this.failure
        });
    },

    onDocumentFormRender: function() {
        var currencyStore = this.getCurrencyGridStore();

        currencyStore.on('load', function(store, data){
            var currencyField = this.getDocumentForm().down('form').getForm().findField('cur_id');
            // Set default currency if field is empty
            if (Ext.isEmpty(currencyField.getValue())) {
                if (-1 != store.find('is_def', true)) {
                    currencyField.setValue(store.find('is_def', true));
                    this.getDocumentForm().down('form').resetOriginalValues();
                }
            }
        }, this);

    },

    onClassOfDocumentChange: function(field) {
        var form = this.getDocumentForm().down('form').getForm(),
            type = form.findField('on_fly'),
            period = form.findField('document_period');
        
        period[[1,2,7].indexOf(type.getValue()) > -1 ? 'enable' : 'disable']();
    },

    onGroupFlagChange: function(field, value) {
        if (!Ext.isEmpty(field.up('fieldcontainer').down('combobox'))) {
            var contentField = field.up('fieldcontainer').down('combobox');
        } else {
            var contentField = field.up('fieldcontainer').down('combogrid1');
        }
        if (value) {
            contentField.enable();
        } else {
            contentField.disable();
        }
    }
});
