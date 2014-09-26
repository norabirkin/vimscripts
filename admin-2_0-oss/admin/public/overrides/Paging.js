Ext.define( 'OSS.overrides.toolbar.Paging', function() { return {
    override: 'Ext.PagingToolbar',
    dock: 'bottom',
    displayInfo: true,
    showLimitCombo: true,
    changeStore: function( store ) {
        this.store = store;
        this.onLoad();
        this.bindStore( store );
        if (this.showLimitCombo) {
            this.limitCombo.setValue(this.getStore().pageSize || 0);
        }
    },
    doRefresh : function(){
        var me = this,
            current = me.store.currentPage;

        if (me.fireEvent('beforechange', me, current) !== false) {
            me.store.loadPage(current, {
                force: true
            });
        }
    },
    initComponent: function() {
        var i,
            text = [ 'beforePageText', 'afterPageText', 'displayMsg', 'emptyMsg' ];
        for (i = 0; i < 4; i ++) {
            this[text[i]] = i18n.get(this[text[i]]);
        }
        this.callParent( arguments );
        if (this.showLimitCombo) {
            this.limitCombo = Ext.create('Ext.form.field.ComboBox', {
                width: 70,
                displayField: 'value',
                queryMode: 'local',
                value: (this.getStore().pageSize || 0),
                store: Ext.create('Ext.data.Store', {
                    fields: ['value'],
                    data: [
                        { value: 50 },
                        { value: 100 },
                        { value: 500 }
                    ]
                })
            });
            this.limitCombo.on('select', function() {
                this.getStore().pageSize = this.limitCombo.getValue();
                this.getStore().load();
            }, this);
            this.add(this.limitCombo);
        }
    }
}; }());
