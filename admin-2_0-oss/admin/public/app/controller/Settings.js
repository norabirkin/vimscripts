Ext.define('OSS.controller.Settings', {
    extend: 'Ext.app.Controller',

    requires: [
        'OSS.ux.form.field.Password'
    ],
    
    views: [
        'Settings'
    ],

    refs: [{
        selector: 'osssettings > #commons',
        ref: 'common'
    }, {
        selector: 'osssettings > panel > #paymentsForm',
        ref: 'paymentsForm'
    }],
    
    stores: [
        'Settings.Common', 
        'Settings.Documents',
        'Settings.Operators', 
        'Settings.Countries',
        'Settings.Payclasses',
        'Settings.Payments',
        'Settings.AgreementTemplates'
    ],
    
    view: 'Settings',
    
    init: function() {
        this.control({
            'osssettings': {
                tabchange: function(panel, tab) {
                    if (tab.isXType('grid')) {
                        tab.getStore().load({
                            params: {
                                group: '4,5,6'
                            }
                        });
                    } else if (tab.isXType('panel') && !Ext.isEmpty(tab.items) && !Ext.isEmpty(tab.items.get("paymentsCat"))) {
                        tab.items.get("paymentsCat").getStore().load();
                    }
                },
                afterrender: function(panel) {
                    panel.setActiveTab(0);
                }
            },
            'osssettings > #commons > toolbar > #reload': {
                click: this.reloadCommon
            },
            'osssettings > panel > #paymentsCat #delete': {
                click: this.deletePayclass
            },
            'osssettings > panel > #paymentsCat': {
                render: this.onPaymentsTabRender
            },
            'osssettings > panel > #paymentsCat > toolbar > #reload': {
                click: this.reloadCommon
            },
            'osssettings > panel > #paymentsCat > toolbar > #actions > menu > #addPayclassBtn': {
                click: this.addPayclass
            },
            'osssettings > panel > #paymentsForm': {
                afterrender: this.loadPaymentsForm
            },
            'osssettings > panel > #paymentsForm > toolbar > #actions > menu > #savePayments': {
                click: this.bntSavePaymentsForm
            },
            'osssettings > #templateAgreementNumbers > toolbar > #reload': {
                click: this.reloadCommon
            },
            'osssettings > #templateAgreementNumbers #delete': {
                click: this.deleteAgreementNumberTemplate
            },
            'osssettings > #templateAgreementNumbers > toolbar > #actions > menu > #addAgrmTemplateBtn': {
                click: this.addAgreementTemplate
            },
            'osssettings > #templateAgreementNumbers': {
                afterrender: this.onAgreementTemplatesTabRender
            }
        });
    },

    onSettingSave: function() {
        OSS.component.Profile.updateOptions(this.getCommon().getStore());
    },


    deletePayclass: function (a, b, c, d, e, record) {
        if (record.get('class_id') == 0) {
            return;
        }
        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                record.destroy();
            }
        }, this);
    },
    
    
    /**
     * reload grid with common settings
     * @param {Button} Btn
     */
    reloadCommon: function (Btn) {
        var grid = Btn.up('grid');
        grid.getStore().reload({
            force: true
        });
    },
    
    
    /**
     * Click action for adding new record of Payments Categories grid
     * @param   {object} button
     * @param   {object} event
     *   Btn - The button
     */
    /*bntSavePaymentsForm: function(Btn) {
        var grid = Btn.up('grid');
            inst = grid.getStore().add({'descr': i18n.get('New template'), 'value': '', 'group': 10, 'name': 'agrmnum_template' })[0];
            
        grid.getSelectionModel().select(inst.value);
    },*/
    
    
    /**
     * Click action for submiting Settings -> Payments form
     * @param   {object} button
     * @param   {object} event
     *   Btn - The button
    */
    bntSavePaymentsForm: function(Btn) {
        var form = Btn.up('form');
        form.submit({
            success: function() {
                OSS.component.Profile.updatePaymentOptions(form);
            }
        });
    },
    
    
    
    /**
     * Load payments tab's form after form render
     * @param   {object} form
     *   form - The form
     */
    loadPaymentsForm: function(form) {
        var store = this.getStore('Settings.Payments');
        store.load();
        store.on('load', this.onPaymentsFormStoreLoaded, this);
    },

    onPaymentsFormStoreLoaded: function() {
        var str ={};
        this.getStore('Settings.Payments').each(function(record, index) {
            str[record.get('name')] = record.get('value');
        });
        this.getPaymentsForm().getForm().setValues(str);
    },
    
    
    
    /**
     * Click button which will add a new record to grid
     * @param   {object} Btn
     *   Btn - The button
     */
    bntAddAutonum: function(Btn) {
        var grid = Btn.up('grid'),
            inst = grid.getStore().add({'descr': i18n.get('New template'), 'value': '', 'group': 10, 'name': 'agrmnum_template' })[0];
            
        grid.getSelectionModel().select(inst.value);
    },
    
    
    /**
     * Clear textarea
     * @param   {object} el
     *   el - The textarea
     */
    clearForm: function(el) {
        Ext.create('Ext.tip.ToolTip', {
            target: el,
            autoHide: false,
            html: 'Press this button to clear the form'
        });
    },

    onPaymentsTabRender: function (grid) {
        grid.getStore().on('update', function(store, record, event, rowIndex){
            Ext.Ajax.request({
                url:  Ext.Ajax.getRestUrl("api/payclasses/update"),
                params: {
                    'id': record.get('class_id'),
                    'name': record.get('name'),
                    'descr': record.get('descr'),
                    'extern_code': record.get('extern_code')
                },
                callback: function() {
                    this.getSettingsPayclassesStore().reload();
                },
                scope: this
            });
        }, this);
    },

    addPayclass: function() {
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/payclasses/create"),
            params: {
                id: 0,
                descr: OSS.Localize.get('New category of payments'),
                name: OSS.Localize.get('New category of payments')
            },
            callback: function() {
                this.getSettingsPayclassesStore().reload();
            },
            scope: this
        });
    },

    deleteAgreementNumberTemplate: function (a, b, c, d, e, record) {
        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                Ext.Ajax.request({
                    url:  Ext.Ajax.getRestUrl("api/agreementtemplates/delete"),
                    params: {
                        'name': record.get('name')
                    },
                    callback: function() {
                        this.getSettingsAgreementTemplatesStore().reload({
                            force: true
                        });
                    },
                    scope: this
                });
            }
        }, this);
    },

    onAgreementTemplatesTabRender: function (grid) {
        grid.getStore().on('update', function(store, record){
            this.saveAgreementTemplate(record.data);
        }, this);
    },

    addAgreementTemplate: function() {
        this.saveAgreementTemplate({descr: OSS.Localize.get('New template')});
    },

    saveAgreementTemplate: function(params) {
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/agreementtemplates/save"),
            params: params,
            callback: function() {
                this.getSettingsAgreementTemplatesStore().reload({
                    force: true
                });
            },
            scope: this
        });
    }
});
