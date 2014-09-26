Ext.define( 'OSS.view.addresses.form.item.PostCode', {
    extend: 'Ext.form.field.Display',
    itemId: 'postcode',
    mixins: [ 'OSS.view.addresses.form.item.Interface' ],
    initComponent: function() {
        this.labelWidth = this.getFieldLabelWidth();
        this.callParent( arguments );
    },
    fieldLabel: OSS.Localize.get('Post code'),
    getCode: function() { return null; },
    setValue: function( value, descr ) {
        if ( value === undefined || isNaN(value) ) { 
            descr = parseInt( descr );
            if (isNaN(descr)) {
                descr = '';
            }
            arguments[0] = descr;
        }
        this.callParent( arguments );
    },
    getValueDescription: function() {
        return this.getValue();
    }
});
