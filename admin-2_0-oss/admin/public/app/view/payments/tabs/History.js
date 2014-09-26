Ext.define('OSS.view.payments.tabs.History', {
    extend: 'Ext.grid.Panel',
    frame: true,
    minHeight: 400,
    initComponent: function() {
        if (!this.tbar) {
            this.tbar = [];
        }
        this.tbar.unshift(
            {
                xtype: 'datefield',
                fieldLabel: OSS.Localize.get('Since'),
                labelWidth: 'auto',
                name: 'date_from',
                format: 'Y-m-d',
                value: Ext.Date.format(new Date(), 'Y-m-01'),
                padding: '0 20 0 0',
                allowBlank: false
            },
            {
                xtype: 'datefield',
                fieldLabel: OSS.Localize.get('Till'),
                labelWidth: 'auto',
                name: 'date_to',
                format: 'Y-m-d',
                value: Ext.Date.format(Ext.Date.add(
                    new Date(), 
                    Ext.Date.MONTH, 
                    1
                ), 'Y-m-01'),
                padding: '0 20 0 0',
                allowBlank: false
            },
            { xtype: 'find' }
        );
        this.dockedItems = [{ xtype: 'pagingtoolbar', store: this.getGridStore() }];
        this.store = this.getGridStore();
        this.callParent( arguments );
        this.on( 'tabactivated', this.doLoadHistory, this );
        this.on( 'agreementchanged', this.loadHistory, this );
        this.down( 'toolbar > #find' ).on( 'click', this.doLoadHistory, this );
    },
    dateColumnRenderer: function( value, meta ) {
        meta.tdAttr = 'data-qtip="' + Ext.Date.format( value, 'd.m.Y H:i') + '"';
        return Ext.Date.format( value, 'd.m.Y');
    },
    doLoadHistory: function() {
        this.down('toolbar').refreshGrid({ agrm_id: this.agrm_id });
    },
    loadHistory: function( activeTab ) {
        if (activeTab.getItemId() == this.getItemId()) {
            this.doLoadHistory();
        }
    },
    getGridStore: function() { throw "define getGridStore method"; },
    getSymbolField: function() { throw "define getSymbolField method"; },
    getAmountField: function() { return 'amount'; },
    getSumColumn: function() {
        return {
            header: OSS.Localize.get('Sum'),
            dataIndex: this.getAmountField(),
            renderer: function(value, metaData, record) {
                return Ext.Number.toFixed(value, 2) + ' ' + record.get( this.getSymbolField() );
            }
        };
    }
});
