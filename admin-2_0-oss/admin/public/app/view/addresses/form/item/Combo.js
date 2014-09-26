Ext.define( 'OSS.view.addresses.form.item.Combo', {
    extend: 'OSS.view.addresses.form.Item',
    getField: function() {
        if ( !this.field ) {
            if (!this.displayField) {
                this.displayField = 'name';
            }
            this.field = Ext.create( 'Ext.form.field.ComboBox', {
                fieldLabel: this.fieldLabel,
                xtype: 'combo',
                editable: false,
                displayField: this.displayField,
                labelWidth: this.getFieldLabelWidth(),
                valueField: 'record_id',
                store: this.store,
                flex: 1
            });
            this.store.proxy.extraParams = this.getParams();
            this.field.on( 'change', this.onComboBoxValueChanged, this );
        }
        return this.field;
    },
    getValueDescription: function() {
        var index = this.getComboStore().findExact( 'record_id', this.getValue() );
        if (index === -1) {
            return '';
        } else {
            return this.getComboStore().getAt( index ).get( this.displayField );
        }
    },
    onComboBoxValueChanged: function( combo, value ) {
        this.setValue( value );
    },
    __onValueRecordChanged: function(record) {
        var comborecord = this.getSelectedRecord(this.getValue()),
            i;
        for (i in comborecord.data) {
            comborecord.set(i, record.get(i));
        }
    },
    setComboText: function( value, display ) {
        var store = this.getComboStore();
        if ( !store.findRecord('record_id', value) ) {
            store.removeAll(); 
            var data = { record_id: value };
            data[ this.displayField ] = display;
            store.add( data );
        }
    },
    getSelectedRecord: function( value ) {
        return this.findRecordById( this.getComboStore(), value );
    },
    setValue: function( value, descr ) {
        var result = this.callParent( arguments );
        if (result) {
            if ( descr ) { 
                this.setComboText(value, descr); 
            }
            if (value) {
                this.getField().setValue( value );
            } else {
                this.getField().reset();
            }
        }
    },
    loadComboStore: function() {
        this.loadStore( this.getComboStore() );
    },
    setItemSavedHandler: function() {
        if (!this.getGrid().itemSavedHandlerSet) { 
            this.getGrid().on( 'itemsaved', this.loadComboStore, this ); 
            this.getGrid().on( 'itemsremoved', this.loadComboStore, this ); 
            this.getGrid().itemSavedHandlerSet = true; 
        }
    },
    getEditButton: function() {
        if ( !this.editButton ) {
            this.editButton = Ext.create( 'Ext.button.Button', {
                xtype: 'button',
                itemId: 'add',
                iconCls: 'x-ibtn-add',
                height: this.buttonSize,
                width: this.buttonSize,
                tooltip: this.buttonTooltip,
                handler: Ext.bind( this.showEditWindow, this )
            });
        }
        return this.editButton;
    },
    getComboStore: function() { return this.store; },
    onParamsChanged: function() {
        var result = this.callParent( arguments );
        if (result) {
            this.getComboStore().load();
        }
    }
});
