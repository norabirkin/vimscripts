Ext.define( 'OSS.view.addresses.form.Item', {
    extend: 'Ext.container.Container',
    mixins: [ 'OSS.view.addresses.form.item.Interface' ],
    layout: 'hbox',
    params: [],
    turnedOn: true,
    buttonSize: 22,
    initComponent: function() {
        this.items = [
            this.getField(),
            { xtype: 'container', padding: '0 10 0 10', items: [this.getEditButton()] },
            this.getClearButton()
        ];
        this.callParent( arguments );
    },
    getCode: function() { 
        var value = parseInt( this.getValue() );
        if (!value || isNaN(value)) {
            return 0;
        }
        return value;
    },
    __onValueRecordChanged: function(record) {
    },
    getPostCode: function( itemId ) {
        var record,
            postcode;
        if (!this.getParam(itemId) || this.getParam(itemId) <= 0) {
            return null;
        }
        record = this.getItem(itemId).getSelectedRecord(this.getParam(itemId));
        if (!record) {
            return null;
        }
        postcode = record.get( 'postcode' ); 
        postcode = parseInt( postcode );
        if (isNaN(postcode) || postcode <= 0) {
            return null;
        }
        return postcode;
    },
    setPostCode: function() {
        var postcode;
        postcode = this.getPostCode( 'building_id' );
        if (!postcode) {
            postcode = this.getPostCode('street_id');
        }
        if (!postcode) {
            postcode = '';
        }
        this.getItem('postcode').setValue( postcode );
    },
    eachItems: function( items, callback ) {
        var i,
            result;
        for (var i = 0; i < items.length; i ++) { 
            result = Ext.bind( callback, this )( this.getItem(items[i]) );
            if (result === false) {
                break;
            }
        }
    },
    onChange: function() {},
    setParamsChangingHandler: function() {
        this.eachItems( this.params, function(item) {
            item.on( 'change', this.onParamsChanged, this );
        });
    },
    onParamsChanged: function() {
        if (!this.turnedOn || this.loadingValues()) {
            return false;
        };
        this.setValue( null );
        return true;
    },
    isNotEmpty: function( item ) {
        this.getItem(item).on('empty', this.turnOff, this);
        this.getItem(item).on( 'notempty', this.turnOn, this);
    },
    allIsNotEmpty: function( params ) {
        this.eachItems( params, function( item ) {
            item.on('empty', this.turnOff, this);
            item.on( 'notempty', function() {
                if (!this.turnedOn && this.checkAllIsNotEmpty(params)) {
                    this.turnOn();
                }
            }, this);
        });
    },
    atLeastOneIsNotEmpty: function( params ) {
        this.eachItems( params, function(item) {
            item.on('notempty', this.turnOn, this);
            item.on( 'empty', function() {
                if (this.turnedOn && !this.checkAtLeastOneIsNotEmpty(params)) {
                    this.turnOff();
                }
            }, this);
        });
    },
    checkAllIsNotEmpty: function( params ) {
        var result = true;
        this.eachItems( params, function(item) {
            if (!item.getValue()) {
                result = false;
                return false;
            }
        });
        return result;
    },
    checkAtLeastOneIsNotEmpty: function( params ) {
        var result = false;
        this.eachItems( params, function(item) {
            if (item.getValue()) {
                result = true;
                return false;
            }
        });
        return result;
    },
    turnOn: function() {
        if (this.turnedOn) {
            return;
        }
        this.getField().enable();
        this.getEditButton().enable();
        this.getClearButton().enable();
        this.turnedOn = true;
    },
    turnOff: function() {
        if (!this.turnedOn) {
            return;
        }
        this.getField().disable();
        this.getEditButton().disable();
        this.getClearButton().disable();
        this.setValue( null );
        this.turnedOn = false;
    },
    setValue: function( value, descr ) {
        if (this.value === value) {
            return false;
        }
        this.value = value;
        this.setParam( this.getItemId(), value );
        this.fireChangeEvents();
        this.onChange();
        return true;
    },
    fireChangeEvents: function() {
        if (this.value) {
            this.fireEvent( 'notempty' );
        } else {
            this.fireEvent('empty');
        }
        this.fireEvent( 'change' );
    },
    getValue: function() {
        return this.value;
    },
    clear: function() {
        this.setValue( null );
    },
    setExtraParams: function( store ) {
        var params = this.getParams(),
            i;
        for (i in params) {
            store.proxy.extraParams[i] = params[i];
        }
    },
    loadStore: function( store ) {
        this.setExtraParams( store );
        store.load();
    },
    setItemSavedHandler: function() { throw 'define setItemSavedHandler method'; },
    getField: function() { throw 'define getField method'; },
    getSelectedRecord: function() { throw 'define getSelectedRecord method'; },
    getEditButton: function() { throw 'define getEditButton method'; },
    getClearButton: function() {
        if ( !this.clearButton ) {
            this.clearButton = Ext.create( 'Ext.button.Button', {
                iconCls: 'x-ibtn-remove',
                handler: Ext.bind( this.clear, this )
            });
        }
        return this.clearButton;
    },
    chooseItem: function() {
        var record = this.getSelectedItem();
        if (!record) {
            return;
        }
        this.setValue( record.get('record_id') );
        this.getEditWindow().hide();
    },
    findRecordById: function( store, id ) {
        var index = store.findExact( 'record_id', id );
        if (index === -1) {
            return null;
        } else {
            return store.getAt( index );
        }
    },
    getSelectedItem: function() {
        return this.getGrid().getSelectionModel().getSelection()[0];
    },
    showEditWindow: function() {
        this.getEditWindow( this.getItemId() ).show();
        this.loadStore( this.getGridStore() );
        this.setChooseButtonHandler();
        this.setItemSavedHandler();
    },
    getGrid: function() {
        if (!this.grid) {
            this.grid = this.getEditWindow().getGrid( this.getItemId() );
            this.grid.on('aftersave', this.onGridItemSaved, this);
        }
        return this.grid;
    },
    onGridItemSaved: function(record, grid) {
        if (record.get('record_id') == this.getValue()) {
            this.__onValueRecordChanged(record);
            this.onValueRecordChanged(record);
        }
    },
    getGridStore: function() {
        if (!this.gridStore) {
            this.gridStore = this.getGrid().getStore();
        }
        return this.gridStore;
    },
    setChooseButtonHandler: function() {
        if (!this.getGrid().chooseButtonHandlerSet) { 
            this.getGrid().down( 'toolbar > #actions > #choose' ).on( 'click', this.chooseItem, this ); 
            this.getGrid().chooseButtonHandlerSet = true; 
        }
    }
});
