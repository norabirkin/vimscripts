Ext.define( 'OSS.ux.form.field.combogrid.Grid', {
    extend: 'Ext.grid.Panel',
    floating: true,
    initComponent: function() {
        this.store.on( 'beforeload', function() {
            if (this.getSelectionModel().store) {
                this.getSelectionModel().deselectAll();
            }
        }, this);
        this.store.on( 'load', function(){
            if (this.pickerField) {
                if (OSS.ux.form.field.ComboGrid.useBufferedStore()) {
                    this.pickerField.getGridBbar().setTotal(this.store.getTotalCount());
                }
                this.pickerField.selectChoosenItem();
            }
        }, this);
        this.on( "itemclick", function() {
            this.pickerField.collapse();
            var value = this.getSelectionModel().getSelection();
            this.pickerField.doExpandOnFocus = true;
            this.pickerField.setValue( value[0].get( this.pickerField.valueField ) );
            this.pickerField.fireEvent('select', this.pickerField, value);
        }, this);
        this.callParent(arguments);
    }
});
