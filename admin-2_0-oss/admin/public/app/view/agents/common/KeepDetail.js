Ext.define( 'OSS.view.agents.common.KeepDetail', {
    extend: "Ext.form.field.Number",
    labelWidth: 300, 
    fieldLabel: i18n.get("Keep detail data in the storage"), 
    value: 0, 
    minValue: 0,
    name: "keepdetail",
    getZeroValueDescription: function() {
        return i18n.get( "Always" );
    },
    rawToValue: function( raw ) {
        if (raw == this.getZeroValueDescription()) {
            return 0;
        }
        return this.callParent( [raw] );
    },
    valueToRaw: function( value ){
        if (value == 0) {
            return this.getZeroValueDescription();
        }
        return this.callParent( [value] );
    },
    processRawValue: function( raw ) {
        if (raw == this.getZeroValueDescription()) {
            return 0;
        }
        return this.callParent( [raw] );    
    }
});
