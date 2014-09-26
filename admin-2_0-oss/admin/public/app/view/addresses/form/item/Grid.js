Ext.define( 'OSS.view.addresses.form.item.Grid', {
    extend: 'OSS.view.addresses.form.Item',
    getField: function() {
        if ( !this.field ) {
            this.field = Ext.create( 'Ext.form.field.Display', { 
                fieldLabel: this.fieldLabel, flex: 1,
                labelWidth: this.getFieldLabelWidth()
            });
        }
        return this.field;
    },
    getValueDescription: function() {
        return this.getField().getValue();
    },
    setValue: function( value, descr ) {
        if (descr) {
            this.getField().setValue(descr);
        } else {
            this.renderValue(value);
        }
        this.callParent( arguments );
    },
    setItemSavedHandler: function() {
        if (!this.getGrid().itemSavedHandlerSet) { 
            this.getGrid().on( 'itemsaved', this.rerenderValue, this ); 
            this.getGrid().on( 'itemsremoved', this.clearValueIfRemoved, this ); 
            this.getGrid().itemSavedHandlerSet = true; 
        }
    },
    rerenderValue: function() {
        this.renderValue( this.getValue() );
    },
    clearValueIfRemoved: function() {
        if (!this.getSelectedRecord(this.getValue())) {
            this.setValue(null);
        }
    },
    renderValue: function( value ) {
        this.getField().setValue( this.renderer(this.getSelectedRecord( value )) );
    },
    getSelectedRecord: function( value ) {
        return this.findRecordById( this.getGridStore(), value );
    },
    renderer: function( record ) {
        if (!record) {
            return '';
        }
        return record.get('short') + ' ' + record.get('name');
    },
    getEditButton: function() {
        if ( !this.editButton ) {
            this.editButton = Ext.create( 'Ext.button.Button', {
                itemId: 'choose',
                text: '...',
                tooltip: this.buttonTooltip,
                height: this.buttonSize,
                width: this.buttonSize,
                handler: Ext.bind( this.showEditWindow, this )
            });
        }
        return this.editButton;
    }
});
