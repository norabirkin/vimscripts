Ext.define('OSS.ux.form.field.ComboGrid', {
    extend: 'Ext.form.field.Picker',
    mixins: ['OSS.ux.form.field.text.Delayed'],
    resizable: true,
    gridHeight: 277,
    hideTrigger: true,
    requires: [
        'OSS.ux.form.field.combogrid.Grid',
        'OSS.ux.form.field.text.Search',
        'OSS.ux.form.field.combogrid.grid.PagingBar',
        'OSS.ux.form.field.combogrid.grid.TotalBar'
    ],
    alias: 'widget.combogrid1',
    initComponent: function() {
        if (this.resizable) {
            this.resizable = false;
            this._resizable = true;
        }
        this.initSearch();
        this.callParent( arguments );
    },
    dontExpandOnFocus: false,
    initSearch: function() {
        this.defaultMode = true;
        this.on('focus', this.expandOnFocus, this);
        this.getQueryParam = function() {
            return this.getRawValue();
        };
        this.init();
    },
    expandOnFocus: function() {
        if (this.dontExpandOnFocus) {
            return;
        }
        this.expand();
        this.dontExpandOnFocus = true;
        this.focus();
        this.dontExpandOnFocus = false;
    },
    doExpandOnFocus: false,
    onFocus: function() {
        if (this.defaultMode && this.doExpandOnFocus) {
            this.doExpandOnFocus = false;
            this.expandOnFocus();
        }
        this.callParent(arguments);
    },
    mimicBlur: function(e) {
        if (e.target.className.indexOf('x-boundlist-item') == -1) {
            this.callParent(arguments);
        }
    },
    collapseIf: function(e) {
        if ( e.target.className.indexOf('x-boundlist-item') == -1 ) {
            this.callParent(arguments);
        }
    },
    getSubmitData: function() {
        var data = {};
        data[ this.getName() ] = this.getValue();
        return data;
    },
    getValue: function() {
        if (this.value) {
            return this.value;
        }
        return this.callParent();
    },
    loadOnRender: true,
    expand: function() {
        if (this.readOnly) {
            return;
        }
        this.callParent( arguments );
        if (this.store.isLazy) {
            if (!this.store.loadIfNeccessary({
                callback: this.selectChoosenItem,
                scope: this
            })) {
                this.selectChoosenItem();
            }
        } else if (this.store.lazy) {
            this.store.load({
                received: this.selectChoosenItem,
                scope: this
            });
        } else {
            if (this.store.storeIsLoaded || this.loadOnRender) {
                this.selectChoosenItem();
            } else {
                this.store.load({
                    callback: this.selectChoosenItem,
                    scope: this
                });
            }
        }
    },
    selectChoosenItem: function() {
        var record;
        this.getPicker().getSelectionModel().deselectAll();
        if (this.getValue()) {
            record = this.find(this.valueField, this.getValue());
            if (record) {
                this.getPicker().getSelectionModel().select(record);
                this.afterSelectChoosenItem();
            }
        }
    },
    afterSelectChoosenItem: function() {
        this.focus();
    },
    /**
     * Возварщает запись, соответсвующую значению
     */
    getRecord: function() {
        return this.find(this.valueField, this.getValue());
    },
    find: function( field, value ) {
        var index = this.getPicker().store.findExact(field, value);
        if (index == -1) {
            return null;
        }
        return this.getPicker().store.getAt(index);
    },
    valueToRaw: function( value ) {
        var record = this.find(this.valueField, value);
        if (record) {
            return record.get( this.displayField );
        } else {
            return '';
        }
    },
    rawToValue: function( raw ) {
        var record;
        if (!raw || raw == '') {
            return null;
        }
        record = this.find( this.displayField, raw );
        if (record) {
            return record.get( this.valueField );
        } else {
            return null;
        }
    },
    columns: [],
    /**
     * Возвращает колонки
     */
    getColumns: function() {
        return this.columns;
    },
    storeClassName: function() {
        throw 'Store class name is not specified';
    },
    statics: {
        useBufferedStore: function() {
            return false;
        },
        createStore: function(className) {
            return Ext.create(className, OSS.ux.form.field.ComboGrid.storeConfig());
        },
        storeConfig: function() {
            if (OSS.ux.form.field.ComboGrid.useBufferedStore()) {
                return {
                    pageSize: 100
                   // buffered: true,
                   //leadingBufferZone: 300
                };
            } else {
                return {
                    pageSize: 10
                    //buffered: false,
                   // leadingBufferZone: null
                };
            }
        }
    },
    /**
     * Устанавливает значение для комбогрида, создавая элемент хранилища, если необходимо
     *
     * @param value {mixed} значение
     * @param display {String} отображение значения
     */
    setValueWithDisplay: function(value, display) {
        this.setValue(value); 
        if (this.getRawValue() === "") {
            this.setRawValue(display);
        }
    },
    /**
     * Устанавливает значение для комбобокса, создавая элемент хранилища, если необходимо
     *
     * @param record {Ext.data.Model} запись
     */
    setValueByRecord: function(record) {
        if (!record) {
            this.setValue(null);
            return;
        }
        if (this.getStore().findExact(this.valueField, record.get(this.valueField)) == -1) {
            this.getStore().add(record);
        }
        this.setValue(record.get(this.valueField));
    },
    getStore: function() {
        if (!this.store) {
            this.store = OSS.ux.form.field.ComboGrid.createStore(this.storeClassName());
        } else {
            if (typeof this.store == 'string') {
                this.store = Ext.data.StoreManager.lookup(this.store);
            }
        }
        return this.bindLoadHandler(this.store);
    },
    bindLoadHandler: function(store) {
        if (this.loadOnRender) {
            return store;
        }
        if (!store.loadHandlerBinded) {
            store.loadHandlerBinded = true;
            store.on('load', function() {
                store.storeIsLoaded = true;
            });
        }
        return store;
    },
    getGridClassName: function() {
        return 'OSS.ux.form.field.combogrid.Grid';
    },
    getGridBbar: function() {
        var bbar;
        if (!this.gridBbar) {
            if (OSS.ux.form.field.ComboGrid.useBufferedStore()) {
                bbar = Ext.create('OSS.ux.form.field.combogrid.grid.TotalBar');
            } else {
                bbar = Ext.create('OSS.ux.form.field.combogrid.grid.PagingBar', {
                    store: this.getStore()
                });
            }
            this.gridBbar = bbar;
        }
        return this.gridBbar;
    },
    getGridConfig: function() {
        var params = {
            pickerField: this,
            height: this.gridHeight,
            width: this.width,
            columns: this.getColumns(),
            store: this.getStore(),
            queryDelay: this.queryDelay,
            tbar: this.tbar,
            bbar: this.getGridBbar(),
            resizable: this._resizable
        };
        if (this.pickerWidth) {
            params.minWidth = this.pickerWidth;
        }
        if (OSS.ux.form.field.ComboGrid.useBufferedStore()) {
            params.plugins = 'bufferedrenderer';
        }
        return params;
    },
    beforeQuery: function() {
        if (!OSS.ux.form.field.ComboGrid.useBufferedStore()) {
            this.getStore().currentPage = 1;
        }
    },
    createPicker: function() {
        var grid = Ext.create(this.getGridClassName(), this.getGridConfig());
        if (this.loadOnRender && !this.store.lazy) {
            grid.store.load();
        }
        return grid;
    }
});
