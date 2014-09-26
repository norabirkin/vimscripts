Ext.define("OSS.controller.MatrixDiscounts", {
    extend: 'Ext.app.Controller',
    views: [
        'MatrixDiscounts',
        'promotions.PromotionsSelectForm',
        'packets.PacketsSelectForm'
    ],
    view: 'MatrixDiscounts',
    stores: [
        'matrixdiscounts.MatrixDiscounts',
        'promotions.List',
        'packets.List'
    ],
    requires: [
        'Ext.grid.plugin.CellEditing'
    ],
    refs: [{
        selector: 'matrixdiscounts > gridpanel > toolbar > #actions > menu > #addPersonDiscBtn', // root
        ref: 'personalDiscountBtn'
    }],
    init: function() {
        this.control({
            'matrixdiscounts': {
                afterrender:   this.initMatrixDiscountsList
            },
            'matrixdiscounts > * actioncolumn': {
                click: this.deleteMatrixDiscount
            },
            'matrixdiscounts > gridpanel > toolbar > #actions > menu > #addPromotionBtn': {
                click: this.showPromotionsForm
            },
            'matrixdiscounts > gridpanel > toolbar > #actions > menu > #addPacketBtn': {
                click: this.showPacketsForm
            },
            'matrixdiscounts > gridpanel > toolbar > #actions > menu > #addPersonDiscBtn': {
                click: this.addPersonalDiscount
            },
            'promotionsselect': {
                afterrender: this.showPromotionsList
            },
            'promotionsselect > gridpanel > toolbar > button#assignPromotionsBtn': {
                click: this.assignSelectedPromotions
            },
            'packetsselect > gridpanel > toolbar > button#assignPacketsBtn': {
                click: this.assignSelectedPackets
            },
            'packetsselect': {
                afterrender: this.showPacketsList
            }
        });
    },

    /**
     * Refresh main grid of discounts
     * @param   {object} grid
     */ 
    initMatrixDiscountsList: function(grid){
        var store = grid.items.get(0).getStore();
        store.load();

        store.on('update', function(store, record, event, rowIndex){
            this.updateMatrixDiscount(store, record);
        }, this);

        store.on('load', function(store){
            this.updateToolbarButtons(store);
        }, this);
    },

    /**
     * Delete selected record
     */ 
    deleteMatrixDiscount: function(grid, el, rowIndex, colIndex, event, record){
        Ext.Msg.confirm(OSS.Localize.get('Deleting entry'), OSS.Localize.get('Do you realy want to delete this entry?'), function(button) {
            if (button === 'yes') { 
                if (record.get('type') == 3) {
                    this.getPersonalDiscountBtn().setDisabled(false);
                }
                record.destroy();
            }
        }, this);
    },

    /**
     * Show form to add new promotions
     */ 
    showPromotionsForm: function() {
        Ext.widget('promotionsselect', {}).show();
    },

    /**
     * Refresh grid of promotions
     * @param   {object} form
     */ 
    showPromotionsList: function(form) {
        form.items.get(0).getStore().load();
    },


    /**
     * Assign selected promotions to matrix discount
     * @param   {object} button
     */ 
    assignSelectedPromotions: function(Btn){

        var ids = [],
            win = Btn.up('window');

        Ext.each(win.down('gridpanel').getSelectionModel().getSelection(), function(item){
            ids.push(item.get("record_id"));
        }, this);
        ids = ids.join(',');

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/matrixdiscounts/setPromotions"),
            params: {ids: ids},
            callback: function() {
                win.close();
                this.getMatrixdiscountsMatrixDiscountsStore().reload();
            },
            scope: this
        }); 
    },

    /**
     * Update matrix discount on grid editing
     * @param   {object} store
     * @param   {object} record
     */ 
    updateMatrixDiscount: function(store, record){
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/matrixdiscounts/updateRecord"),
            params: {
                method: record.get('method'),
                id: record.get('id')
            },
            callback: function() {
                this.getMatrixdiscountsMatrixDiscountsStore().reload();
            },
            scope: this
        });
    },


    /**
     * Assign selected packets to matrix discount
     * @param   {object} button
     */ 
    assignSelectedPackets: function(Btn){
        var ids = [],
            win = Btn.up('window');

        Ext.each(win.down('gridpanel').getSelectionModel().getSelection(), function(item){
            ids.push(item.get("packet_id"));
        }, this);
        ids = ids.join(',');

        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/matrixdiscounts/setPackets"),
            params: {ids: ids},
            callback: function() {
                win.close();
                this.getMatrixdiscountsMatrixDiscountsStore().reload();
            },
            scope: this
        }); 
    },

    /**
     * Show form to add new packets
     */ 
    showPacketsForm: function() {
        Ext.widget('packetsselect', {}).show();
    },

    /**
     * Refresh grid of packets
     * @param   {object} form
     */ 
    showPacketsList: function(form) {
        form.items.get(0).getStore().load();
    },


    /**
     * Add personal discount
     */ 
    addPersonalDiscount: function(){
        Ext.Ajax.request({
            url:  Ext.Ajax.getRestUrl("api/matrixdiscounts/setPersonalDiscount"),
            callback: function() {
                this.getMatrixdiscountsMatrixDiscountsStore().reload();
            },
            scope: this
        }); 
    },


    /**
     * Update toolbar buttons when store loaded
     */
    updateToolbarButtons: function(store){
        this.getPersonalDiscountBtn().setDisabled(store.find('type', 3) === -1 ? false : true);
    }
    
});
