Ext.define('OSS.controller.PrintingForms', {
    extend: 'Ext.app.Controller',
    STATUS_DONE: 0,
    STATUS_LOADING: 1,
    STATUS_CANCELED: 3,
    STATUS_ERROR: 4,
    views: [ 
        'printforms.Grid',
        'printforms.Filter',
        'PrintingForms',
        'OSS.view.printforms.UserQuickSearch',
        'OSS.view.printforms.AgrmQuickSearch',
        'OSS.view.printforms.RemoveButton'
    ],
    view: 'PrintingForms',
    
    stores: [
        'OSS.store.printforms.DocumentsList',
        'OSS.store.reports.Documents',
        'OSS.store.users.Groups',
        'OSS.store.printforms.Agreements',
        'OSS.store.OperatorsList',
        'documenttemplates.PrintFormsDocuments'
    ],
    
    /*
    * List of references
    */
    
    refs: [{
        selector: 'printing_forms',
        ref: 'mainPanel'
    }, {
        selector: 'printing_forms > grid',
        ref: 'mainGrid'
    }, {
        selector: 'printing_forms > form',
        ref: 'mainForm'
    }, {
        selector: 'printing_forms > form > templateslist',
        ref: 'templatesList'
    }, {
        selector: 'userquicksearch',
        ref: 'userQuickSearchField'
    }, {
        selector: 'agrmquicksearch',
        ref: 'agrmQuickSearchField'
    }, {
        selector: 'printing_forms > form #apCnt',
        ref: 'apCnt' // abon. plata ;)
    }, {
        selector: 'printing_forms > grid > toolbar > #toggleReloadBtn',
        ref: 'toggleReload'
    }],
    
    init: function() {
        this.control({
            'printing_forms > gridpanel': {
                afterrender: this.loadGridData
            },
            'printing_forms > gridpanel > toolbar #reloadBtn': {
                click: this.reloadGrid
            },
            'printing_forms > form #startGenerationBtn': {
                click: this.generatePrintingForm
            },
            'printing_forms templateslist': {
                afterrender: this.templatesListRender,
                change: this.selectTemplate
            },
            'printing_forms > form #apCbox': {
                change: this.apCheckboxSet
            },
            'printing_forms > form #userTypeCmb': {
                select: this.selectUserType
            },
            'printing_forms > form #grouppingCmb': {
                select: this.selectGroupping
            },
            'printing_forms > form #userCG': {
                change: this.selectUser
            },
            'printing_forms > form #agrmCG': {
                afterrender: this.onAgrmRender,
                select: this.onChangeAgrm
            }
        });
    },
    
    
    /*
    * Load grid with documents after it render
    * 
    * @param object grid
    *
    */
    
    loadGridData: function(grid) {
        this.initReloading();
        grid.getStore().getProxy().setExtraParam( 'on_fly', 0 );
        grid.getStore().load();
    },
    
    
    /*
    * Press button "Start generation". Send request to server for documents generation
    * 
    * @param object Btn
    *
    */
    
    generatePrintingForm: function(Btn) {
        var data = this.getMainForm().getForm().getValues();
        if (data.doc_id == '' || data.date == '') {
            Ext.Msg.alert(i18n.get('Error'), i18n.get('Please fill required fields'));
            return;
        } 
        Ext.Ajax.request({
            url: 'index.php/api/documentsqueue/GenPrintForms',
            method: 'PUT',
            params: data,
            scope: this,
            msg: i18n.get('Generation started'),
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }
                var data = response.results;
                this.getMainGrid().getStore().reload();
            }
        });
    }, 
    
    
    /*
    * Event on select template. Show or hide "Summ" textfield
    * 
    * @param object combo
    *
    * @param int value
    *
    */
    
    selectTemplate: function(combo, value) {
        var record = combo.getStore().findRecord('doc_id', value);
        this.getApCnt()[record.data.payable>1 ? 'show' : 'hide']();
        this.getApCnt().down('textfield').setValue(null);
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
    * Show or hide some fields on select "Create documents" param
    * 
    * @param object combo
    * 
    * @param object records
    *
    */
    
    selectUserType: function(combo, records) {
        
        switch(records[0].data.field1) {
            case 0:
                combo.up('container').items.get(1).hide();
                combo.up('container').items.get(2).hide();
                combo.up('container').items.get(3).hide();
                break;
            case 1: 
                combo.up('container').items.get(1).show();
                combo.up('container').items.get(2).hide();
                combo.up('container').items.get(3).hide();
                break;
            case 2:
                combo.up('container').items.get(1).hide();
                combo.up('container').items.get(2).show();
                combo.up('container').items.get(3).hide();
                break;
        }
    },
    
    
    /*
    * Show or hide some fields on groupping select
    * 
    * @param object combo
    * 
    * @param object records
    *
    */
    
    selectGroupping: function(combo, records) {
        combo.up('container').items.get(1)[ (records[0].data.field1==2) ? 'show' : 'hide']();
        if (records[0].data.field1 == 1) {
            combo.up('container').items.get(1).setValue(0);
        }
    },
    
    
    /*
    * Reload grid
    *
    */
    
    reloadGrid: function() {
        this.getMainGrid().getStore().reload();
    },
    
    
    /*
    * Initialize autoreload component (10-sec reload button in grid toolbar)
    *
    */
    
    initReloading: function() {
        Ext.create('OSS.helpers.reports.Reloading', {
            button: this.getToggleReload(),
            callback: this.reloadGrid,
            reloadingStateParamName: 'printforms_autoload',
            scope: this
        }).start();
    },
    
    
    
    /*
    * Action on render templates combogrid - add params to its store
    *
    * @params object combo
    *
    */
    
    templatesListRender: function(combo) {
        combo.getStore().getProxy().setExtraParam('on_fly', 0);
    },
    
    
    /*
    * Action on select user in User's combogrid. It will show agreement container
    *
    * @params object combo
    *
    */
    
    selectUser: function(combo) {
        var uid = this.getUserQuickSearchField().getValue();
        
        this.getAgrmQuickSearchField().getStore().removeAll();
        this.getAgrmQuickSearchField().getStore().getProxy().setExtraParam('uid', uid);
        this.getAgrmQuickSearchField().getStore().reload();
        this.getAgrmQuickSearchField().setValue(0);
        this.getAgrmQuickSearchField().setRawValue(i18n.get('All'));
        this.getAgrmQuickSearchField().up('fieldcontainer').show();
    },
    
    
    /*
    * Action on render agreements combogrid. Adding zero value on each store load
    *
    * @params object combo
    *
    */
    
    onAgrmRender: function(combo) {
        combo.getStore().on('load', function(store){
            var record = Ext.data.Model([ { agrm_id: 0, agrm_num: i18n.get('All')} ]);
            store.insert( 0, record );
        });
    },
    
    
    /*
    * Action on render agreements combogrid. Adding zero value on each store load
    *
    * @params object combo
    *
    */
    
    onChangeAgrm: function(combo, records) {
        if (records[0].get('agrm_num') == '') {
            combo.setRawValue(records[0].get('agrm_id'));
        }
    },
    
    
    /*
    * Cancel document generation
    *
    * @params object record
    *
    */
    
    docCancel: function(record) {
        ajax.request({
            url: 'documentsqueue/cancel',
            params: {
                record_id: record.get('record_id')
            },
            success: this.reloadGrid,
            scope: this
        });
    },
    
    
    /*
    * Remove document from the list
    *
    * @params object record
    *
    */
    
    docRemove: function(record) {
        
        ajax.request({
            url: 'documentsqueue/'+record.get('record_id'),
            method: 'DELETE',
            success: this.reloadGrid,
            scope: this,
            confirmation: OSS.Localize.get('Do you realy want to delete this entry?')
        });
    }
    
});
