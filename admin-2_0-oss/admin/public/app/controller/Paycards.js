Ext.define("OSS.controller.Paycards", {
    extend: 'Ext.app.Controller',
    views: [
        'Paycards',
        'paycards.GenPaycardsForm'
    ],
    view: 'Paycards',
    stores: [
        'Paycards',
        'paycards.PaycardsSets'
    ],
    // Iframe for downloading csv file
    fileUploadingIframe: null,
    refs: [{
        selector: 'paycards',
        ref: 'main'
    }, {
        selector: 'paycards > gridpanel > toolbar > #searchbtn',
        ref: 'searchbtn'
    }],
    init: function() {
        this.control({
            'paycards': {
                render: this.loadPaycards
            },
            'paycards > gridpanel > toolbar > #actions > menu > #paycardsgen': {
                click: this.LaunchPaycardsGenForm
            },
            'paycards > gridpanel > toolbar > button#searchbtn': {
                click: this.RefreshMainGrid
            },
            'paycards > gridpanel > toolbar > combobox#is_activated': {
                select: this.UpdateGridView
            },
            'genpaycardsform > toolbar > button#formSaveBtn': {
                click: this.SendFormInfo
            },
            'genpaycardsform > form > combobox#cardSet': {
                select: this.SetCurrency
            },
            'paycards > gridpanel > toolbar > #actions > menu > #downloadbtn > menu > #exportAllBtn': {
                click: this.DownloadAllCards
            },
            'paycards > gridpanel > toolbar > #actions > menu > #downloadbtn > menu > #exportCurrentBtn': {
                click: this.DownloadCardsOnPage
            },
            'paycards > gridpanel > toolbar > #fullsearch': {
                afterrender: this.BindToSearchBtn
            }
        });
    },
    search: function() {
        this.getToolbar().refreshGrid();
    },
    loadPaycards: function(panel) {
        panel.items.get('paycardspanel').getStore().load();
    },

    /*
     * Click to search button on press enter on fullsearch field
    */
    BindToSearchBtn: function(field){
        field.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                this.RefreshMainGrid(field);
            }
        }, this);
    },
    
    /**
     * Create new window to generate paycards
     */     
    LaunchPaycardsGenForm: function() {
        Ext.widget('genpaycardsform', {}).show();
    },

    /**
     * Refresh main grid of paycards
     * @param   {object} Btn
     */ 
    RefreshMainGrid: function (Btn){
        Btn.up('gridpanel').getDockedItems('toolbar')[0].refreshGrid();
    },

    /**
     * Modify columns of grid, reload
     * @param   {object} combo
     */ 
    UpdateGridView: function (combo){
        var value   = combo.getValue(),
            grid    = combo.findParentByType('gridpanel'),
            tb      = grid.getDockedItems('toolbar')[0],
            actDate = tb.getComponent('cardActivated');

        grid.columns[5][ value == 0 ? 'show' : 'hide' ]();
        grid.columns[8][ value == 0 ? 'show' : 'hide' ]();
        grid.columns[6][ value == 0 ? 'hide' : 'show' ]();
        grid.columns[9][ value == 0 ? 'hide' : 'show' ]();
        actDate.setDisabled( value == 0 );
        if (value == 0) {
            actDate.setValue(null);
        }
        tb.refreshGrid();
    },


    /**
     * Send form info for generate paycards
     * @param   {object} form
     */ 
    SendFormInfo: function(Btn){
        var form = Btn.up('window').down('form');
        form.submit({
            clientValidation: true,
            url: 'index.php/api/paycards/generate',
            success: function(form, action) {
               Btn.up('window').close();
               this.getPaycardsStore().reload();
            },
            scope: this
        });
    },

    /**
     * Set currency according selected cardset
     * @param   {object} combobox
     * @param   {object} records
     */ 
    SetCurrency: function(combo, records){
        combo.up('form').getComponent('currName').setValue(records[0].get('cur_name'));
    },

    /**
     * Download all paycards
     */ 
    DownloadAllCards: function() {
        if (!this.fileUploadingIframe) this.fileUploadingIframe = Ext.DomHelper.append(Ext.getBody(), { tag: "iframe" });
        this.fileUploadingIframe.src = "index.php/api/paycards/export";
    },

    /**
     * Download paycards which is on current page
     */ 
    DownloadCardsOnPage: function() {

        if (!this.fileUploadingIframe) {
            this.fileUploadingIframe = Ext.DomHelper.append(Ext.getBody(), { tag: "iframe" });
        }

        var store   = this.getPaycardsStore(),
            params  = store.proxy.extraParams,
            sort    = ['create_date', 'fullsearch', 'is_activated', 'searchtype', 'set_id', 'activate_date'],
            url     = 'index.php/api/paycards/export?applyfilter=true';

        for (var i = 0; i< sort.length; i++) {
            if (!Ext.isEmpty(params[sort[i]])) {
                url+= '&' + sort[i] + '=' + params[sort[i]];
            }
        }

        url+= '&start='+store.currentPage + '&limit=' +store.pageSize;
        this.fileUploadingIframe.src = url;
    }
});
