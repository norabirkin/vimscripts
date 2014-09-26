Ext.define('OSS.controller.PrintingFormsStat', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.grid.plugin.CellEditing'
    ],
    views: [
        'PrintingFormsStat',
        'printingformsstat.Grid',
        'printingformsstat.Form',
        'reports.list.Grid'
    ],
    view: 'PrintingFormsStat',
    stores: [
        'printingformsstat.List',
        'printingformsstat.Operators',
        'documenttemplates.AccountsGroups',
        'printingformsstat.Documents'
    ],

    refs: [{
        selector: '#printingStatGrid',
        ref: 'printingStatGrid'
    }, {
        selector: '#printingStatForm',
        ref: 'printingStatForm'
    }, {
        selector: '#withoutpayRadioEl',
        ref: 'withoutpayRadioEl'
    }, {
        selector: '#payedRadioEl',
        ref: 'payedRadioEl'
    }, {
        selector: '#allPayRadioEl',
        ref: 'allPayRadioEl'
    }],

    init: function () {
        this.control({
            '#printingStatForm > toolbar > #actions > menu > #showBtn' : {
                click: this.refreshMainGrid
            },
            '#payedRadioEl': {
                change: this.controlDateFieldDisable
            },
            '#templateslist': {
                select: this.controlRadioFieldsDisable,
                render: this.onTemplatesStoreLoad
            },
            '#ugroupslist': {
                render: this.onGroupsStoreLoad
            },
            '#printingStatForm > toolbar > #actions > menu > #uploadBtn > menu > #uploadSelectedBtn': {
                click: this.downloadSelectedDocuments
            },
            '#printingStatForm > toolbar > #actions > menu > #uploadBtn > menu > #uploadPageBtn': {
                click: this.downloadDocumentsOnPage
            },
            '#printingStatForm > toolbar > #actions > menu > #uploadBtn > menu > #uploadAllBtn': {
                click: this.downloadAllDocuments
            },
            '#periodRadioEl': {
                change: this.controlPeriodFieldsDisable
            },
            '#monthRadioEl': {
                change: this.controlMonthFieldDisable
            }
            
        })
    },

    controlDateFieldDisable: function (el, value) {
        el.up('form').getForm().findField('pay_date').setDisabled(!value);
    },

    controlPeriodFieldsDisable: function (el, value) {
        el.up('form').getForm().findField('date_from').setDisabled(!value);
        el.up('form').getForm().findField('date_to').setDisabled(!value);
    },

    controlMonthFieldDisable: function (el, value) {
        el.up('form').getForm().findField('period').setDisabled(!value);
    },

    controlRadioFieldsDisable: function (el, records) {
        if (records[0].get('payable') > 0) {
            this.getWithoutpayRadioEl().setDisabled(false);
            this.getPayedRadioEl().setDisabled(false);
        } else {
            this.getWithoutpayRadioEl().setDisabled(true);
            this.getPayedRadioEl().setDisabled(true);
            this.getAllPayRadioEl().setValue(-1);
        }
    },

    onTemplatesStoreLoad: function (el) {
        el.getStore().on('load', function (store) {
            store.insert(0, {
                doc_id: 0,
                payable: 1,
                name: i18n.get('All')
            });
        }, this);
        el.setValue(0);
        el.setRawValue(i18n.get('All'));
    },

    onGroupsStoreLoad: function (el) {
        el.getStore().on('load', function (store) {
            store.insert(0, {
                group_id: 0,
                name: i18n.get('All')
            });
        }, this);
        el.setValue(0);
        el.setRawValue(i18n.get('All'));
    },

    refreshMainGrid: function (Btn) {
        this.getPrintingformsstatListStore().getProxy().extraParams = Btn.up('form').getForm().getValues();
        this.getPrintingformsstatListStore().load();
    },

    downloadSelectedDocuments: function () {
        var selRecords = this.getPrintingStatGrid().getSelectionModel().getSelection(),
            downloadSrc = '';
        if (selRecords.length < 1) {
            return;
        }

        if (selRecords.length == 1) {
            downloadSrc = 'index.php/api/printingforms/export?file_name=' + selRecords[0].get('file_name') +  '&upload_ext='  + selRecords[0].get('upload_ext');
            this.uploadFileBySrc(downloadSrc);
        } else { 

            if (false == this.checkSameTemplate()) {
                Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get( 'Documents to export must have the same template' ));
                return;
            }
            var ids = [];
            Ext.each(selRecords, function (rec) {
                ids.push(rec.get('order_id'));
            }, this);
            ids = ids.join(',');

            this.getFileByParameters({
                ids: ids,
                mode: "selected"
            });
        }
    },


    downloadDocumentsOnPage: function() {
        this.downloadMultipleDocuments('page');
    },

    downloadAllDocuments: function() {
        this.downloadMultipleDocuments('all');
    },

    downloadMultipleDocuments: function (mode) {
        if (false == this.checkSameTemplate()) {
            Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get( 'Documents to export must have the same template' ));
            return;
        }
        var store     = this.getPrintingformsstatListStore(),
            storeParams  = store.proxy.extraParams,
            params = {};

        if(store.getCount() < 1) {
            Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get( 'No documents to export' ));
            return;
        }


        for (var item in storeParams) {
            if (!Ext.isEmpty(storeParams[item])) {
                params[item] = storeParams[item];
            }
        }

        if (mode == 'page') {
            params['start'] = store.currentPage;
            params['limit'] = store.pageSize;
        }
        params['mode'] = mode;
        this.getFileByParameters(params);
    },

    getFileByParameters: function(params){
        Ext.MessageBox.show({
            title: OSS.Localize.get('Creating file'),
            width:300,
            wait:true,
            waitConfig: {interval:600},
            progress:true,
            closable: true,
            buttons: Ext.Msg.CANCEL,
            buttonText: {
                cancel:  OSS.Localize.get('Cancel')
            }
        });

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/printingforms/getmultiplefilename"),
            timeout: 300000,
            params: params,
            success: function() {
                Ext.MessageBox.hide();
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }               
                var data = response.results,
                    downloadSrc = 'index.php/api/printingforms/downloadfile?upload_ext=' + this.getPrintingformsstatListStore().getRange()[0].get('upload_ext') + '&file_name=' + data.file_name;

                this.uploadFileBySrc(downloadSrc);
            },
            failure: this.failure,
            scope: this
        });

    },


    checkSameTemplate: function () {
        var storeExtraParams = this.getPrintingformsstatListStore().getProxy().extraParams;
        if (Ext.isEmpty(storeExtraParams.doc_id) ||  storeExtraParams.doc_id < 1) {
            return false;
        }
        return true;
    },

    uploadFileBySrc: function (src) {
        if (!this.fileUploadingIframe) {
            this.fileUploadingIframe = Ext.DomHelper.append(Ext.getBody(), { tag: "iframe" });
        }
        this.fileUploadingIframe.src = src;
    }
    
});