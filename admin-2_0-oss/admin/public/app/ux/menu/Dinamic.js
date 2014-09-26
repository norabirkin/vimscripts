/**
 * Меню, элементы которого подгружаются из хранилища
 */
Ext.define('OSS.ux.menu.Dinamic', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.dinamicmenu',
    autoScroll: true,
    applyStore: function(value) {
        this.store = (typeof value == 'string' ? Ext.data.StoreManager.lookup(value) : value);
    },
    store: null,
    valueField: 'id',
    displayField: 'name',
    displayTpl: null,
    initComponent: function() {
        this.applyStore(this.store);
        this.applyDisplayTpl(this.displayTpl);
        this.callParent(arguments);
    },
    setDisplayTpl: function(value) {
        this.applyDisplayTpl(value);
        this.onLoad();
    },
    applyDisplayTpl: function(value) {
        if (!value) {
            value = new Ext.XTemplate('<tpl for=".">{'+this.displayField+'}</tpl>');
        }
        if (!value.isTemplate) {
            value = new Ext.XTemplate(value);
        }
        this.displayTpl = value;
    },
    initialLoad: function() {
        var callback = function() {
                this.store.on('datachanged', this.onLoad, this);
                this.onLoad();
            },
            params = {
                scope: this
            };
        if (this.store.lazy) {
            params.received = callback;
        } else {
            params.callback = callback;
        }
        this.store.load(params);
    },
    onLoad: function() {
        if (this.skipLoad) {
            return;
        }
        var items = [];
        this.store.each(function(item) {
            items.push({
                text: this.displayTpl.apply(item.data),
                value: item.get(this.valueField)
            });
        }, this);
        this.removeAll();
        this.add(items);
    }
});
